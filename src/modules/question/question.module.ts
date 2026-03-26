import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from 'src/core/database/prisma.service';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';

@Module({
  imports: [AuthModule],
  controllers: [QuestionController],
  providers: [QuestionService, PrismaService]
})
export class QuestionModule {}
