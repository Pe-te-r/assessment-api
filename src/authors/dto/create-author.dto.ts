/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  IsString,
  IsOptional,
  MaxLength,
  MinLength,
  IsDate,
  ValidateIf,
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
  @ValidateIf((o) => o.birthDate <= new Date())
  birthDate?: Date;
}
