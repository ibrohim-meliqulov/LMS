import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { LessonViewService } from './lesson-view.service';
import { LessonViewController } from './lesson-view.controller';
import { PrismaService } from 'src/core/database/prisma.service';

@Module({
  imports: [AuthModule],
  controllers: [LessonViewController],
  providers: [LessonViewService, PrismaService],
})
export class LessonViewModule { }