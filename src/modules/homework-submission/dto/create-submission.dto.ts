import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateSubmissionDto {
    @ApiProperty()
    @Type(() => Number)
    @IsInt()
    homeworkId: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    text?: string;
}
