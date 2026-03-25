import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { Status } from '@prisma/client';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateLessonDto, mentorId: number) {
        const section = await this.prisma.sectionLesson.findUnique({
            where: { id: dto.sectionId, status: Status.active },
            include: { course: true },
        });
        if (!section) throw new NotFoundException('Section not found');

        if (section.course.mentorId !== mentorId) {
            throw new ForbiddenException('This is not your course');
        }

        const lesson = await this.prisma.lesson.create({
            data: dto,
        });

        return { success: true, data: lesson };
    }

    async findBySection(sectionId: number, userId: number) {
        const section = await this.prisma.sectionLesson.findUnique({
            where: { id: sectionId },
            include: { course: true },
        });
        if (!section) throw new NotFoundException('Section not found');

        // Sotib olganmi yoki mentormi tekshiramiz
        const purchased = await this.prisma.purchasedCourse.findFirst({
            where: { courseId: section.courseId, userId, status: Status.active },
        });
        const isMentor = section.course.mentorId === userId;

        if (!purchased && !isMentor) {
            throw new ForbiddenException('You have not purchased this course');
        }

        const lessons = await this.prisma.lesson.findMany({
            where: { sectionId, status: Status.active },
            select: {
                id: true,
                name: true,
                about: true,
                video: true,
                createdAt: true,
            },
        });

        return { success: true, data: lessons };
    }

    async findOne(id: number, userId: number) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id, status: Status.active },
            include: {
                section: { include: { course: true } },
            },
        });
        if (!lesson) throw new NotFoundException('Lesson not found');

        // Sotib olganmi yoki mentormi tekshiramiz
        const purchased = await this.prisma.purchasedCourse.findFirst({
            where: { courseId: lesson.section.courseId, userId, status: Status.active },
        });
        const isMentor = lesson.section.course.mentorId === userId;

        if (!purchased && !isMentor) {
            throw new ForbiddenException('You have not purchased this course');
        }

        return { success: true, data: lesson };
    }

    async update(id: number, dto: UpdateLessonDto, mentorId: number) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id },
            include: { section: { include: { course: true } } },
        });
        if (!lesson || lesson.status === Status.inactive) {
            throw new NotFoundException('Lesson not found');
        }

        if (lesson.section.course.mentorId !== mentorId) {
            throw new ForbiddenException('This is not your course');
        }

        const updated = await this.prisma.lesson.update({
            where: { id },
            data: dto,
        });

        return { success: true, data: updated };
    }

    async remove(id: number, mentorId: number) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id },
            include: { section: { include: { course: true } } },
        });
        if (!lesson || lesson.status === Status.inactive) {
            throw new NotFoundException('Lesson not found');
        }

        if (lesson.section.course.mentorId !== mentorId) {
            throw new ForbiddenException('This is not your course');
        }

        await this.prisma.lesson.update({
            where: { id },
            data: { status: Status.inactive },
        });

        return { success: true, message: 'Lesson removed successfully' };
    }

    async adminRemove(id: number) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id },
        });
        if (!lesson || lesson.status === Status.inactive) {
            throw new NotFoundException('Lesson not found');
        }

        await this.prisma.lesson.update({
            where: { id },
            data: { status: Status.inactive },
        });

        return { success: true, message: 'Lesson removed successfully' };
    }
}