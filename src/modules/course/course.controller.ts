import {
    Body, Controller, Delete, Get, Param, Post, Put,
    Req, UploadedFiles, UseGuards, UseInterceptors, UnsupportedMediaTypeException,
    BadRequestException
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { diskStorage } from 'multer';
import { RoleGuard } from 'src/common/guards/role.guard';
import { CourseService } from './course.service';
import { UpdateCourseDto } from './dto/update-course.dto';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { CreateCourseDto } from './dto/create.course.dto';

const mediaStorage = diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'banner') {
            cb(null, './src/uploads/banners');
        } else if (file.fieldname === 'introVideo') {
            cb(null, './src/uploads/videos');
        }
    },
    filename: (req, file, cb) => {
        const filename = new Date().getTime() + '.' + file.mimetype.split('/')[1];
        cb(null, filename);
    },
});

const mediaFilter = (req: any, file: Express.Multer.File, cb: any) => {
    const allowedImages = ['png', 'jpg', 'jpeg'];
    const allowedVideos = ['mp4', 'webm', 'mkv'];
    const ext = file.mimetype.split('/')[1];

    if (file.fieldname === 'banner' && !allowedImages.includes(ext)) {
        return cb(new UnsupportedMediaTypeException('Only png, jpg, jpeg allowed'), false);
    }
    if (file.fieldname === 'introVideo' && !allowedVideos.includes(ext)) {
        return cb(new UnsupportedMediaTypeException('Only mp4, webm, mkv allowed'), false);
    }
    cb(null, true);
};

const fileFields = FileFieldsInterceptor([
    { name: 'banner', maxCount: 1 },
    { name: 'introVideo', maxCount: 1 },
], { storage: mediaStorage, fileFilter: mediaFilter });



@ApiBearerAuth()
@UseGuards(AuthGuard, RoleGuard)
@Controller('course')
export class CourseController {
    constructor(private courseService: CourseService) { }

    @Post()
    @Roles(UserRole.MENTOR, UserRole.ADMIN)
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            required: ['name', 'about', 'price', 'categoryId', 'level', 'banner'],
            properties: {
                name: { type: 'string' },
                about: { type: 'string' },
                price: { type: 'number' },
                categoryId: { type: 'number' },
                level: { type: 'string', enum: Object.values(require('@prisma/client').CourseLevel) },
                banner: { type: 'string', format: 'binary' },
                introVideo: { type: 'string', format: 'binary' },
            },
        },
    })
    @UseInterceptors(fileFields)
    create(
        @Body() payload: CreateCourseDto,
        @UploadedFiles() files: { banner?: Express.Multer.File[], introVideo?: Express.Multer.File[] },
        @Req() req: any,
    ) {
        if (!files.banner?.[0]) throw new BadRequestException('Banner is required');

        return this.courseService.create(
            req['user'].id,
            payload,
            files.banner?.[0]?.filename,
            files.introVideo?.[0]?.filename,
        );
    }

    @Get()
    @Roles(UserRole.ADMIN, UserRole.MENTOR, UserRole.ASSISTANT, UserRole.STUDENT)
    findAll() {
        return this.courseService.findAll();
    }

    @Get('my')
    @Roles(UserRole.MENTOR)
    findMyCourses(@Req() req: any) {
        console.log('User from token:', req['user']);
        return this.courseService.findMyCoures(req['user'].id);
    }

    @Get(':id')
    @Roles(UserRole.ADMIN, UserRole.MENTOR, UserRole.ASSISTANT, UserRole.STUDENT)
    findOne(@Param('id') id: number) {
        return this.courseService.findOne(id);
    }

    @Put(':id')
    @Roles(UserRole.ADMIN, UserRole.MENTOR)
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                about: { type: 'string' },
                price: { type: 'number' },
                categoryId: { type: 'number' },
                level: { type: 'string', enum: Object.values(require('@prisma/client').CourseLevel) },
                published: { type: 'boolean' },
                banner: { type: 'string', format: 'binary' },
                introVideo: { type: 'string', format: 'binary' },
            },
        },
    })
    @UseInterceptors(fileFields)
    update(
        @Param('id') id: number,
        @Body() dto: UpdateCourseDto,
        @UploadedFiles() files: { banner?: Express.Multer.File[], introVideo?: Express.Multer.File[] },
        @Req() req: any,
    ) {
        return this.courseService.update(
            id,
            req['user'].id,
            req['user'].role,
            dto,
            files.banner?.[0]?.filename,
            files.introVideo?.[0]?.filename,
        );
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN, UserRole.MENTOR)
    remove(@Param('id') id: number, @Req() req: any) {
        return this.courseService.remove(id, req['user'].id, req['user'].role);
    }
}