import { ApiProperty } from '@nestjs/swagger';
import { CourseLevel } from '@prisma/client';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateCourseDto {
    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    about?: string;

    @ApiProperty({ required: false })
    @IsNumber()
    @Min(0)
    @IsOptional()
    @Type(() => Number)
    price?: number;

    @ApiProperty({ required: false })
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    categoryId?: number;

    @ApiProperty({ enum: CourseLevel, required: false })
    @IsEnum(CourseLevel)
    @IsOptional()
    level?: CourseLevel;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    introVideo?: string;

    @ApiProperty({ required: false })
    @IsBoolean()
    @IsOptional()
    published?: boolean;
}