import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/core/database/prisma.service';
import { LoginDto } from './dto/login.dto';
import { checkPassword } from 'src/core/utils/bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async login(payload: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: { phone: payload.phone },
        });
        if (!user) throw new UnauthorizedException('Unathorized');

        const match = await checkPassword(payload.password, user.password)
        if (!match) throw new UnauthorizedException('Password or phone number wrong');

        const accessToken = this.jwtService.sign({ id: user.id, role: user.role });
        return {
            accessToken,
            success: true,
            message: "You logged in successfully"
        };
    }
}