import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { Status } from '@prisma/client';
import { CreateLessonFileDto } from './dto/create-lesson-file.dto';

@Injectable()
export class LessonFileService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateLessonFileDto, filename: string, mentorId: number) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id: dto.lessonId, status: Status.active },
            include: { section: { include: { course: true } } },
        });
        if (!lesson) throw new NotFoundException('Lesson not found');

        if (lesson.section.course.mentorId !== mentorId) {
            throw new ForbiddenException('This is not your course');
        }

        const data = await this.prisma.lessonFile.create({
            data: {
                lessonId: dto.lessonId,
                note: dto.note,
                file: filename,
            },
        });

        return { success: true, data };
    }

    async findByLesson(lessonId: number, userId: number) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id: lessonId, status: Status.active },
            include: { section: { include: { course: true } } },
        });
        if (!lesson) throw new NotFoundException('Lesson not found');

        const purchased = await this.prisma.purchasedCourse.findFirst({
            where: { courseId: lesson.section.courseId, userId, status: Status.active },
        });
        const isMentor = lesson.section.course.mentorId === userId;

        if (!purchased && !isMentor) {
            throw new ForbiddenException('You have not purchased this course');
        }

        const data = await this.prisma.lessonFile.findMany({
            where: { lessonId, status: Status.active },
            select: {
                id: true,
                file: true,
                note: true,
                createdAt: true,
            },
        });

        return { success: true, data };
    }

    async remove(id: number, mentorId: number) {
        const lessonFile = await this.prisma.lessonFile.findUnique({
            where: { id },
            include: { lesson: { include: { section: { include: { course: true } } } } },
        });
        if (!lessonFile || lessonFile.status === Status.inactive) {
            throw new NotFoundException('Lesson file not found');
        }

        if (lessonFile.lesson.section.course.mentorId !== mentorId) {
            throw new ForbiddenException('This is not your course');
        }

        await this.prisma.lessonFile.update({
            where: { id },
            data: { status: Status.inactive },
        });

        return { success: true, message: 'Lesson file removed successfully' };
    }

    async adminRemove(id: number) {
        const lessonFile = await this.prisma.lessonFile.findUnique({ where: { id } });
        if (!lessonFile || lessonFile.status === Status.inactive) {
            throw new NotFoundException('Lesson file not found');
        }

        await this.prisma.lessonFile.update({
            where: { id },
            data: { status: Status.inactive },
        });

        return { success: true, message: 'Lesson file removed successfully' };
    }
}