import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AssignedCourseService } from './assigned-course.service';
import { AssignedCourseController } from './assigned-course.controller';
import { PrismaService } from 'src/core/database/prisma.service';

@Module({
  imports: [AuthModule],
  controllers: [AssignedCourseController],
  providers: [AssignedCourseService, PrismaService],
})
export class AssignedCourseModule { }