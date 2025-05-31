import {
  IsString,
  IsOptional,
  MaxLength,
  MinLength,
  IsDate,
  MaxDate,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAuthorDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  bio?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'birthDate must be a valid date' })
  @MaxDate(new Date(), { message: 'birthDate cannot be in the future' })
  birthDate?: Date;
}
