import { Injectable, NotFoundException } from '@nestjs/common';
import { MovieService } from 'src/application/services/movie.service';

@Injectable()
export class DeleteMovieUseCase {
  constructor(private readonly movieService: MovieService) {}

  async execute(id: number): Promise<void> {
    const movie = await this.movieService.findOne(id);
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    await this.movieService.remove(id);
  }
}
