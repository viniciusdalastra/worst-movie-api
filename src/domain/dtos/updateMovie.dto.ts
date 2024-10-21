import { IsArray, IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateMovieDto {
  @IsOptional()
  @IsInt()
  year?: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsArray()
  studios?: string[];

  @IsOptional()
  @IsArray()
  producers?: string[];

  @IsOptional()
  @IsBoolean()
  winner?: boolean;
}
