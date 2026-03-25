import {
    Body, Controller, Delete, Get, Param, ParseIntPipe,
    Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors, UnsupportedMediaTypeException
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { HomeworkService } from './homework.service';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { UpdateHomeworkDto } from './dto/update-homework.dto';

const fileInterceptor = () => FileInterceptor('file', {
    storage: diskStorage({
        destination: './src/uploads/homeworks',
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
});

@ApiTags('Homework')
@ApiBearerAuth()
@UseGuards(AuthGuard, RoleGuard)
@Controller('homework')
export class HomeworkController {
    constructor(private homeworkService: HomeworkService) { }

    @Post()
    @Roles(UserRole.MENTOR, UserRole.ADMIN)
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                lessonId: { type: 'number' },
                task: { type: 'string' },
                file: { type: 'string', format: 'binary' },
            },
            required: ['lessonId', 'task'],
        },
    })
    @UseInterceptors(fileInterceptor())
    create(
        @Body() dto: CreateHomeworkDto,
        @UploadedFile() file: Express.Multer.File,
        @Req() req: any,
    ) {
        return this.homeworkService.create(dto, file?.filename, req['user'].id);
    }

    @Get('lesson/:lessonId')
    @Roles(UserRole.ADMIN, UserRole.ASSISTANT, UserRole.STUDENT, UserRole.MENTOR)
    findByLesson(
        @Param('lessonId', ParseIntPipe) lessonId: number,
        @Req() req: any,
    ) {
        return this.homeworkService.findByLesson(lessonId, req['user'].id, req['user'].role);
    }

    @Patch(':id')
    @Roles(UserRole.MENTOR)
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                task: { type: 'string' },
                file: { type: 'string', format: 'binary' },
            },
        },
    })
    @UseInterceptors(fileInterceptor())
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateHomeworkDto,
        @UploadedFile() file: Express.Multer.File,
        @Req() req: any,
    ) {
        return this.homeworkService.update(id, dto, file?.filename, req['user'].id);
    }

    @Delete(':id')
    @Roles(UserRole.MENTOR, UserRole.ADMIN)
    remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
        return this.homeworkService.remove(id, req['user'].id, req['user'].role);
    }
}