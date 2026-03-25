import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateHomeworkDto {
    @ApiProperty({ example: 1 })
    @IsInt()
    @Type(() => Number)
    lessonId: number;

    @ApiProperty({ example: 'Ushbu mavzu bo\'yicha vazifa bajaring' })
    @IsString()
    task: string;
}