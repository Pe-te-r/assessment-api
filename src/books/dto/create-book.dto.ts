import {
  IsString,
  MinLength,
  MaxLength,
  IsInt,
  Min,
  Max,
  IsUUID,
} from 'class-validator';

export class CreateBookDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title: string;

  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  description: string;

  @IsInt()
  @Min(1000)
  @Max(new Date().getFullYear())
  publicationYear: number;

  @IsUUID()
  author: string;

  @IsUUID()
  category: string;
}
