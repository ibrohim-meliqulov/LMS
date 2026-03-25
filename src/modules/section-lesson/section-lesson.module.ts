import { Module } from '@nestjs/common';
import { SectionLessonController } from './section-lesson.controller';
import { SectionLessonService } from './section-lesson.service';

@Module({
  controllers: [SectionLessonController],
  providers: [SectionLessonService]
})
export class SectionLessonModule {}
