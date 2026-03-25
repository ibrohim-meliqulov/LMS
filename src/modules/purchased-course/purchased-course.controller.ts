import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { PurchasedCourseService } from './purchased-course.service';
import { CreatePurchasedCourseDto } from './dto/purchased-course.dto';

@ApiTags('Purchased Course')
@ApiBearerAuth()
@UseGuards(AuthGuard, RoleGuard)
@Controller('purchased-course')
export class PurchasedCourseController {
    constructor(private purchasedCourseService: PurchasedCourseService) { }

    @Post()
    @Roles(UserRole.ADMIN, UserRole.STUDENT, UserRole.MENTOR)
    create(@Body() payload: CreatePurchasedCourseDto, @Req() req: any) {
        return this.purchasedCourseService.create(payload, req['user'].id);
    }

    @Get()
    @Roles(UserRole.ADMIN)
    findAll() {
        return this.purchasedCourseService.findAll();
    }

    @Get('my')
    @Roles(UserRole.ADMIN, UserRole.STUDENT, UserRole.MENTOR)
    findMy(@Req() req: any) {
        return this.purchasedCourseService.findByUser(req['user'].id);
    }

    @Get(':id')
    @Roles(UserRole.ADMIN, UserRole.ASSISTANT)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.purchasedCourseService.findOne(id);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.purchasedCourseService.remove(id);
    }
}