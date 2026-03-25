import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { IsEnum, IsMobilePhone, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ example: '+998' })
    @IsMobilePhone("uz-UZ")
    phone: string;

    @ApiProperty({ example: 'secret123' })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({ example: 'John Doe' })
    @IsString()
    fullName: string;
}




export class CreateTeacherDto {
    @ApiProperty({ example: '+998' })
    @IsMobilePhone("uz-UZ")
    phone: string;

    @ApiProperty({ example: 'secret123' })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({ example: 'John Doe' })
    @IsString()
    fullName: string;


    @ApiProperty()
    @IsEnum(UserRole)
    role: UserRole
}