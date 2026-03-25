import { ApiProperty } from '@nestjs/swagger';
import { CourseLevel } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCourseDto {
    @ApiProperty({ example: 'NestJS Full Course' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'This course covers NestJS from scratch' })
    @IsString()
    about: string;

    @ApiProperty({ example: 99.99 })
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    price: number;

    @ApiProperty({ example: 1 })
    @IsNumber()
    @Type(() => Number)
    categoryId: number;

    @ApiProperty({ enum: CourseLevel })
    @IsEnum(CourseLevel)
    level: CourseLevel;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    introVideo?: string;
}