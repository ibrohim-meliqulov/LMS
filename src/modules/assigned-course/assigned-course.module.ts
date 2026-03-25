import { Module } from '@nestjs/common';
import { AssignedCourseService } from './assigned-course.service';
import { AssignedCourseController } from './assigned-course.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AssignedCourseController],
  providers: [AssignedCourseService],
})
export class AssignedCourseModule { }