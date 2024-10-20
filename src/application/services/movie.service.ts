import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from 'src/domain/entities/movie.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private repository: Repository<Movie>,
  ) {}

  async findAll(): Promise<Movie[]> {
    return await this.repository.find();
  }

  async create(movie: Movie): Promise<Movie> {
    return await this.repository.save(movie);
  }

  async findOne(id: number): Promise<Movie> {
    return await this.repository.findOneBy({ id });
  }

  async update(id: number, movie: Partial<Movie>): Promise<Movie> {
    await this.repository.update(id, movie);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
