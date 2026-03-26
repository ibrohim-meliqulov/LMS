import { ApiProperty } from '@nestjs/swagger';
import { HomeworkSubStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateSubmissionStatusDto {
    @ApiProperty({ enum: HomeworkSubStatus })
    @IsEnum(HomeworkSubStatus)
    status: HomeworkSubStatus;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    reason?: string;
}
