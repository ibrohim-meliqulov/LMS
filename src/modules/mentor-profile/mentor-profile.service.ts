import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { Status, UserRole } from '@prisma/client';
import { UpdateMentorProfileDto } from './dto/update-mentor-profile.dto';
import { CreateMentorProfileDto } from './dto/create.mentor.dto';

@Injectable()
export class MentorProfileService {
    constructor(private prisma: PrismaService) { }

    async create(current_user: { id: number }, payload: CreateMentorProfileDto) {
        const exists = await this.prisma.mentorProfile.findUnique({
            where: { userId: current_user.id }
        });
        if (exists) throw new BadRequestException('Mentor profile already exists');

        await this.prisma.mentorProfile.create({
            data: { ...payload, userId: current_user.id },
        });

        return { success: true, message: 'Mentor profile created successfully' };
    }

    async findAll() {
        const mentorProfiles = await this.prisma.mentorProfile.findMany({
            where: { status: Status.active },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        phone: true,
                        image: true,
                    },
                },
            },
        });

        return {
            success: true,
            data: mentorProfiles
        }
    }

    async findOne(id: number) {
        const profile = await this.prisma.mentorProfile.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        phone: true,
                        image: true,
                    },
                },
            },
        });
        if (!profile) throw new NotFoundException('Mentor profile not found');
        return { success: true, data: profile };
    }

    async findMyProfile(current_user: { id: number }) {
        const profile = await this.prisma.mentorProfile.findUnique({
            where: { userId: current_user.id },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        phone: true,
                        image: true,
                    },
                },
            },
        });
        if (!profile) throw new NotFoundException('Mentor profile not found');
        return { success: true, data: profile };
    }

    async update(current_user: { id: number }, payload: UpdateMentorProfileDto) {
        const profile = await this.prisma.mentorProfile.findUnique({ where: { userId: current_user.id }, select: { experience: true, user: { select: { role: true } } } });

        if (!profile) throw new NotFoundException('Mentor profile not found');

        if (profile.user.role !== "MENTOR") {
            throw new UnauthorizedException("You don't have a permission")
        }
        console.log()
        if (payload.experience == undefined) {
            console.log("salom")
        }
        await this.prisma.mentorProfile.update({
            where: { userId: current_user.id },
            data: payload,


        });

        return { success: true, message: 'Mentor profile updated successfully' };
    }

    async remove(id: number) {
        const profile = await this.prisma.mentorProfile.findUnique({ where: { id } });
        if (!profile) throw new NotFoundException('Mentor profile not found');

        await this.prisma.mentorProfile.update({
            where: { id },
            data: { status: Status.inactive },
        });

        return { success: true, message: 'Mentor profile deleted successfully' };
    }
}