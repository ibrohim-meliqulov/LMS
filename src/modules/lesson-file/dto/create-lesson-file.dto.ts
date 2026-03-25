import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLessonFileDto {
    @ApiProperty({ example: 1 })
    @IsInt()
    @Type(() => Number)
    lessonId: number;

    @ApiProperty({ example: 'Dars uchun qo\'shimcha material', required: false })
    @IsString()
    @IsOptional()
    note?: string;
}