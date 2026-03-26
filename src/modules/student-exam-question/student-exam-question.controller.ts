import { Controller, Get, Param, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { StudentExamQuestionService } from './student-exam-question.service';

@ApiTags('Student Exam Question')
@ApiBearerAuth()
@UseGuards(AuthGuard, RoleGuard)
@Controller('student-exam-question')
export class StudentExamQuestionController {
    constructor(private studentExamQuestionService: StudentExamQuestionService) { }

    @Get('exam/:examId')
    @Roles(UserRole.MENTOR, UserRole.ADMIN)
    findByExam(@Param('examId', ParseIntPipe) examId: number, @Req() req: any) {
        return this.studentExamQuestionService.findByExam(examId, req['user'].id, req['user'].role);
    }
}
