import { IsNumber, IsArray, ValidateNested, IsString, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTravelerDto {
    @IsString()
    fullName: string;

    @IsEnum({ MALE: 'MALE', FEMALE: 'FEMALE', OTHER: 'OTHER' })
    gender: 'MALE' | 'FEMALE' | 'OTHER';

    @IsOptional()
    @IsDateString()
    dob?: string;

    @IsOptional()
    @IsString()
    passport?: string;
}

export class CreateBookingDto {
    @IsNumber()
    tourId: number;

    @IsNumber()
    quantity: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateTravelerDto)
    travelers: CreateTravelerDto[];
}
