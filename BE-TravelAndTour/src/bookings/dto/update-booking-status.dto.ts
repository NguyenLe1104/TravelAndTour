import { IsEnum } from 'class-validator';

export enum UpdateBookingStatusEnum {
    PENDING = 'PENDING',
    PAID = 'PAID',
    CANCELLED = 'CANCELLED',
    COMPLETED = 'COMPLETED',
}

export class UpdateBookingStatusDto {
    @IsEnum(UpdateBookingStatusEnum)
    status: 'PENDING' | 'PAID' | 'CANCELLED' | 'COMPLETED';
}
