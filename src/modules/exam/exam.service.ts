import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { Status, UserRole } from '@prisma/client';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';

@Injectable()
export class ExamService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateExamDto, mentorId: number, role: UserRole) {
        const section = await this.prisma.sectionLesson.findUnique({
            where: { id: dto.sectionId, status: Status.active },
            include: { course: true },
        });
        if (!section) throw new NotFoundException('Section not found');

        if (role !== UserRole.ADMIN && section.course.mentorId !== mentorId) {
            throw new ForbiddenException('This is not your course');
        }

        const exam = await this.prisma.exam.create({
            data: dto,
        });

        return { success: true, data: exam };
    }

    async findBySection(sectionId: number, userId: number, role: UserRole) {
        const section = await this.prisma.sectionLesson.findUnique({
            where: { id: sectionId },
            include: { course: true },
        });
        if (!section) throw new NotFoundException('Section not found');

        const purchased = await this.prisma.purchasedCourse.findFirst({
            where: { courseId: section.courseId, userId, status: Status.active },
        });
        const isMentor = section.course.mentorId === userId;
        const isAdmin = role === UserRole.ADMIN;

        if (!purchased && !isMentor && !isAdmin) {
            throw new ForbiddenException('You do not have access to this course');
        }

        const exams = await this.prisma.exam.findMany({
            where: { sectionId, status: Status.active },
            select: {
                id: true,
                question: true,
                variantA: true,
                variantB: true,
                variantC: true,
                variantD: true,
                answer: isMentor || isAdmin,
                createdAt: true,
            },
        });

        return { success: true, data: exams };
    }

    async findOne(id: number, userId: number, role: UserRole) {
        const exam = await this.prisma.exam.findUnique({
            where: { id, status: Status.active },
            include: {
                section: { include: { course: true } },
            },
        });
        if (!exam) throw new NotFoundException('Exam not found');

        const purchased = await this.prisma.purchasedCourse.findFirst({
            where: { courseId: exam.section.courseId, userId, status: Status.active },
        });
        const isMentor = exam.section.course.mentorId === userId;
        const isAdmin = role === UserRole.ADMIN;

        if (!purchased && !isMentor && !isAdmin) {
            throw new ForbiddenException('You do not have access to this course');
        }

        if (!isMentor && !isAdmin) {
            delete (exam as any).answer;
        }

        return { success: true, data: exam };
    }

    async update(id: number, dto: UpdateExamDto, mentorId: number) {
        const exam = await this.prisma.exam.findUnique({
            where: { id },
            include: { section: { include: { course: true } } },
        });
        if (!exam || exam.status === Status.inactive) {
            throw new NotFoundException('Exam not found');
        }

        if (exam.section.course.mentorId !== mentorId) {
            throw new ForbiddenException('This is not your course');
        }

        const updated = await this.prisma.exam.update({
            where: { id },
            data: dto,
        });

        return { success: true, data: updated };
    }

    async remove(id: number, mentorId: number) {
        const exam = await this.prisma.exam.findUnique({
            where: { id },
            include: { section: { include: { course: true } } },
        });
        if (!exam || exam.status === Status.inactive) {
            throw new NotFoundException('Exam not found');
        }

        if (exam.section.course.mentorId !== mentorId) {
            throw new ForbiddenException('This is not your course');
        }

        await this.prisma.exam.update({
            where: { id },
            data: { status: Status.inactive },
        });

        return { success: true, message: 'Exam removed successfully' };
    }

    async adminRemove(id: number) {
        const exam = await this.prisma.exam.findUnique({
            where: { id },
        });
        if (!exam || exam.status === Status.inactive) {
            throw new NotFoundException('Exam not found');
        }

        await this.prisma.exam.update({
            where: { id },
            data: { status: Status.inactive },
        });

        return { success: true, message: 'Exam removed successfully' };
    }
}
