import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@ApiTags('Lesson')
@ApiBearerAuth()
@UseGuards(AuthGuard, RoleGuard)
@Controller('lesson')
export class LessonController {
    constructor(private lessonService: LessonService) { }

    @Post()
    @Roles(UserRole.MENTOR, UserRole.ADMIN)
    create(@Body() dto: CreateLessonDto, @Req() req: any) {
        return this.lessonService.create(dto, req['user'].id);
    }

    @Get('section/:sectionId')
    @Roles(UserRole.ADMIN, UserRole.ASSISTANT, UserRole.STUDENT, UserRole.MENTOR)
    findBySection(
        @Param('sectionId', ParseIntPipe) sectionId: number,
        @Req() req: any,
    ) {
        return this.lessonService.findBySection(sectionId, req['user'].id);
    }

    @Get(':id')
    @Roles(UserRole.ADMIN, UserRole.ASSISTANT, UserRole.STUDENT, UserRole.MENTOR)
    findOne(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
        return this.lessonService.findOne(id, req['user'].id);
    }

    @Patch(':id')
    @Roles(UserRole.MENTOR, UserRole.ADMIN)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateLessonDto,
        @Req() req: any,
    ) {
        return this.lessonService.update(id, dto, req['user'].id);
    }

    @Delete(':id')
    @Roles(UserRole.MENTOR)
    remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
        return this.lessonService.remove(id, req['user'].id);
    }

    @Delete('admin/:id')
    @Roles(UserRole.ADMIN)
    adminRemove(@Param('id', ParseIntPipe) id: number) {
        return this.lessonService.adminRemove(id);
    }
}