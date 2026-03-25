import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
    @ApiProperty({ example: '+998901234567' })
    @IsString()
    phone: string;

    @ApiProperty({ example: 'secret123' })
    @IsString()
    password: string;
}