import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { Status } from '@prisma/client';
import { CreateLastActivityDto } from './dto/create-last-activity';

@Injectable()
export class LastActivityService {
    constructor(private prisma: PrismaService) { }

    async upsert(dto: CreateLastActivityDto, userId: number) {
        const activity = await this.prisma.lastActivity.upsert({
            where: { userId },
            update: {
                ...dto,
                status: Status.active,
            },
            create: {
                ...dto,
                userId,
                status: Status.active,
            },
            select: {
                id: true,
                url: true,
                updatedAt: true,
                course: { select: { id: true, name: true, banner: true } },
                section: { select: { id: true, name: true } },
                lesson: { select: { id: true, name: true } },
                user: { select: { id: true, fullName: true, image: true } },
            },
        });

        return { success: true, data: activity };
    }

    async findMy(userId: number) {
        const activity = await this.prisma.lastActivity.findUnique({
            where: { userId, status: Status.active },
            select: {
                id: true,
                url: true,
                updatedAt: true,
                course: { select: { id: true, name: true, banner: true } },
                section: { select: { id: true, name: true } },
                lesson: { select: { id: true, name: true } },
            },
        });
        if (!activity) throw new NotFoundException('No activity found');

        return { success: true, data: activity };
    }

    async findByUser(userId: number) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        const activity = await this.prisma.lastActivity.findUnique({
            where: { userId, status: Status.active },
            select: {
                id: true,
                url: true,
                updatedAt: true,
                course: { select: { id: true, name: true, banner: true } },
                section: { select: { id: true, name: true } },
                lesson: { select: { id: true, name: true } },
                user: { select: { id: true, fullName: true, image: true } },
            },
        });
        if (!activity) throw new NotFoundException('No activity found for this user');

        return { success: true, data: activity };
    }
}