import {
    Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post,
    Req, UseGuards, UseInterceptors, UploadedFile, UnsupportedMediaTypeException,
    BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { UserRole } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@ApiTags('Lesson')
@ApiBearerAuth()
@UseGuards(AuthGuard, RoleGuard)
@Controller('lesson')
export class LessonController {
    constructor(private lessonService: LessonService) { }

    @Post()
    @Roles(UserRole.MENTOR, UserRole.ADMIN)
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            required: ['name', 'about', 'sectionId', 'video'],
            properties: {
                name: { type: 'string' },
                about: { type: 'string' },
                sectionId: { type: 'number' },
                video: { type: 'string', format: 'binary' },
            },
        },
    })
    @UseInterceptors(FileInterceptor('video', {
        storage: diskStorage({
            destination: './src/uploads/videos',
            filename: (req, file, cb) => {
                const filename = new Date().getTime() + '.' + file.mimetype.split('/')[1];
                cb(null, filename);
            },
        }),
        fileFilter: (req, file, cb) => {
            const allowedVideos = ['mp4', 'webm', 'mkv'];
            const ext = file.mimetype.split('/')[1];
            if (!allowedVideos.includes(ext)) {
                return cb(new UnsupportedMediaTypeException('Only mp4, webm, mkv allowed'), false);
            }
            cb(null, true);
        },
    }))
    create(
        @Body() dto: CreateLessonDto,
        @UploadedFile() video: Express.Multer.File,
        @Req() req: any,
    ) {
        if (!video) throw new BadRequestException('Video is required');
        return this.lessonService.create(dto, req['user'].id, video.filename);
    }

    @Get('section/:sectionId')
    findBySection(
        @Param('sectionId', ParseIntPipe) sectionId: number,
        @Req() req: any,
    ) {
        return this.lessonService.findBySection(sectionId, req['user'].id, req['user'].role);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
        return this.lessonService.findOne(id, req['user'].id, req['user'].role);
    }

    @Patch(':id')
    @Roles(UserRole.MENTOR, UserRole.ADMIN)
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                about: { type: 'string' },
                sectionId: { type: 'number' },
                video: { type: 'string', format: 'binary' },
            },
        },
    })
    @UseInterceptors(FileInterceptor('video', {
        storage: diskStorage({
            destination: './src/uploads/videos',
            filename: (req, file, cb) => {
                const filename = new Date().getTime() + '.' + file.mimetype.split('/')[1];
                cb(null, filename);
            },
        }),
        fileFilter: (req, file, cb) => {
            const allowedVideos = ['mp4', 'webm', 'mkv'];
            const ext = file.mimetype.split('/')[1];
            if (!allowedVideos.includes(ext)) {
                return cb(new UnsupportedMediaTypeException('Only mp4, webm, mkv allowed'), false);
            }
            cb(null, true);
        },
    }))
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateLessonDto,
        @UploadedFile() video: Express.Multer.File,
        @Req() req: any,
    ) {
        return this.lessonService.update(id, dto, req['user'].id, video?.filename);
    }

    @Delete(':id')
    @Roles(UserRole.MENTOR)
    remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
        return this.lessonService.remove(id, req['user'].id);
    }

    @Delete('admin/:id')
    @Roles(UserRole.ADMIN)
    adminRemove(@Param('id', ParseIntPipe) id: number) {
        return this.lessonService.adminRemove(id);
    }
}