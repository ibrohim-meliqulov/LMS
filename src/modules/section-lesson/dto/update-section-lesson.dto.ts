import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateSectionLessonDto {
    @ApiProperty({ example: 'Yangi nom', required: false })
    @IsString()
    @IsOptional()
    name?: string;
}