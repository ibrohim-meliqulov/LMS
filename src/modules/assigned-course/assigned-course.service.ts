import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { Status } from '@prisma/client';
import { CreateAssignedCourseDto } from './dto/create.assigned-course.dto';

@Injectable()
export class AssignedCourseService {
    constructor(private prisma: PrismaService) { }

    async create(current_user: { id: number }, payload: CreateAssignedCourseDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: current_user.id, status: Status.active },
        });
        if (!user) throw new NotFoundException('User not found');

        const course = await this.prisma.course.findUnique({
            where: { id: payload.courseId, status: Status.active },
        });
        if (!course) throw new NotFoundException('Course not found');

        const exists = await this.prisma.assignedCourse.findUnique({
            where: { userId_courseId: { userId: current_user.id, courseId: payload.courseId } },
        });
        if (exists && exists.status === Status.active) {
            throw new BadRequestException('Course already assigned to this user');
        }

        if (exists) {
            await this.prisma.assignedCourse.update({
                where: { userId_courseId: { userId: current_user.id, courseId: payload.courseId } },
                data: { status: Status.active },
            });
        } else {
            await this.prisma.assignedCourse.create({ data: { ...payload, userId: current_user.id } });
        }

        return { success: true, message: 'Course assigned successfully' };
    }

    async findAll() {
        const assignedCourses = await this.prisma.assignedCourse.findMany({
            where: { status: Status.active },
            select: {
                createdAt: true,
                user: { select: { id: true, fullName: true, phone: true, image: true } },
                course: { select: { id: true, name: true, level: true, banner: true } },
            },
        });


        return {
            success: true,
            data: assignedCourses
        }
    }

    async findByUser(userId: number) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        return this.prisma.assignedCourse.findMany({
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
    }


    async findMyAssignedCourse(current_user: { id: number }) {
        const existUser = await this.prisma.user.findUnique({
            where: { id: current_user.id }
        })
        if (!existUser) throw new NotFoundException("User not found")

        const myAssignedCourses = await this.prisma.assignedCourse.findMany({
            where: { userId: current_user.id }
        })
        return {
            success: true,
            data: myAssignedCourses
        }
    }



    async remove(userId: number, courseId: number) {
        const exists = await this.prisma.assignedCourse.findUnique({
            where: { userId_courseId: { userId, courseId }, },
        });
        if (!exists || exists.status === Status.inactive) {
            throw new NotFoundException('Assigned course not found');
        }

        await this.prisma.assignedCourse.update({
            where: { userId_courseId: { userId, courseId } },
            data: { status: Status.inactive },
        });

        return { success: true, message: 'Assigned course removed successfully' };
    }
}