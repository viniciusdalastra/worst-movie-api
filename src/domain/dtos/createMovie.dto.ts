import { IsArray, IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateMovieDto {
  @IsInt()
  year: number;

  @IsString()
  title: string;

  @IsOptional()
  @IsArray()
  studios?: string[];

  @IsOptional()
  @IsArray()
  producers?: string[];

  @IsBoolean()
  winner: boolean;
}
