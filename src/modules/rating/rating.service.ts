import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { Status } from '@prisma/client';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';

@Injectable()
export class RatingService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateRatingDto, userId: number) {
        const course = await this.prisma.course.findUnique({
            where: { id: dto.courseId, status: Status.active },
        });
        if (!course) throw new NotFoundException('Course not found');

        const purchased = await this.prisma.purchasedCourse.findFirst({
            where: { courseId: dto.courseId, userId, status: Status.active },
        });
        if (!purchased) throw new ForbiddenException('You have not purchased this course');

        const exists = await this.prisma.rating.findUnique({
            where: { userId_courseId: { userId, courseId: dto.courseId } },
        });
        if (exists && exists.status === Status.active) {
            throw new BadRequestException('You have already rated this course');
        }

        if (exists) {
            const updated = await this.prisma.rating.update({
                where: { userId_courseId: { userId, courseId: dto.courseId } },
                data: { rate: dto.rate, comment: dto.comment, status: Status.active },
            });
            return { success: true, data: updated };
        }

        const rating = await this.prisma.rating.create({
            data: { ...dto, userId },
        });

        return { success: true, data: rating };
    }

    async findByCourse(courseId: number) {
        const course = await this.prisma.course.findUnique({
            where: { id: courseId },
        });
        if (!course) throw new NotFoundException('Course not found');

        const ratings = await this.prisma.rating.findMany({
            where: { courseId, status: Status.active },
            select: {
                id: true,
                rate: true,
                comment: true,
                createdAt: true,
                user: { select: { id: true, fullName: true, image: true } },
            },
        });

        const avg = ratings.length
            ? ratings.reduce((sum, r) => sum + r.rate, 0) / ratings.length
            : 0;

        return {
            success: true,
            data: {
                average: Math.round(avg * 10) / 10,
                total: ratings.length,
                ratings,
            },
        };
    }

    async update(id: number, dto: UpdateRatingDto, userId: number) {
        const rating = await this.prisma.rating.findUnique({ where: { id } });
        if (!rating || rating.status === Status.inactive) {
            throw new NotFoundException('Rating not found');
        }
        if (rating.userId !== userId) {
            throw new ForbiddenException('You can only update your own rating');
        }

        const updated = await this.prisma.rating.update({
            where: { id },
            data: dto,
        });

        return { success: true, data: updated };
    }

    async remove(id: number, userId: number) {
        const rating = await this.prisma.rating.findUnique({ where: { id } });
        if (!rating || rating.status === Status.inactive) {
            throw new NotFoundException('Rating not found');
        }
        if (rating.userId !== userId) {
            throw new ForbiddenException('You can only delete your own rating');
        }

        await this.prisma.rating.update({
            where: { id },
            data: { status: Status.inactive },
        });

        return { success: true, message: 'Rating removed successfully' };
    }

    async adminRemove(id: number) {
        const rating = await this.prisma.rating.findUnique({ where: { id } });
        if (!rating || rating.status === Status.inactive) {
            throw new NotFoundException('Rating not found');
        }

        await this.prisma.rating.update({
            where: { id },
            data: { status: Status.inactive },
        });

        return { success: true, message: 'Rating removed successfully' };
    }
}