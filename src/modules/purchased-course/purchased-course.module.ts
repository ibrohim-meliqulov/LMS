import { Module } from '@nestjs/common';
import { PurchasedCourseService } from './purchased-course.service';
import { PurchasedCourseController } from './purchased-course.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [PurchasedCourseController],
  providers: [PurchasedCourseService],
})
export class PurchasedCourseModule { }