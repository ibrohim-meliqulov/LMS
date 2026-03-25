import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRatingDto {
    @ApiProperty({ example: 1 })
    @IsInt()
    @Type(() => Number)
    courseId: number;

    @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
    @IsInt()
    @Min(1)
    @Max(5)
    @Type(() => Number)
    rate: number;

    @ApiProperty({ example: 'Juda yaxshi kurs!' })
    @IsString()
    comment: string;
}