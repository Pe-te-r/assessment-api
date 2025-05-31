import {
  IsString,
  MinLength,
  MaxLength,
  IsInt,
  Min,
  Max,
  IsUUID,
} from 'class-validator';

export class CreateBookReviewDto {
  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  content: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsUUID()
  reviewedBy: string;

  @IsUUID()
  bookReview: string;
}
