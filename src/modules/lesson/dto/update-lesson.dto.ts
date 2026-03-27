import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateLessonDto {
    @ApiProperty({ example: 'NestJS Introduction', required: false })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({ example: 'In this lesson we will learn NestJS basics', required: false })
    @IsString()
    @IsOptional()
    about?: string;

    @ApiProperty({ example: 1, required: false })
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    sectionId?: number;
}