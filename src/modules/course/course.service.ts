import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Status, UserRole } from '@prisma/client';
import { CreateCourseDto } from './dto/create.course.dto';

@Injectable()
export class CourseService {
    constructor(private prisma: PrismaService) { }

    async create(userId: number, payload: CreateCourseDto, banner: string, introVideo?: string) {
        const existCategory = await this.prisma.courseCategory.findUnique({
            where: { id: payload.categoryId, status: Status.active }
        })
        if (!existCategory) throw new NotFoundException("Course Category not found")
        await this.prisma.course.create({
            data: {
                ...payload,
                banner,
                introVideo: introVideo ?? null,
                mentorId: userId,
            },
        });
        return { success: true, message: 'Course created successfully' };
    }

    async findAll() {
        const courses = await this.prisma.course.findMany({
            where: { published: true, status: Status.active },
            select: {
                id: true,
                name: true,
                about: true,
                price: true,
                banner: true,
                introVideo: true,
                level: true,
                createdAt: true,
                category: { select: { id: true, name: true } },
                mentor: { select: { id: true, fullName: true, image: true } },
            },
        });

        const result = courses.map(course => ({
            ...course,
            price: Number(course.price),
            banner: `http://localhost:3000/banners/${course.banner}`,
            introVideo: course.introVideo ? `http://localhost:3000/videos/${course.introVideo}` : null,
            mentor: {
                ...course.mentor,
                image: course.mentor.image ? `http://localhost:3000/images/${course.mentor.image}` : null,
            }
        }));

        return { success: true, data: result };
    }




    async findOne(id: number) {
        const course = await this.prisma.course.findUnique({
            where: { id, published: true, status: Status.active },
            select: {
                id: true,
                name: true,
                about: true,
                price: true,
                banner: true,
                introVideo: true,
                level: true,
                published: true,
                createdAt: true,
                category: { select: { id: true, name: true } },
                mentor: {
                    select: {
                        id: true,
                        fullName: true,
                        image: true,
                        mentorProfile: true,
                    },
                },
            },
        });
        if (!course) throw new NotFoundException('Course not found');

        return {
            success: true,
            data: {
                ...course,
                price: course.price,
                banner: `http://localhost:3000/banners/${course.banner}`,
                introVideo: course.introVideo ? `http://localhost:3000/videos/${course.introVideo}` : null,
                mentor: {
                    ...course.mentor,
                    image: course.mentor.image ? `http://localhost:3000/images/${course.mentor.image}` : null,
                }
            }
        };
    }



    async update(id: number, userId: number, userRole: UserRole, dto: UpdateCourseDto, banner?: string, introVideo?: string) {
        const course = await this.prisma.course.findUnique({ where: { id, status: Status.active } });
        if (!course) throw new NotFoundException('Course not found');

        if (userRole !== UserRole.ADMIN && course.mentorId !== userId) {
            throw new ForbiddenException('You can only update your own courses');
        }

        await this.prisma.course.update({
            where: { id },
            data: {
                ...dto,
                ...(banner && { banner }),
                ...(introVideo && { introVideo }),
            },
        });
        return { success: true, message: 'Course updated successfully' };
    }

    async remove(id: number, userId: number, userRole: UserRole) {
        const course = await this.prisma.course.findUnique({ where: { id, status: Status.active } });
        if (!course) throw new NotFoundException('Course not found');

        if (userRole !== UserRole.ADMIN && course.mentorId !== userId) {
            throw new ForbiddenException('You can only delete your own courses');
        }

        await this.prisma.course.update({ where: { id }, data: { status: Status.inactive } });
        return { success: true, message: 'Course deleted successfully' };
    }

    async findMyCoures(mentorId: number) {
        const myCourse = await this.prisma.course.findMany({
            where: {
                mentorId,
            },
            select: {
                id: true,
                name: true,
                about: true,
                price: true,
                banner: true,
                level: true,
                published: true,
                createdAt: true,
                category: { select: { id: true, name: true } },
            },
        });

        return {
            success: true,
            data: myCourse
        }
    }


}