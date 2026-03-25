import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { Status, UserRole } from '@prisma/client';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { UpdateHomeworkDto } from './dto/update-homework.dto';

@Injectable()
export class HomeworkService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateHomeworkDto, filename: string | undefined, mentorId: number) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id: dto.lessonId, status: Status.active },
            include: { section: { include: { course: true } } },
        });
        if (!lesson) throw new NotFoundException('Lesson not found');

        if (lesson.section.course.mentorId !== mentorId) {
            throw new ForbiddenException('This is not your course');
        }

        const exists = await this.prisma.homework.findUnique({
            where: { lessonId: dto.lessonId },
        });
        if (exists && exists.status === Status.active) {
            throw new BadRequestException('Homework already exists for this lesson');
        }

        const data = await this.prisma.homework.create({
            data: {
                lessonId: dto.lessonId,
                task: dto.task,
                file: filename,
            },
        });

        return { success: true, data };
    }

    async findByLesson(lessonId: number, userId: number, role: UserRole) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id: lessonId, status: Status.active },
            include: { section: { include: { course: true } } },
        });
        if (!lesson) throw new NotFoundException('Lesson not found');

        if (role !== UserRole.ADMIN && role !== UserRole.ASSISTANT) {
            const purchased = await this.prisma.purchasedCourse.findFirst({
                where: { courseId: lesson.section.courseId, userId, status: Status.active },
            });
            const isMentor = lesson.section.course.mentorId === userId;

            if (!purchased && !isMentor) {
                throw new ForbiddenException('You have not purchased this course');
            }
        }

        const data = await this.prisma.homework.findUnique({
            where: { lessonId, status: Status.active },
            select: {
                id: true,
                task: true,
                file: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!data) throw new NotFoundException('Homework not found');

        return { success: true, data };
    }

    async update(id: number, dto: UpdateHomeworkDto, filename: string | undefined, mentorId: number) {
        const homework = await this.prisma.homework.findUnique({
            where: { id },
            include: { lesson: { include: { section: { include: { course: true } } } } },
        });
        if (!homework || homework.status === Status.inactive) {
            throw new NotFoundException('Homework not found');
        }

        if (homework.lesson.section.course.mentorId !== mentorId) {
            throw new ForbiddenException('This is not your course');
        }

        const data = await this.prisma.homework.update({
            where: { id },
            data: {
                ...dto,
                ...(filename && { file: filename }),
            },
        });

        return { success: true, data };
    }

    async remove(id: number, userId: number, role: UserRole) {
        const homework = await this.prisma.homework.findUnique({
            where: { id },
            include: { lesson: { include: { section: { include: { course: true } } } } },
        });
        if (!homework || homework.status === Status.inactive) {
            throw new NotFoundException('Homework not found');
        }

        if (role !== UserRole.ADMIN) {
            if (homework.lesson.section.course.mentorId !== userId) {
                throw new ForbiddenException('This is not your course');
            }
        }

        await this.prisma.homework.update({
            where: { id },
            data: { status: Status.inactive },
        });

        return { success: true, message: 'Homework removed successfully' };
    }
}