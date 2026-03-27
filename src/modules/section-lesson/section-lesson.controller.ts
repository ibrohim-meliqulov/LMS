import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags , ApiOperation } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { SectionLessonService } from './section-lesson.service';
import { CreateSectionLessonDto } from './dto/create-section-lesson.dto';
import { UpdateSectionLessonDto } from './dto/update-section-lesson.dto';

@ApiTags('Section Lesson')
@ApiBearerAuth()
@UseGuards(AuthGuard, RoleGuard)
@Controller('section-lesson')
export class SectionLessonController {
    constructor(private sectionLessonService: SectionLessonService) { }

    @Post()
    @Roles(UserRole.MENTOR, UserRole.ADMIN)
    @ApiOperation({ summary: "MENTOR, ADMIN" })
    create(@Body() dto: CreateSectionLessonDto, @Req() req: any) {
        return this.sectionLessonService.create(dto, req['user'].id);
    }

    @Get('course/:courseId')
    @Roles(UserRole.ADMIN, UserRole.ASSISTANT, UserRole.STUDENT, UserRole.MENTOR)
    @ApiOperation({ summary: "ADMIN, ASSISTANT, STUDENT, MENTOR" })
    findByCourse(@Param('courseId', ParseIntPipe) courseId: number, @Req() req: any) {
        return this.sectionLessonService.findByCourse(courseId, req['user']);
    }

    @Patch(':id')
    @Roles(UserRole.MENTOR, UserRole.ADMIN)
    @ApiOperation({ summary: "MENTOR, ADMIN" })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateSectionLessonDto,
        @Req() req: any,
    ) {
        return this.sectionLessonService.update(id, dto, req['user'].id);
    }

    @Delete(':id')
    @Roles(UserRole.MENTOR)
    @ApiOperation({ summary: "MENTOR" })
    remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
        return this.sectionLessonService.remove(id, req['user'].id);
    }

    @Delete('admin/:id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: "ADMIN" })
    adminRemove(@Param('id', ParseIntPipe) id: number) {
        return this.sectionLessonService.adminRemove(id);
    }
}