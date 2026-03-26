import { ApiProperty } from '@nestjs/swagger';
import { ExamAnswer } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, ValidateNested } from 'class-validator';

export class AnswerDto {
    @ApiProperty()
    @IsInt()
    examId: number;

    @ApiProperty({ enum: ExamAnswer })
    @IsEnum(ExamAnswer)
    answer: ExamAnswer;
}

export class SubmitExamDto {
    @ApiProperty()
    @IsInt()
    sectionId: number;

    @ApiProperty({ type: [AnswerDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AnswerDto)
    answers: AnswerDto[];
}
