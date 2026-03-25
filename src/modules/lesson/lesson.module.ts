import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { LessonService } from './lesson.service';
import { LessonController } from './lesson.controller';
import { PrismaService } from 'src/core/database/prisma.service';

@Module({
  imports: [AuthModule],
  controllers: [LessonController],
  providers: [LessonService, PrismaService],
})
export class LessonModule { }