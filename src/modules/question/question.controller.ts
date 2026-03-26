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
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';

@ApiTags('Question')
@ApiBearerAuth()
@UseGuards(AuthGuard, RoleGuard)
@Controller('question')
export class QuestionController {
    constructor(private questionService: QuestionService) { }

    @Post()
    @Roles(UserRole.STUDENT)
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                courseId: { type: 'number' },
                text: { type: 'string' },
                file: { type: 'string', format: 'binary' },
            },
            required: ['courseId', 'text'],
        },
    })
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './src/uploads/questions',
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
        @Body() dto: CreateQuestionDto,
        @UploadedFile() file: Express.Multer.File,
        @Req() req: any,
    ) {
        return this.questionService.create(dto, file?.filename, req['user'].id);
    }

    @Get('course/:courseId')
    @Roles(UserRole.MENTOR, UserRole.ADMIN, UserRole.ASSISTANT, UserRole.STUDENT)
    findByCourse(
        @Param('courseId', ParseIntPipe) courseId: number,
        @Req() req: any,
    ) {
        return this.questionService.findByCourse(courseId, req['user'].id, req['user'].role);
    }

    @Patch(':id/read')
    @Roles(UserRole.MENTOR, UserRole.ADMIN, UserRole.ASSISTANT)
    markAsRead(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
        return this.questionService.markAsRead(id, req['user'].id, req['user'].role);
    }
}
