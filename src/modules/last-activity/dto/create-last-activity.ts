import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLastActivityDto {
    @ApiProperty({ example: 1, required: false })
    @IsInt()
    @Type(() => Number)
    @IsOptional()
    courseId?: number;

    @ApiProperty({ example: 1, required: false })
    @IsInt()
    @Type(() => Number)
    @IsOptional()
    sectionId?: number;

    @ApiProperty({ example: 1, required: false })
    @IsInt()
    @Type(() => Number)
    @IsOptional()
    lessonId?: number;

    @ApiProperty({ example: '/courses/1/lessons/2', required: false })
    @IsString()
    @IsOptional()
    url?: string;
}