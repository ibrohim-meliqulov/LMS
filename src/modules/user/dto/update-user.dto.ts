import { ApiProperty } from '@nestjs/swagger';
import { IsMobilePhone, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
    @ApiProperty({ required: false })
    @IsMobilePhone("uz-UZ")
    @IsOptional()
    phone?: string;

    @ApiProperty({ required: false })
    @IsString()
    @MinLength(6)
    @IsOptional()
    password?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    fullName?: string;
}