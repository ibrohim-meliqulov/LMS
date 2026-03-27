import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { Status, UserRole } from '@prisma/client';
import { SubmitExamDto } from './dto/submit-exam.dto';

@Injectable()
export class ExamResultService {
    constructor(private prisma: PrismaService) { }

    async submitExam(dto: SubmitExamDto, userId: number) {
        const section = await this.prisma.sectionLesson.findUnique({
            where: { id: dto.sectionId, status: Status.active },
            include: {
                course: true,
                lessons: { where: { status: Status.active } },
            },
        });
        if (!section) throw new NotFoundException('Section not found');

        const purchased = await this.prisma.purchasedCourse.findFirst({
            where: { courseId: section.courseId, userId, status: Status.active },
        });
        if (!purchased) throw new ForbiddenException('You have not purchased this course');

        const lessonIds = section.lessons.map(l => l.id);

        if (lessonIds.length > 0) {
            const viewedLessons = await this.prisma.lessonView.findMany({
                where: {
                    userId,
                    lessonId: { in: lessonIds },
                    view: true,
                },
            });

            if (viewedLessons.length < lessonIds.length) {
                throw new ForbiddenException(
                    `You must complete all lessons before taking the exam. Completed: ${viewedLessons.length}/${lessonIds.length}`
                );
            }
        }

        const existingResult = await this.prisma.examResult.findFirst({
            where: { sectionId: dto.sectionId, userId },
        });
        if (existingResult) throw new ForbiddenException('You have already taken this exam');

        const exams = await this.prisma.exam.findMany({
            where: { sectionId: dto.sectionId, status: Status.active },
        });
        if (exams.length === 0) throw new NotFoundException('No questions found for this exam');

        let corrects = 0;
        let wrongs = 0;
        const studentAnswersData: any[] = [];

        for (const ans of dto.answers) {
            const question = exams.find(e => e.id === ans.examId);
            if (!question) continue;

            const isCorrect = question.answer === ans.answer;
            if (isCorrect) corrects++;
            else wrongs++;

            studentAnswersData.push({
                examId: question.id,
                userId,
                sectionId: dto.sectionId,
                answer: ans.answer,
                isCorrect,
            });
        }

        wrongs += exams.length - (corrects + wrongs);
        const passed = corrects >= exams.length / 2;

        const result = await this.prisma.$transaction(async tx => {
            if (studentAnswersData.length > 0) {
                await tx.studentExamQuestion.createMany({ data: studentAnswersData });
            }
            return tx.examResult.create({
                data: { passed, corrects, wrongs, sectionId: dto.sectionId, userId },
            });
        });

        return { success: true, data: result, message: 'Exam submitted successfully' };
    }

    async findUserResult(sectionId: number, userId: number) {
        const result = await this.prisma.examResult.findFirst({
            where: { sectionId, userId },
            include: { section: true },
        });

        if (!result) throw new NotFoundException('Exam result not found');

        const answers = await this.prisma.studentExamQuestion.findMany({
            where: { sectionId, userId },
            include: { exam: true },
        });

        return { success: true, data: { result, answers } };
    }

    async findStudentResult(sectionId: number, studentId: number, mentorId: number, role: UserRole) {
        const section = await this.prisma.sectionLesson.findUnique({
            where: { id: sectionId },
            include: { course: true },
        });

        if (!section) throw new NotFoundException('Section not found');

        if (role !== UserRole.ADMIN && section.course.mentorId !== mentorId) {
            throw new ForbiddenException('This is not your course');
        }

        const result = await this.prisma.examResult.findFirst({
            where: { sectionId, userId: studentId },
            include: { user: { select: { id: true, fullName: true, phone: true } } },
        });

        const answers = await this.prisma.studentExamQuestion.findMany({
            where: { sectionId, userId: studentId },
            include: { exam: true },
        });

        return { success: true, data: { result, answers } };
    }
}
