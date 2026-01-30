import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateReviewTourDto {
  @IsInt()
  tourId: number;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  comment?: string;
}
