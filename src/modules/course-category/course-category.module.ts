import { Module } from '@nestjs/common';
import { CourseCategoryService } from './course-category.service';
import { CourseCategoryController } from './course-category.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [CourseCategoryController],
  providers: [CourseCategoryService],
})
export class CourseCategoryModule { }