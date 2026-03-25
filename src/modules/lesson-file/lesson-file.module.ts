import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { LessonFileService } from './lesson-file.service';
import { LessonFileController } from './lesson-file.controller';
import { PrismaService } from 'src/core/database/prisma.service';

@Module({
  imports: [
    AuthModule,
    MulterModule.register({ dest: './src/uploads/lesson-files' }),
  ],
  controllers: [LessonFileController],
  providers: [LessonFileService, PrismaService],
})
export class LessonFileModule { }