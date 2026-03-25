import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { LastActivityService } from './last-activity.service';
import { CreateLastActivityDto } from './dto/create-last-activity';

@ApiTags('Last Activity')
@ApiBearerAuth()
@UseGuards(AuthGuard, RoleGuard)
@Controller('last-activity')
export class LastActivityController {
    constructor(private lastActivityService: LastActivityService) { }

    @Post()
    @Roles(UserRole.STUDENT, UserRole.MENTOR)
    upsert(@Body() dto: CreateLastActivityDto, @Req() req: any) {
        return this.lastActivityService.upsert(dto, req['user'].id);
    }

    @Get('my')
    @Roles(UserRole.STUDENT, UserRole.MENTOR)
    findMy(@Req() req: any) {
        return this.lastActivityService.findMy(req['user'].id);
    }

    @Get('user/:userId')
    @Roles(UserRole.ADMIN, UserRole.ASSISTANT)
    findByUser(@Param('userId', ParseIntPipe) userId: number) {
        return this.lastActivityService.findByUser(userId);
    }
}