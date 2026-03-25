import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
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

    @Post()
    @Roles(UserRole.ASSISTANT, UserRole.ADMIN, UserRole.STUDENT)
    create(@Body() payload: CreateAssignedCourseDto,
        @Req() req: any) {
        return this.assignedCourseService.create(req['user'], payload)
    }




    @Get('user/:userId')
    @Roles(UserRole.ADMIN, UserRole.ASSISTANT, UserRole.STUDENT)
    findByUser(@Param('userId', ParseIntPipe) userId: number) {
        return this.assignedCourseService.findByUser(userId);
    }

    @Get("MyAssigned")
    @Roles(UserRole.ADMIN, UserRole.STUDENT)
    findMyAssignedCourse(
        @Req() req: Request
    ) {
        return this.assignedCourseService.findMyAssignedCourse(req['user']);
    }


    @Get()
    @Roles(UserRole.ADMIN, UserRole.STUDENT)
    findAll() {
        return this.assignedCourseService.findAll();
    }



    @Delete(':userId/:courseId')
    @Roles(UserRole.ADMIN, UserRole.STUDENT)
    remove(
        @Param('userId', ParseIntPipe) userId: number,
        @Param('courseId', ParseIntPipe) courseId: number,
    ) {
        return this.assignedCourseService.remove(userId, courseId);
    }
}