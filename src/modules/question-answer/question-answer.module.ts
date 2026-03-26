import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from 'src/core/database/prisma.service';
import { QuestionAnswerController } from './question-answer.controller';
import { QuestionAnswerService } from './question-answer.service';

@Module({
  imports: [AuthModule],
  controllers: [QuestionAnswerController],
  providers: [QuestionAnswerService, PrismaService]
})
export class QuestionAnswerModule {}
