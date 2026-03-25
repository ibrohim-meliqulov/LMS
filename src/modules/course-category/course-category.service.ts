import { Injectable, NotFoundException } from '@nestjs/common';
import { Status } from '@prisma/client';
import { PrismaService } from 'src/core/database/prisma.service';
import { UpdateCourseCategoryDto } from './dto/update-course-category.dto';
import { CreateCourseCategoryDto } from './dto/course-category.dto';

@Injectable()
export class CourseCategoryService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateCourseCategoryDto) {
        await this.prisma.courseCategory.create({ data: dto });
        return { success: true, message: 'Category created successfully' };
    }

    async findAll() {
        const courseCategories = await this.prisma.courseCategory.findMany({
            where: { status: Status.active },
            select: {
                id: true,
                name: true,
                createdAt: true,
            },
        });

        return {
            success: true,
            data: courseCategories
        }
    }

    async findOne(id: number) {
        const category = await this.prisma.courseCategory.findUnique({
            where: {
                id,
                status: Status.active
            },
            select: {
                id: true,
                name: true,
                createdAt: true,
            },
        });
        if (!category) throw new NotFoundException('Category not found');
        return { success: true, data: category };
    }

    async update(id: number, payload: UpdateCourseCategoryDto) {
        const category = await this.prisma.courseCategory.findUnique({ where: { id, status: Status.active } });

        if (!category) throw new NotFoundException('Category not found');

        if (payload.name === " ") {
            payload.name = category.name
        }
        await this.prisma.courseCategory.update({ where: { id }, data: { name: payload.name !== undefined ? payload.name : category.name } });
        return { success: true, message: 'Category updated successfully' };
    }

    async remove(id: number) {
        const category = await this.prisma.courseCategory.findUnique({ where: { id, status: Status.active } });

        if (!category) {
            throw new NotFoundException('Category not found');
        }
        await this.prisma.courseCategory.update({
            where: { id },
            data: { status: Status.inactive },
        });
        return { success: true, message: 'Category deleted successfully' };
    }
}