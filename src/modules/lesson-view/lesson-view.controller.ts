import { Controller, Get, Param, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { LessonViewService } from './lesson-view.service';

@ApiTags('Lesson View')
@ApiBearerAuth()
@UseGuards(AuthGuard, RoleGuard)
@Controller('lesson-view')
export class LessonViewController {
    constructor(private lessonViewService: LessonViewService) { }

    @Get('my')
    @Roles(UserRole.STUDENT, UserRole.MENTOR)
    findMy(@Req() req: any) {
        return this.lessonViewService.findMy(req['user'].id);
    }

    @Get('lesson/:lessonId')
    @Roles(UserRole.ADMIN, UserRole.ASSISTANT)
    findByLesson(@Param('lessonId', ParseIntPipe) lessonId: number) {
        return this.lessonViewService.findByLesson(lessonId);
    }
}