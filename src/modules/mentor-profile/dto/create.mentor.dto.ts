import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateMentorProfileDto {
    @ApiProperty({ required: false })
    @IsString()
    about: string;

    @ApiProperty({ required: false })
    @IsString()
    job: string;

    @ApiProperty({ example: 3 })
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    experience: number;

    @ApiProperty({ example: "https://www.telegram.com", required: false })
    @IsString()
    @IsOptional()
    telegram?: string;

    @ApiProperty({ example: "https://www.instagram.com", required: false })
    @IsString()
    @IsOptional()
    instagram?: string;

    @ApiProperty({ example: "https://www.linkedin.com", required: false })
    @IsString()
    @IsOptional()
    linkedin?: string;

    @ApiProperty({ example: "https://www.facebook.com", required: false })
    @IsString()
    @IsOptional()
    facebook?: string;

    @ApiProperty({ example: "https://www.github.com", required: false })
    @IsString()
    @IsOptional()
    github?: string;

    @ApiProperty({ example: "https://www.website.com", required: false })
    @IsString()
    @IsOptional()
    website?: string;
}