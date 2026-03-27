import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags , ApiOperation } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { ExamResultService } from './exam-result.service';
import { SubmitExamDto } from './dto/submit-exam.dto';

@ApiTags('Exam Result')
@ApiBearerAuth()
@UseGuards(AuthGuard, RoleGuard)
@Controller('exam-result')
export class ExamResultController {
    constructor(private examResultService: ExamResultService) { }

    @Post('submit')
    @Roles(UserRole.STUDENT)
    @ApiOperation({ summary: "STUDENT" })
    submit(@Body() dto: SubmitExamDto, @Req() req: any) {
        return this.examResultService.submitExam(dto, req['user'].id);
    }

    @Get('section/:sectionId/my')
    @Roles(UserRole.STUDENT)
    @ApiOperation({ summary: "STUDENT" })
    findMyResult(@Param('sectionId', ParseIntPipe) sectionId: number, @Req() req: any) {
        return this.examResultService.findUserResult(sectionId, req['user'].id);
    }

    @Get('section/:sectionId/student/:userId')
    @Roles(UserRole.MENTOR, UserRole.ADMIN, UserRole.ASSISTANT)
    @ApiOperation({ summary: "MENTOR, ADMIN, ASSISTANT" })
    findStudentResult(
        @Param('sectionId', ParseIntPipe) sectionId: number,
        @Param('userId', ParseIntPipe) userId: number,
        @Req() req: any,
    ) {
        return this.examResultService.findStudentResult(sectionId, userId, req['user'].id, req['user'].role);
    }
}
