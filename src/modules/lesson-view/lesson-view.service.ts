import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { Status } from '@prisma/client';

@Injectable()
export class LessonViewService {
    constructor(private prisma: PrismaService) { }

    async findMy(userId: number) {
        const data = await this.prisma.lessonView.findMany({
            where: { userId, status: Status.active },
            select: {
                view: true,
                lesson: {
                    select: {
                        id: true,
                        name: true,
                        section: { select: { id: true, name: true } },
                    },
                },
            },
        });

        const total = data.length;
        const viewed = data.filter(lv => lv.view).length;

        return { success: true, data, stats: { total, viewed, notViewed: total - viewed } };
    }

    async findByLesson(lessonId: number) {
        const lesson = await this.prisma.lesson.findUnique({ where: { id: lessonId } });
        if (!lesson) throw new NotFoundException('Lesson not found');

        const data = await this.prisma.lessonView.findMany({
            where: { lessonId, status: Status.active },
            select: {
                view: true,
                user: { select: { id: true, fullName: true, image: true } },
            },
        });

        const total = data.length;
        const viewed = data.filter(lv => lv.view).length;

        return { success: true, data, stats: { total, viewed, notViewed: total - viewed } };
    }
}