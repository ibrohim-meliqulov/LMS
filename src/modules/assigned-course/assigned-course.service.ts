import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { Status } from '@prisma/client';
import { CreateAssignedCourseDto } from './dto/create.assigned-course.dto';

@Injectable()
export class AssignedCourseService {
    constructor(private prisma: PrismaService) { }

    async assign(dto: CreateAssignedCourseDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: dto.userId, status: Status.active },
        });
        if (!user) throw new NotFoundException('User not found');

        const course = await this.prisma.course.findUnique({
            where: { id: dto.courseId, status: Status.active },
        });
        if (!course) throw new NotFoundException('Course not found');

        const exists = await this.prisma.assignedCourse.findUnique({
            where: { userId_courseId: { userId: dto.userId, courseId: dto.courseId } },
        });
        if (exists && exists.status === Status.active) {
            throw new BadRequestException('Course already assigned to this user');
        }

        if (exists) {
            await this.prisma.assignedCourse.update({
                where: { userId_courseId: { userId: dto.userId, courseId: dto.courseId } },
                data: { status: Status.active },
            });
        } else {
            await this.prisma.assignedCourse.create({ data: dto });
        }

        return { success: true, message: 'Course assigned successfully' };
    }

    async unassign(userId: number, courseId: number) {
        const exists = await this.prisma.assignedCourse.findUnique({
            where: { userId_courseId: { userId, courseId } },
        });
        if (!exists || exists.status === Status.inactive) {
            throw new NotFoundException('Assigned course not found');
        }

        await this.prisma.assignedCourse.update({
            where: { userId_courseId: { userId, courseId } },
            data: { status: Status.inactive },
        });

        return { success: true, message: 'Course unassigned successfully' };
    }

    async findAll() {
        const data = await this.prisma.assignedCourse.findMany({
            where: { status: Status.active },
            select: {
                createdAt: true,
                user: { select: { id: true, fullName: true, phone: true, image: true } },
                course: { select: { id: true, name: true, level: true, banner: true } },
            },
        });

        return { success: true, data };
    }


    async findByUser(userId: number) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        const data = await this.prisma.assignedCourse.findMany({
            where: { userId, status: Status.active },
            select: {
                createdAt: true,
                course: {
                    select: {
                        id: true,
                        name: true,
                        level: true,
                        banner: true,
                        category: { select: { id: true, name: true } },
                    },
                },
            },
        });

        return { success: true, data };
    }


    async findMy(userId: number) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        const data = await this.prisma.assignedCourse.findMany({
            where: { userId, status: Status.active },
            select: {
                createdAt: true,
                course: {
                    select: {
                        id: true,
                        name: true,
                        level: true,
                        banner: true,
                        category: { select: { id: true, name: true } },
                    },
                },
            },
        });

        return { success: true, data };
    }
}