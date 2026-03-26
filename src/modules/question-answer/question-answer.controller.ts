import {
    Body, Controller, Post, Req, UploadedFile, UseGuards, UseInterceptors, UnsupportedMediaTypeException
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { QuestionAnswerService } from './question-answer.service';
import { CreateAnswerDto } from './dto/create-answer.dto';

@ApiTags('Question Answer')
@ApiBearerAuth()
@UseGuards(AuthGuard, RoleGuard)
@Controller('question-answer')
export class QuestionAnswerController {
    constructor(private qnaService: QuestionAnswerService) { }

    @Post()
    @Roles(UserRole.MENTOR, UserRole.ADMIN)
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                questionId: { type: 'number' },
                text: { type: 'string' },
                file: { type: 'string', format: 'binary' },
            },
            required: ['questionId', 'text'],
        },
    })
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './src/uploads/answers',
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
        @Body() dto: CreateAnswerDto,
        @UploadedFile() file: Express.Multer.File,
        @Req() req: any,
    ) {
        return this.qnaService.create(dto, file?.filename, req['user'].id, req['user'].role);
    }
}
