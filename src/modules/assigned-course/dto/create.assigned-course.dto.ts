import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAssignedCourseDto {
    @ApiProperty({ example: 1, description: 'Assistant userId' })
    @IsInt()
    @Type(() => Number)
    userId: number;

    @ApiProperty({ example: 1, description: 'Course id' })
    @IsInt()
    @Type(() => Number)
    courseId: number;
}