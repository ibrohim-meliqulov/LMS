import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateQuestionDto {
    @ApiProperty()
    @Type(() => Number)
    @IsInt()
    courseId: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    text: string;
}
