import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateRatingDto {
    @ApiProperty({ example: 4, minimum: 1, maximum: 5, required: false })
    @IsInt()
    @Min(1)
    @Max(5)
    @Type(() => Number)
    @IsOptional()
    rate?: number;

    @ApiProperty({ example: 'Yangilangan izoh', required: false })
    @IsString()
    @IsOptional()
    comment?: string;
}