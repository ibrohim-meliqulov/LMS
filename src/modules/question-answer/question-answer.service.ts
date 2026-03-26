import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { UserRole } from '@prisma/client';
import { CreateAnswerDto } from './dto/create-answer.dto';

@Injectable()
export class QuestionAnswerService {
    constructor(private prisma: PrismaService) {}

    async create(dto: CreateAnswerDto, file: string | undefined, userId: number, role: UserRole) {
        const question = await this.prisma.question.findUnique({
            where: { id: dto.questionId },
            include: { course: true, answer: true },
        });

        if (!question) throw new NotFoundException('Question not found');

        if (question.answer) {
            throw new ForbiddenException('Question already answered');
        }

        if (role !== UserRole.ADMIN && question.course.mentorId !== userId) {
            throw new ForbiddenException('This is not your course');
        }

        const answer = await this.prisma.$transaction(async (tx) => {
            await tx.question.update({
                where: { id: dto.questionId },
                data: { read: true, readAt: new Date() },
            });

            return tx.questionAnswer.create({
                data: {
                    questionId: dto.questionId,
                    text: dto.text,
                    file,
                    userId,
                },
            });
        });

        return { success: true, data: answer };
    }
}
