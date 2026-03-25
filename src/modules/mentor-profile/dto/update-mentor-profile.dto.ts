import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateMentorProfileDto {

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    @Transform(({ value }) => {
        if (typeof value === 'string' && value.trim() === '') return undefined;
        return value;
    })
    about?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    @Transform(({ value }) => {
        if (typeof value === 'string' && value.trim() === '') return undefined;
        return value;
    })
    job?: string;

    @ApiProperty({ required: false })
    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => {
        if (value === null || value === undefined) return undefined;
        if (typeof value === 'string' && value.trim() === '') return undefined;
        return Number(value);
    })
    @Type(() => Number)
    experience?: number;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    @Transform(({ value }) => {
        if (typeof value === 'string' && value.trim() === '') return undefined;
        return value;
    })
    telegram?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    @Transform(({ value }) => {
        if (typeof value === 'string' && value.trim() === '') return undefined;
        return value;
    })
    instagram?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    @Transform(({ value }) => {
        if (typeof value === 'string' && value.trim() === '') return undefined;
        return value;
    })
    linkedin?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    @Transform(({ value }) => {
        if (typeof value === 'string' && value.trim() === '') return undefined;
        return value;
    })
    facebook?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    @Transform(({ value }) => {
        if (typeof value === 'string' && value.trim() === '') return undefined;
        return value;
    })
    github?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    @Transform(({ value }) => {
        if (typeof value === 'string' && value.trim() === '') return undefined;
        return value;
    })
    website?: string;
}