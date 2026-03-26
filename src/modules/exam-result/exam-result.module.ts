import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from 'src/core/database/prisma.service';
import { ExamResultController } from './exam-result.controller';
import { ExamResultService } from './exam-result.service';

@Module({
  imports: [AuthModule],
  controllers: [ExamResultController],
  providers: [ExamResultService, PrismaService]
})
export class ExamResultModule {}
