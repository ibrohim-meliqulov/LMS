import { ApiProperty } from '@nestjs/swagger';
import { ExamAnswer } from '@prisma/client';
import { IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateExamDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    question: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    variantA: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    variantB: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    variantC: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    variantD: string;

    @ApiProperty({ enum: ExamAnswer })
    @IsEnum(ExamAnswer)
    @IsNotEmpty()
    answer: ExamAnswer;

    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    sectionId: number;
}
