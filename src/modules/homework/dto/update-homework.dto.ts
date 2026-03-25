import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateHomeworkDto {
    @ApiProperty({ example: 'Yangilangan vazifa', required: false })
    @IsString()
    @IsOptional()
    task?: string;
}