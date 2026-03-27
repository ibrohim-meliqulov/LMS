import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { Status } from '@prisma/client';
import { CreatePurchasedCourseDto } from './dto/purchased-course.dto';

@Injectable()
export class PurchasedCourseService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreatePurchasedCourseDto, userId: number) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId, status: Status.active },
        });
        if (!user) throw new NotFoundException('User not found');

        const course = await this.prisma.course.findUnique({
            where: { id: dto.courseId, status: Status.active },
        });
        if (!course) throw new NotFoundException('Course not found');

        if (dto.amount < Number(course.price)) {
            throw new BadRequestException(
                `Insufficient amount. Course price is ${course.price}`
            );
        }

        const exists = await this.prisma.purchasedCourse.findFirst({
            where: { courseId: dto.courseId, userId },
        });
        if (exists && exists.status === Status.active) {
            throw new BadRequestException('Course already purchased by this user');
        }

        if (exists) {
            await this.prisma.purchasedCourse.update({
                where: { id: exists.id },
                data: { status: Status.active },
            });
        } else {
            await this.prisma.purchasedCourse.create({
                data: { ...dto, userId },
            });
        }

        return { success: true, message: 'Course purchased successfully' };
    }

    async findAll() {
        const purchasedCourses = await this.prisma.purchasedCourse.findMany({
            where: { status: Status.active },
            select: {
                id: true,
                paidVia: true,
                amount: true,
                purchasedAt: true,
                user: { select: { id: true, fullName: true, phone: true } },
                course: { select: { id: true, name: true, level: true, price: true } },
            },
        });

        return { success: true, data: purchasedCourses };
    }

    async findOne(id: number) {
        const purchased = await this.prisma.purchasedCourse.findUnique({
            where: { id, status: Status.active },
            select: {
                id: true,
                paidVia: true,
                amount: true,
                purchasedAt: true,
                user: { select: { id: true, fullName: true, phone: true } },
                course: { select: { id: true, name: true, level: true, price: true, banner: true } },
            },
        });
        if (!purchased) throw new NotFoundException('Purchased course not found');

        return { success: true, data: purchased };
    }

    async findByUser(userId: number) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');


        const data = await this.prisma.purchasedCourse.findMany({
            where: { userId, status: Status.active },
            select: {
                id: true,
                paidVia: true,
                amount: true,
                purchasedAt: true,
                course: {
                    select: {
                        id: true,
                        name: true,
                        level: true,
                        price: true,
                        banner: true,
                        category: { select: { id: true, name: true } },
                    },
                },
            },
        });


        return { success: true, data };
    }

    async remove(id: number) {
        const exists = await this.prisma.purchasedCourse.findUnique({
            where: { id },
        });
        if (!exists || exists.status === Status.inactive) {
            throw new NotFoundException('Purchased course not found');
        }

        await this.prisma.purchasedCourse.update({
            where: { id },
            data: { status: Status.inactive },
        });

        return { success: true, message: 'Purchased course removed successfully' };
    }
}