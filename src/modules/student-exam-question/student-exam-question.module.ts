import { Module } from '@nestjs/common';
import { StudentExamQuestionController } from './student-exam-question.controller';
import { StudentExamQuestionService } from './student-exam-question.service';

@Module({
  controllers: [StudentExamQuestionController],
  providers: [StudentExamQuestionService]
})
export class StudentExamQuestionModule {}
