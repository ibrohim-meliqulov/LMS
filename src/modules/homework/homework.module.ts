import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { HomeworkService } from './homework.service';
import { HomeworkController } from './homework.controller';
import { PrismaService } from 'src/core/database/prisma.service';

@Module({
  imports: [
    AuthModule,
    MulterModule.register({ dest: './src/uploads/homeworks' }),
  ],
  controllers: [HomeworkController],
  providers: [HomeworkService, PrismaService],
})
export class HomeworkModule { }