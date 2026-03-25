import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSectionLessonDto {
    @ApiProperty({ example: 1 })
    @IsInt()
    @Type(() => Number)
    courseId: number;

    @ApiProperty({ example: 'Kirish bo\'limi' })
    @IsString()
    name: string;
}