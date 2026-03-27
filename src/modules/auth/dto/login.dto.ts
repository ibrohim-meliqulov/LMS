import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
    @ApiProperty({ example: '+998901234567' })
    @IsString()
    phone: string;

    @ApiProperty({ example: 'Ibrohim1234!' })
    @IsString()
    password: string;
}