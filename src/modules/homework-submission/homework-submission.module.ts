import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from 'src/core/database/prisma.service';
import { HomeworkSubmissionController } from './homework-submission.controller';
import { HomeworkSubmissionService } from './homework-submission.service';

@Module({
  imports: [AuthModule],
  controllers: [HomeworkSubmissionController],
  providers: [HomeworkSubmissionService, PrismaService] // Provide PrismaService here
})
export class HomeworkSubmissionModule {}
