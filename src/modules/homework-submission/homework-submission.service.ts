import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { UserRole } from '@prisma/client';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionStatusDto } from './dto/update-status.dto';

@Injectable()
export class HomeworkSubmissionService {
    constructor(private prisma: PrismaService) {}

    async create(dto: CreateSubmissionDto, file: string, userId: number) {
        const homework = await this.prisma.homework.findUnique({
            where: { id: dto.homeworkId },
            include: { lesson: { include: { section: { include: { course: true } } } } },
        });

        if (!homework || homework.status === 'inactive') {
            throw new NotFoundException('Homework not found');
        }

        const purchased = await this.prisma.purchasedCourse.findFirst({
            where: { courseId: homework.lesson.section.courseId, userId, status: 'active' },
        });

        if (!purchased) {
            throw new ForbiddenException('You have not purchased this course');
        }

        const submission = await this.prisma.homeworkSubmission.create({
            data: {
                homeworkId: dto.homeworkId,
                userId,
                text: dto.text,
                file,
            },
        });

        return { success: true, data: submission };
    }

    async findByHomework(homeworkId: number, userId: number, role: UserRole) {
        const homework = await this.prisma.homework.findUnique({
            where: { id: homeworkId },
            include: { lesson: { include: { section: { include: { course: true } } } } },
        });

        if (!homework) throw new NotFoundException('Homework not found');

        if (role !== UserRole.ADMIN && homework.lesson.section.course.mentorId !== userId) {
            throw new ForbiddenException('This is not your course');
        }

        const submissions = await this.prisma.homeworkSubmission.findMany({
            where: { homeworkId },
            include: { user: { select: { id: true, fullName: true, phone: true } } },
        });

        return { success: true, data: submissions };
    }

    async findMySubmissions(userId: number) {
        const submissions = await this.prisma.homeworkSubmission.findMany({
            where: { userId },
            include: { homework: { include: { lesson: true } } },
            orderBy: { createdAt: 'desc' },
        });

        return { success: true, data: submissions };
    }

    async updateStatus(id: number, dto: UpdateSubmissionStatusDto, userId: number, role: UserRole) {
        const submission = await this.prisma.homeworkSubmission.findUnique({
            where: { id },
            include: { homework: { include: { lesson: { include: { section: { include: { course: true } } } } } } },
        });

        if (!submission) throw new NotFoundException('Submission not found');

        const course = submission.homework.lesson.section.course;
        if (role !== UserRole.ADMIN && course.mentorId !== userId) {
            throw new ForbiddenException('This is not your course');
        }

        const updated = await this.prisma.homeworkSubmission.update({
            where: { id },
            data: dto,
        });

        return { success: true, data: updated };
    }
}
