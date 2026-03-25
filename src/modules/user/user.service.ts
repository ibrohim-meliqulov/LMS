import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateTeacherDto, CreateUserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hashPassword } from 'src/core/utils/bcrypt';
import { Status, UserRole } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService,
        private jwtService: JwtService
    ) { }

    async register(payload: CreateUserDto, filename?: string) {
        const exists = await this.prisma.user.findUnique({
            where: { phone: payload.phone },
        });
        if (exists) throw new BadRequestException('Phone already exists');

        const hashed = await hashPassword(payload.password)
        const newUser = await this.prisma.user.create({
            data: {
                ...payload,
                password: hashed,
                role: UserRole.STUDENT,
                image: filename ? filename : null
            },
        });

        const accessToken = this.jwtService.sign({ id: newUser.id, role: newUser.role })

        return {
            accessToken,
            success: true,
            message: "Registered successfully"
        }
    }



    async teacherRegister(payload: CreateTeacherDto, filename?: string) {
        const exists = await this.prisma.user.findUnique({
            where: { phone: payload.phone },
        });
        if (exists) throw new BadRequestException('Phone already exists');

        const hashed = await hashPassword(payload.password)
        const newUser = await this.prisma.user.create({
            data: {
                ...payload,
                password: hashed,
                role: payload.role,
                image: filename ? filename : null
            },
        });

        const accessToken = this.jwtService.sign({ id: newUser.id, role: newUser.role })

        return {
            accessToken,
            success: true,
            message: "Registered successfully"
        }
    }

    async findAll() {
        const users = await this.prisma.user.findMany({
            where: { role: { not: UserRole.ADMIN } },
            select: {
                id: true,
                phone: true,
                fullName: true,
                role: true,
                image: true,
                createdAt: true,
            },
        });
        return {
            success: true,
            data: users
        }
    }

    async findOne(id: number) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                phone: true,
                fullName: true,
                role: true,
                image: true,
                createdAt: true,
            },
        });
        if (!user) throw new NotFoundException('User not found');
        return {
            success: true,
            data: user
        };
    }

    async update(current_user: { id: number }, payload: UpdateUserDto, filename?: string) {
        const existUser = await this.prisma.user.findUnique({
            where: { id: current_user.id }
        })
        if (!existUser) throw new NotFoundException("User not found")

        if (payload.password) {
            payload.password = await hashPassword(payload.password)
        }

        await this.prisma.user.update({
            where: { id: current_user.id },
            data: {
                ...payload,
                ...(filename && { image: filename ? filename : null }),
            },
        });

        return {
            success: true,
            message: "Account updated successfully"
        }
    }



    async updateRole(id: number, payload: UpdateRoleDto) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) throw new NotFoundException('User not found');

        await this.prisma.user.update({
            where: { id },
            data: { role: payload.role },
        });

        return { success: true, message: 'Role updated successfully' };
    }


    async remove(id: number) {
        const existUser = await this.prisma.user.findUnique({
            where: { id }
        })
        if (!existUser) throw new NotFoundException("User not found")
        await this.prisma.user.update({
            where: { id }, data: { status: Status.inactive }
        })

        return {
            success: true,
            message: "Account deleted successfully"
        }
    }
}