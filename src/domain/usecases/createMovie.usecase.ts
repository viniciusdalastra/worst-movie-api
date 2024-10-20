import { Injectable, BadRequestException } from '@nestjs/common';
import { MovieService } from 'src/application/services/movie.service';
import { Movie } from 'src/domain/entities/movie.entity';
import { CreateMovieDto } from '../dtos/createMovie.dto';

@Injectable()
export class CreateMovieUseCase {
  constructor(private readonly movieService: MovieService) {}

  async execute(movieDto: CreateMovieDto): Promise<Movie> {
    const { producers, year, studios } = movieDto;

    if (!producers) {
      throw new BadRequestException('Producer is required.');
    }
    if (!year) {
      throw new BadRequestException('Year is required.');
    }
    if (!studios) {
      throw new BadRequestException('Studio is required.');
    }

    return await this.movieService.create(movieDto as Movie);
  }
}
