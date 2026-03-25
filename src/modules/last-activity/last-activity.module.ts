import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { LastActivityService } from './last-activity.service';
import { LastActivityController } from './last-activity.controller';
import { PrismaService } from 'src/core/database/prisma.service';

@Module({
  imports: [AuthModule],
  controllers: [LastActivityController],
  providers: [LastActivityService, PrismaService],
})
export class LastActivityModule { }