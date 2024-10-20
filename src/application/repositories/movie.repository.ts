import { Repository } from 'typeorm';
import { Movie } from '../../domain/entities/movie.entity';

export class MovieRepository {
  constructor(private repository: Repository<Movie>) {}

  async findAllWinners(): Promise<Movie[]> {
    return this.repository.find({ where: { winner: true } });
  }
}
