import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';
import { PrismaService } from 'src/core/database/prisma.service';

@Module({
  imports: [AuthModule],  // ✅
  controllers: [RatingController],
  providers: [RatingService, PrismaService],
})
export class RatingModule { }