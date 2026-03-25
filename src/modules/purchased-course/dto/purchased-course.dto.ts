import { ApiProperty } from "@nestjs/swagger";
import { PaidVia } from "@prisma/client";
import { Type } from "class-transformer";
import { IsEnum, IsInt, IsNumber, Min } from "class-validator";

export class CreatePurchasedCourseDto {
    @ApiProperty({ example: 1 })
    @IsInt()
    @Type(() => Number)
    courseId: number;

    @ApiProperty({
        enum: PaidVia,
        enumName: 'PaidVia',
        description: `Qiymatlar: ${Object.values(PaidVia).join(' | ')}`,
        example: PaidVia.CASH
    })
    @IsEnum(PaidVia)
    paidVia: PaidVia;


    @ApiProperty({ required: false, example: 99.99 })
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    amount: number;
}