import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { Status } from '@prisma/client';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateLessonDto, userId: number, video: string) {
        const section = await this.prisma.sectionLesson.findUnique({
            where: { id: dto.sectionId, status: Status.active },
            include: { course: true },
        });
        if (!section) throw new NotFoundException('Section not found');

        if (section.course.mentorId !== userId) {
            throw new ForbiddenException('You can only add lessons to your own courses');
        }

        await this.prisma.lesson.create({
            data: {
                name: dto.name,
                about: dto.about,
                video,
                sectionId: dto.sectionId,
            },
        });
        return { success: true, message: 'Lesson created successfully' };
    }

    async findBySection(sectionId: number, userId: number, userRole: string) {
        const section = await this.prisma.sectionLesson.findUnique({
            where: { id: sectionId, status: Status.active },
            include: { course: true },
        });
        if (!section) throw new NotFoundException('Section not found');

        if (userRole === 'STUDENT') {
            const purchased = await this.prisma.purchasedCourse.findFirst({
                where: {
                    userId,
                    courseId: section.courseId,
                    status: Status.active,
                },
            });
            const assigned = await this.prisma.assignedCourse.findFirst({
                where: {
                    userId,
                    courseId: section.courseId,
                    status: Status.active,
                },
            });
            if (!purchased && !assigned) throw new ForbiddenException('You have not purchased this course');
        }

        const lessons = await this.prisma.lesson.findMany({
            where: { sectionId, status: Status.active },
            select: {
                id: true,
                name: true,
                about: true,
                video: true,
                createdAt: true,
                lessonViews: {
                    where: { userId },
                    select: { view: true },
                },
            },
        });

        const result = lessons.map(lesson => ({
            ...lesson,
            video: `http://localhost:3000/videos/${lesson.video}`,
            viewed: lesson.lessonViews[0]?.view ?? false,
            lessonViews: undefined,
        }));

        return { success: true, data: result };
    }

    async findOne(id: number, userId: number, userRole: string) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id, status: Status.active },
            include: { section: true },
        });
        if (!lesson) throw new NotFoundException('Lesson not found');

        if (userRole === 'STUDENT') {
            const purchased = await this.prisma.purchasedCourse.findFirst({
                where: {
                    userId,
                    courseId: lesson.section.courseId,
                    status: Status.active,
                },
            });
            const assigned = await this.prisma.assignedCourse.findFirst({
                where: {
                    userId,
                    courseId: lesson.section.courseId,
                    status: Status.active,
                },
            });
            if (!purchased && !assigned) throw new ForbiddenException('You have not purchased this course');

            await this.prisma.lessonView.upsert({
                where: { lessonId_userId: { lessonId: id, userId } },
                update: { view: true },
                create: { lessonId: id, userId, view: true },
            });
        }

        const data = await this.prisma.lesson.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                about: true,
                video: true,
                createdAt: true,
                lessonFiles: {
                    where: { status: Status.active },
                    select: { id: true, file: true, note: true },
                },
                homework: {
                    select: { id: true, task: true, file: true },
                },
                lessonViews: {
                    where: { userId },
                    select: { view: true },
                },
            },
        });

        if (!data) throw new NotFoundException('Lesson not found');

        return {
            success: true,
            data: {
                ...data,
                video: `http://localhost:3000/videos/${data.video}`,
                viewed: data.lessonViews[0]?.view ?? false,
                lessonViews: undefined,
            },
        };
    }

    async update(id: number, dto: UpdateLessonDto, userId: number, video?: string) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id, status: Status.active },
            include: { section: { include: { course: true } } },
        });
        if (!lesson) throw new NotFoundException('Lesson not found');

        if (lesson.section.course.mentorId !== userId) {
            throw new ForbiddenException('You can only update your own lessons');
        }

        await this.prisma.lesson.update({
            where: { id },
            data: {
                ...dto,
                ...(video && { video }),
            },
        });
        return { success: true, message: 'Lesson updated successfully' };
    }

    async remove(id: number, userId: number) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id, status: Status.active },
            include: { section: { include: { course: true } } },
        });
        if (!lesson) throw new NotFoundException('Lesson not found');

        if (lesson.section.course.mentorId !== userId) {
            throw new ForbiddenException('You can only delete your own lessons');
        }

        await this.prisma.lesson.update({
            where: { id },
            data: { status: Status.inactive },
        });
        return { success: true, message: 'Lesson deleted successfully' };
    }

    async adminRemove(id: number) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id, status: Status.active },
        });
        if (!lesson) throw new NotFoundException('Lesson not found');

        await this.prisma.lesson.update({
            where: { id },
            data: { status: Status.inactive },
        });
        return { success: true, message: 'Lesson deleted successfully' };
    }
}