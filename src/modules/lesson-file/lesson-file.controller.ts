import {
    Body, Controller, Delete, Get, Param, ParseIntPipe,
    Post, Req, UploadedFile, UseGuards, UseInterceptors, UnsupportedMediaTypeException
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { LessonFileService } from './lesson-file.service';
import { CreateLessonFileDto } from './dto/create-lesson-file.dto';

@ApiTags('Lesson File')
@ApiBearerAuth()
@UseGuards(AuthGuard, RoleGuard)
@Controller('lesson-file')
export class LessonFileController {
    constructor(private lessonFileService: LessonFileService) { }

    @Post()
    @Roles(UserRole.MENTOR, UserRole.ADMIN)
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                lessonId: { type: 'number' },
                note: { type: 'string' },
                file: { type: 'string', format: 'binary' },
            },
            required: ['lessonId', 'file'],
        },
    })
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './src/uploads/lesson-file',
            filename: (req, file, cb) => {
                const filename = new Date().getTime() + '.' + file.mimetype.split('/')[1];
                cb(null, filename);
            },
        }),
        fileFilter: (req, file, cb) => {
            const allowed = ['pdf', 'doc', 'docx', 'zip', 'png', 'jpg', 'jpeg'];
            const ext = file.mimetype.split('/')[1];
            if (!allowed.includes(ext)) {
                cb(new UnsupportedMediaTypeException('Only pdf, doc, docx, zip, png, jpg, jpeg allowed'), false);
            } else {
                cb(null, true);
            }
        },
    }))
    create(
        @Body() dto: CreateLessonFileDto,
        @UploadedFile() file: Express.Multer.File,
        @Req() req: any,
    ) {
        return this.lessonFileService.create(dto, file.filename, req['user'].id);
    }

    @Get('lesson/:lessonId')
    @Roles(UserRole.ADMIN, UserRole.ASSISTANT, UserRole.STUDENT, UserRole.MENTOR)
    findByLesson(
        @Param('lessonId', ParseIntPipe) lessonId: number,
        @Req() req: any,
    ) {
        return this.lessonFileService.findByLesson(lessonId, req['user'].id);
    }

    @Delete(':id')
    @Roles(UserRole.MENTOR, UserRole.ADMIN)
    remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
        return this.lessonFileService.remove(id, req['user'].id, req['user'].role);
    }
}