import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateAnswerDto {
    @ApiProperty()
    @Type(() => Number)
    @IsInt()
    questionId: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    text: string;
}
