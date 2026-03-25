import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLessonDto {
    @ApiProperty({ example: 1 })
    @IsInt()
    @Type(() => Number)
    sectionId: number;

    @ApiProperty({ example: 'JavaScript asoslari' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'Bu darsda JS asoslarini o\'rganamiz' })
    @IsString()
    about: string;

    @ApiProperty({ example: 'videos/lesson-1.mp4' })
    @IsString()
    video: string;
}