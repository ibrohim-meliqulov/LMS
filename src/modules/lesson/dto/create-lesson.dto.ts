import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLessonDto {
    @ApiProperty({ example: 'NestJS Introduction' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'In this lesson we will learn NestJS basics' })
    @IsString()
    about: string;

    @ApiProperty({ example: 1 })
    @IsNumber()
    @Type(() => Number)
    sectionId: number;
}