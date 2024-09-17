import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class SearchDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @Length(6, 6)
  number?: string;
}
