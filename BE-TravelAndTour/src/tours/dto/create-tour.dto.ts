import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateTourDto {
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNumber()
    price: number;

    @IsNumber()
    durationDays: number;

    @IsString()
    location: string;

    @IsNumber()
    seatsTotal: number;
}
