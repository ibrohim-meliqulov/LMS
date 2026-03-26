import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from 'src/core/database/prisma.service';
import { StudentExamQuestionController } from './student-exam-question.controller';
import { StudentExamQuestionService } from './student-exam-question.service';

@Module({
  imports: [AuthModule],
  controllers: [StudentExamQuestionController],
  providers: [StudentExamQuestionService, PrismaService]
})
export class StudentExamQuestionModule {}
