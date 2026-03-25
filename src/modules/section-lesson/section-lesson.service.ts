import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { Status } from '@prisma/client';
import { CreateSectionLessonDto } from './dto/create-section-lesson.dto';
import { UpdateSectionLessonDto } from './dto/update-section-lesson.dto';

@Injectable()
export class SectionLessonService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateSectionLessonDto, mentorId: number) {
        const course = await this.prisma.course.findUnique({
            where: { id: dto.courseId, status: Status.active },
        });
        if (!course) throw new NotFoundException('Course not found');

        // Faqat o'z kursiga section qo'sha oladi
        if (course.mentorId !== mentorId) {
            throw new ForbiddenException('This is not your course');
        }

        const section = await this.prisma.sectionLesson.create({
            data: dto,
        });

        return { success: true, data: section };
    }

    async findByCourse(courseId: number) {
        const course = await this.prisma.course.findUnique({
            where: { id: courseId },
        });
        if (!course) throw new NotFoundException('Course not found');

        const sections = await this.prisma.sectionLesson.findMany({
            where: { courseId, status: Status.active },
            select: {
                id: true,
                name: true,
                createdAt: true,
                lessons: {
                    where: { status: Status.active },
                    select: {
                        id: true,
                        name: true,
                        createdAt: true,
                    },
                },
            },
        });

        return { success: true, data: sections };
    }

    async update(id: number, dto: UpdateSectionLessonDto, mentorId: number) {
        const section = await this.prisma.sectionLesson.findUnique({
            where: { id },
            include: { course: true },
        });
        if (!section || section.status === Status.inactive) {
            throw new NotFoundException('Section not found');
        }

        if (section.course.mentorId !== mentorId) {
            throw new ForbiddenException('This is not your course');
        }

        const updated = await this.prisma.sectionLesson.update({
            where: { id },
            data: dto,
        });

        return { success: true, data: updated };
    }

    async remove(id: number, mentorId: number) {
        const section = await this.prisma.sectionLesson.findUnique({
            where: { id },
            include: { course: true },
        });
        if (!section || section.status === Status.inactive) {
            throw new NotFoundException('Section not found');
        }

        if (section.course.mentorId !== mentorId) {
            throw new ForbiddenException('This is not your course');
        }

        await this.prisma.sectionLesson.update({
            where: { id },
            data: { status: Status.inactive },
        });

        return { success: true, message: 'Section removed successfully' };
    }

    async adminRemove(id: number) {
        const section = await this.prisma.sectionLesson.findUnique({
            where: { id },
        });
        if (!section || section.status === Status.inactive) {
            throw new NotFoundException('Section not found');
        }

        await this.prisma.sectionLesson.update({
            where: { id },
            data: { status: Status.inactive },
        });

        return { success: true, message: 'Section removed successfully' };
    }
}