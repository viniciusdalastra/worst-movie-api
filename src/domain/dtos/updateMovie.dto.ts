import { IsString, IsInt, IsBoolean, IsOptional } from 'class-validator';

export class UpdateMovieDto {
  @IsOptional()
  @IsInt()
  year?: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  studios?: string;

  @IsOptional()
  @IsString()
  producers?: string;

  @IsOptional()
  @IsBoolean()
  winner?: boolean;
}
