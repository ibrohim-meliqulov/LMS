import {
    Body, Controller, Get, Param, ParseIntPipe, Patch,
    Post, Req, UploadedFile, UseGuards, UseInterceptors, UnsupportedMediaTypeException
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { HomeworkSubmissionService } from './homework-submission.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionStatusDto } from './dto/update-status.dto';

@ApiTags('Homework Submission')
@ApiBearerAuth()
@UseGuards(AuthGuard, RoleGuard)
@Controller('homework-submission')
export class HomeworkSubmissionController {
    constructor(private submissionService: HomeworkSubmissionService) { }

    @Post()
    @Roles(UserRole.STUDENT)
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                homeworkId: { type: 'number' },
                text: { type: 'string' },
                file: { type: 'string', format: 'binary' },
            },
            required: ['homeworkId', 'file'],
        },
    })
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './src/uploads/homework',
            filename: (req, file, cb) => {
                const filename = new Date().getTime() + '.' + file.mimetype.split('/')[1];
                cb(null, filename);
            },
        }),
        fileFilter: (req, file, cb) => {
            const allowed = ['pdf', 'doc', 'docx', 'zip', 'png', 'jpg', 'jpeg'];
            const ext = file.mimetype.split('/')[1];
            if (!allowed.includes(ext)) {
                cb(new UnsupportedMediaTypeException('Invalid format'), false);
            } else {
                cb(null, true);
            }
        },
    }))
    create(
        @Body() dto: CreateSubmissionDto,
        @UploadedFile() file: Express.Multer.File,
        @Req() req: any,
    ) {
        return this.submissionService.create(dto, file?.filename, req['user'].id);
    }

    @Get('homework/:homeworkId')
    @Roles(UserRole.MENTOR, UserRole.ADMIN, UserRole.ASSISTANT)
    findByHomework(
        @Param('homeworkId', ParseIntPipe) homeworkId: number,
        @Req() req: any,
    ) {
        return this.submissionService.findByHomework(homeworkId, req['user'].id, req['user'].role);
    }

    @Get('my')
    @Roles(UserRole.STUDENT)
    findMySubmissions(@Req() req: any) {
        return this.submissionService.findMySubmissions(req['user'].id);
    }

    @Patch(':id/status')
    @Roles(UserRole.MENTOR, UserRole.ASSISTANT, UserRole.ADMIN)
    updateStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateSubmissionStatusDto,
        @Req() req: any,
    ) {
        return this.submissionService.updateStatus(id, dto, req['user'].id, req['user'].role);
    }
}
