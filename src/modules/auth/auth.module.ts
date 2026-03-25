import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/core/database/prisma.module';

@Module({
  imports: [JwtModule.register({
    secret: "shaftoli",
    signOptions: { expiresIn: "7d" }
  }), PrismaModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [JwtModule]
})
export class AuthModule { }
