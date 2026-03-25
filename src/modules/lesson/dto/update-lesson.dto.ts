import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateLessonDto {
    @ApiProperty({ example: 'Yangi nom', required: false })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({ example: 'Yangi tavsif', required: false })
    @IsString()
    @IsOptional()
    about?: string;

    @ApiProperty({ example: 'videos/lesson-2.mp4', required: false })
    @IsString()
    @IsOptional()
    video?: string;
}