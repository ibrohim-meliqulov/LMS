import { Module } from '@nestjs/common';
import { MentorProfileService } from './mentor-profile.service';
import { MentorProfileController } from './mentor-profile.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [MentorProfileController],
  providers: [MentorProfileService],
})
export class MentorProfileModule { }