import { Injectable } from '@nestjs/common';
import { MovieService } from 'src/application/services/movie.service';
import { Movie } from 'src/domain/entities/movie.entity';

@Injectable()
export class FindAllMoviesUseCase {
  constructor(private readonly movieService: MovieService) {}

  async execute(): Promise<Movie[]> {
    return await this.movieService.findAll();
  }
}
