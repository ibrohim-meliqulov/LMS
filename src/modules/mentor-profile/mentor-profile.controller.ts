import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { RoleGuard } from 'src/common/guards/role.guard';
import { MentorProfileService } from './mentor-profile.service';
import { UpdateMentorProfileDto } from './dto/update-mentor-profile.dto';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { CreateMentorProfileDto } from './dto/create.mentor.dto';



@ApiBearerAuth()
@UseGuards(AuthGuard, RoleGuard)
@Controller('mentor-profile')
export class MentorProfileController {
    constructor(private mentorProfileService: MentorProfileService) { }

    @Post(':userId')
    @Roles(UserRole.MENTOR)
    create(
        @Body() payload: CreateMentorProfileDto,
        @Req() req: Request
    ) {
        return this.mentorProfileService.create(req['user'], payload);
    }

    @Get()
    @Roles(UserRole.ADMIN)
    findAll() {
        return this.mentorProfileService.findAll();
    }

    @Get('me')
    @Roles(UserRole.MENTOR)
    findMyProfile(@Req() req: any) {
        return this.mentorProfileService.findMyProfile(req['user']);
    }

    @Get(':id')
    @Roles(UserRole.ADMIN)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.mentorProfileService.findOne(id);
    }

    @Put()
    @Roles(UserRole.MENTOR)
    update(@Req() req: any, @Body() payload: UpdateMentorProfileDto) {
        return this.mentorProfileService.update(req['user'], payload);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.mentorProfileService.remove(id);
    }
}