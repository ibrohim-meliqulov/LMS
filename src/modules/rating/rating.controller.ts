import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags , ApiOperation } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';

@ApiTags('Rating')
@ApiBearerAuth()
@UseGuards(AuthGuard, RoleGuard)
@Controller('rating')
export class RatingController {
    constructor(private ratingService: RatingService) { }

    @Post()
    @Roles(UserRole.STUDENT, UserRole.MENTOR)
    @ApiOperation({ summary: "STUDENT, MENTOR" })
    create(@Body() dto: CreateRatingDto, @Req() req: any) {
        return this.ratingService.create(dto, req['user'].id);
    }

    @Get('course/:courseId')
    @Roles(UserRole.ADMIN, UserRole.ASSISTANT, UserRole.STUDENT, UserRole.MENTOR)
    @ApiOperation({ summary: "ADMIN, ASSISTANT, STUDENT, MENTOR" })
    findByCourse(@Param('courseId', ParseIntPipe) courseId: number) {
        return this.ratingService.findByCourse(courseId);
    }

    @Patch(':id')
    @Roles(UserRole.STUDENT, UserRole.MENTOR)
    @ApiOperation({ summary: "STUDENT, MENTOR" })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateRatingDto,
        @Req() req: any,
    ) {
        return this.ratingService.update(id, dto, req['user'].id);
    }

    @Delete(':id')
    @Roles(UserRole.STUDENT, UserRole.MENTOR)
    @ApiOperation({ summary: "STUDENT, MENTOR" })
    remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
        return this.ratingService.remove(id, req['user'].id);
    }

    @Delete('admin/:id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: "ADMIN" })
    adminRemove(@Param('id', ParseIntPipe) id: number) {
        return this.ratingService.adminRemove(id);
    }
}