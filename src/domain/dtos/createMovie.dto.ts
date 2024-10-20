import { IsString, IsInt, IsBoolean, IsOptional } from 'class-validator';

export class CreateMovieDto {
  @IsInt()
  year: number;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  studios?: string;

  @IsOptional()
  @IsString()
  producers?: string;

  @IsBoolean()
  winner: boolean;
}
