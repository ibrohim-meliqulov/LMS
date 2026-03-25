import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCourseCategoryDto {
    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    @Transform(({ value }) => value === '' ? undefined : value)
    name?: string;
}