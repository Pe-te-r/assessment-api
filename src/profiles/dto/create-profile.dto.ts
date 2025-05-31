import {
  IsOptional,
  IsString,
  IsDateString,
  IsUrl,
  IsUUID,
} from 'class-validator';

export class CreateProfileDto {
  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Avatar must be a valid URL' })
  avatar?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Date of birth must be a valid date string' })
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsUUID()
  owner: string;
}
