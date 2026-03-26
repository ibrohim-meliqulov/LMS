import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { Status, UserRole } from '@prisma/client';

@Injectable()
export class StudentExamQuestionService {
    constructor(private prisma: PrismaService) {}

    async findByExam(examId: number, mentorId: number, role: UserRole) {
        const exam = await this.prisma.exam.findUnique({
            where: { id: examId },
            include: { section: { include: { course: true } } },
        });

        if (!exam) throw new NotFoundException('Exam not found');

        if (role !== UserRole.ADMIN && exam.section.course.mentorId !== mentorId) {
            throw new ForbiddenException('This is not your course');
        }

        const answers = await this.prisma.studentExamQuestion.findMany({
            where: { examId },
            include: { user: { select: { id: true, fullName: true } } },
        });

        return { success: true, data: answers };
    }
}
