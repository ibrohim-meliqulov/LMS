import {
    Body, Controller, Delete, Get, Param, ParseIntPipe,
    Post, UploadedFile, UseGuards, UseInterceptors,
    UnsupportedMediaTypeException,
    Put,
    Req
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags , ApiOperation } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { diskStorage } from 'multer';
import { RoleGuard } from 'src/common/guards/role.guard';
import { UserService } from './user.service';
import { CreateTeacherDto, CreateUserDto } from './dto/user.dto';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateRoleDto } from './dto/update-role.dto';



@ApiBearerAuth()
@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    @Post('register')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                phone: { type: 'string' },
                password: { type: 'string' },
                fullName: { type: 'string' },
                image: { type: 'string', format: 'binary' },
            },
        },
    })
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: "./src/uploads/images",
            filename: (req, file, cb) => {
                const filename = new Date().getTime() + "." + file.mimetype.split("/")[1]
                cb(null, filename)
            }
        }),
        fileFilter: (req, file, cb) => {
            const existFile = ["png", "jpg", "jpeg"]

            if (!existFile.includes(file.mimetype.split("/")[1])) {
                cb(new UnsupportedMediaTypeException(), false)
            }
            cb(null, true)
        }
    }))
    register(
        @Body() payload: CreateUserDto,
        @UploadedFile() file?: Express.Multer.File,
    ) {
        return this.userService.register(payload, file?.filename);
    }





    @Post('teacher/register')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                phone: { type: 'string' },
                password: { type: 'string' },
                fullName: { type: 'string' },
                role: { type: "string", enum: [UserRole.ASSISTANT, UserRole.MENTOR] },
                image: { type: 'string', format: 'binary' },
            },
        },
    })
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: "./src/uploads/images",
            filename: (req, file, cb) => {
                const filename = new Date().getTime() + "." + file.mimetype.split("/")[1]
                cb(null, filename)
            }
        }),
        fileFilter: (req, file, cb) => {
            const existFile = ["png", "jpg", "jpeg"]

            if (!existFile.includes(file.mimetype.split("/")[1])) {
                cb(new UnsupportedMediaTypeException(), false)
            }
            cb(null, true)
        }
    }))
    teacherRegister(
        @Body() payload: CreateTeacherDto,
        @UploadedFile() file?: Express.Multer.File,
    ) {
        return this.userService.teacherRegister(payload, file?.filename);
    }


    @Get()
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: "ADMIN" })
    findAll() {
        return this.userService.findAll();
    }



    @Get(':id')
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: "ADMIN" })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.userService.findOne(id);
    }


    @Put(':id/role')
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: "ADMIN" })
    updateRole(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateRoleDto,
    ) {
        return this.userService.updateRole(id, dto);
    }




    @Put()
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(UserRole.ADMIN, UserRole.ASSISTANT, UserRole.MENTOR, UserRole.STUDENT)
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                phone: { type: 'string' },
                password: { type: 'string' },
                fullName: { type: 'string' },
                image: { type: 'string', format: 'binary' },
            },
        },
    })
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: "./src/uploads/images",
            filename: (req, file, cb) => {
                const filename = new Date().getTime() + "." + file.mimetype.split("/")[1]
                cb(null, filename)
            }
        }),
        fileFilter: (req, file, cb) => {
            const existFile = ["png", "jpg", "jpeg"]

            if (!existFile.includes(file.mimetype.split("/")[1])) {
                cb(new UnsupportedMediaTypeException(), false)
            }
            cb(null, true)
        }
    }))
    @ApiOperation({ summary: "ADMIN, ASSISTANT, MENTOR, STUDENT" })
    update(
        @Req() req: any,
        @Body() dto: UpdateUserDto,
        @UploadedFile() file?: Express.Multer.File
    ) {
        return this.userService.update(req['user'], dto, file?.filename);
    }


    @Delete(':id')
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(UserRole.ADMIN, UserRole.STUDENT)
    @ApiOperation({ summary: "ADMIN, STUDENT" })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.userService.remove(id);
    }
}