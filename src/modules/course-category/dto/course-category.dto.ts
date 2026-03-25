import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCourseCategoryDto {
    @ApiProperty({ example: 'Programming' })
    @IsString()
    name: string;
}