import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags , ApiOperation } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { ExamService } from './exam.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';

@ApiTags('Exam')
@ApiBearerAuth()
@UseGuards(AuthGuard, RoleGuard)
@Controller('exam')
export class ExamController {
    constructor(private examService: ExamService) { }

    @Post()
    @Roles(UserRole.MENTOR, UserRole.ADMIN)
    @ApiOperation({ summary: "MENTOR, ADMIN" })
    create(@Body() dto: CreateExamDto, @Req() req: any) {
        return this.examService.create(dto, req['user'].id, req['user'].role);
    }

    @Get('section/:sectionId')
    @Roles(UserRole.ADMIN, UserRole.ASSISTANT, UserRole.STUDENT, UserRole.MENTOR)
    @ApiOperation({ summary: "ADMIN, ASSISTANT, STUDENT, MENTOR" })
    findBySection(
        @Param('sectionId', ParseIntPipe) sectionId: number,
        @Req() req: any,
    ) {
        return this.examService.findBySection(sectionId, req['user'].id, req['user'].role);
    }

    @Get(':id')
    @Roles(UserRole.ADMIN, UserRole.ASSISTANT, UserRole.STUDENT, UserRole.MENTOR)
    @ApiOperation({ summary: "ADMIN, ASSISTANT, STUDENT, MENTOR" })
    findOne(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
        return this.examService.findOne(id, req['user'].id, req['user'].role);
    }

    @Patch(':id')
    @Roles(UserRole.MENTOR, UserRole.ADMIN)
    @ApiOperation({ summary: "MENTOR, ADMIN" })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateExamDto,
        @Req() req: any,
    ) {
        return this.examService.update(id, dto, req['user'].id);
    }

    @Delete(':id')
    @Roles(UserRole.MENTOR)
    @ApiOperation({ summary: "MENTOR" })
    remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
        return this.examService.remove(id, req['user'].id);
    }

    @Delete('admin/:id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: "ADMIN" })
    adminRemove(@Param('id', ParseIntPipe) id: number) {
        return this.examService.adminRemove(id);
    }
}
