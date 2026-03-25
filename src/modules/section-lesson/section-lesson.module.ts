import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { SectionLessonService } from './section-lesson.service';
import { SectionLessonController } from './section-lesson.controller';
import { PrismaService } from 'src/core/database/prisma.service';

@Module({
  imports: [AuthModule],
  controllers: [SectionLessonController],
  providers: [SectionLessonService, PrismaService],
})
export class SectionLessonModule { }