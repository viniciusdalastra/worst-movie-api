import { Injectable, NotFoundException } from '@nestjs/common';
import { MovieService } from 'src/application/services/movie.service';
import { Movie } from 'src/domain/entities/movie.entity';

@Injectable()
export class FindMovieUseCase {
  constructor(private readonly movieService: MovieService) {}

  async execute(id: number): Promise<Movie> {
    const movie = await this.movieService.findOne(id);
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    return movie;
  }
}
