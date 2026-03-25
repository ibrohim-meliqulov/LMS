import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { RoleGuard } from 'src/common/guards/role.guard';
import { CourseCategoryService } from './course-category.service';
import { UpdateCourseCategoryDto } from './dto/update-course-category.dto';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { CreateCourseCategoryDto } from './dto/course-category.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard, RoleGuard)
@Controller('course-category')
export class CourseCategoryController {
    constructor(private courseCategoryService: CourseCategoryService) { }

    @Post()
    @Roles(UserRole.ADMIN)
    create(@Body() dto: CreateCourseCategoryDto) {
        return this.courseCategoryService.create(dto);
    }

    @Get()
    @Roles(UserRole.ADMIN, UserRole.MENTOR, UserRole.ASSISTANT, UserRole.STUDENT)
    findAll() {
        return this.courseCategoryService.findAll();
    }

    @Get(':id')
    @Roles(UserRole.ADMIN, UserRole.MENTOR, UserRole.ASSISTANT, UserRole.STUDENT)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.courseCategoryService.findOne(id);
    }

    @Put(':id')
    @Roles(UserRole.ADMIN)
    update(@Param('id', ParseIntPipe) id: number, @Body() payload: UpdateCourseCategoryDto) {
        return this.courseCategoryService.update(id, payload);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.courseCategoryService.remove(id);
    }
}