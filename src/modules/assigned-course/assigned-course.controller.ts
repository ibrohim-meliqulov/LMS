import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { AssignedCourseService } from './assigned-course.service';
import { CreateAssignedCourseDto } from './dto/create.assigned-course.dto';

@ApiTags('Assigned Course')
@ApiBearerAuth()
@UseGuards(AuthGuard, RoleGuard)
@Controller('assigned-course')
export class AssignedCourseController {
    constructor(private assignedCourseService: AssignedCourseService) { }

    @Post('assign')
    @Roles(UserRole.ADMIN)
    assign(@Body() dto: CreateAssignedCourseDto) {
        return this.assignedCourseService.assign(dto);
    }

    @Delete('unassign')
    @Roles(UserRole.ADMIN)
    unassign(
        @Query('userId', ParseIntPipe) userId: number,
        @Query('courseId', ParseIntPipe) courseId: number,
    ) {
        return this.assignedCourseService.unassign(userId, courseId);
    }


    @Get()
    @Roles(UserRole.ADMIN)
    findAll() {
        return this.assignedCourseService.findAll();
    }

    @Get('user/:userId')
    @Roles(UserRole.ADMIN)
    findByUser(@Param('userId', ParseIntPipe) userId: number) {
        return this.assignedCourseService.findByUser(userId);
    }


    @Get('my')
    @Roles(UserRole.ASSISTANT)
    findMy(@Req() req: any) {
        return this.assignedCourseService.findMy(req['user'].id);
    }
}