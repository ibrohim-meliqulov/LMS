import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { UserRole } from '@prisma/client';
import { CreateQuestionDto } from './dto/create-question.dto';

@Injectable()
export class QuestionService {
    constructor(private prisma: PrismaService) {}

    async create(dto: CreateQuestionDto, file: string | undefined, userId: number) {
        const course = await this.prisma.course.findUnique({
            where: { id: dto.courseId, status: 'active' },
        });

        if (!course) throw new NotFoundException('Course not found');

        const purchased = await this.prisma.purchasedCourse.findFirst({
            where: { courseId: dto.courseId, userId, status: 'active' },
        });

        if (!purchased) {
            throw new ForbiddenException('You have not purchased this course');
        }

        const question = await this.prisma.question.create({
            data: {
                courseId: dto.courseId,
                text: dto.text,
                file,
                userId,
            },
        });

        return { success: true, data: question };
    }

    async findByCourse(courseId: number, userId: number, role: UserRole) {
        const course = await this.prisma.course.findUnique({
            where: { id: courseId },
        });

        if (!course) throw new NotFoundException('Course not found');

        const purchased = await this.prisma.purchasedCourse.findFirst({
            where: { courseId, userId, status: 'active' },
        });

        const isMentor = course.mentorId === userId;
        const isAdminOrAssistant = role === UserRole.ADMIN || role === UserRole.ASSISTANT;

        if (!purchased && !isMentor && !isAdminOrAssistant) {
            throw new ForbiddenException('You do not have access to this course');
        }

        const questions = await this.prisma.question.findMany({
            where: { courseId },
            include: {
                user: { select: { id: true, fullName: true, image: true } },
                answer: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        return { success: true, data: questions };
    }

    async markAsRead(id: number, userId: number, role: UserRole) {
        const question = await this.prisma.question.findUnique({
            where: { id },
            include: { course: true },
        });

        if (!question) throw new NotFoundException('Question not found');

        if (role !== UserRole.ADMIN && question.course.mentorId !== userId) {
            throw new ForbiddenException('This is not your course');
        }

        const updated = await this.prisma.question.update({
            where: { id },
            data: { read: true, readAt: new Date() },
        });

        return { success: true, data: updated };
    }
}
