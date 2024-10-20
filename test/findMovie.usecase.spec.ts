import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieService } from '../src/application/services/movie.service';
import { NotFoundException } from '@nestjs/common';
import { Movie } from '../src/domain/entities/movie.entity';
import { CreateMovieUseCase } from '../src/domain/usecases/createMovie.usecase';
import { FindMovieUseCase } from '../src/domain/usecases/findMovie.usecase';

describe('FindMovieUseCase', () => {
  let findMovieUseCase: FindMovieUseCase;
  let createMovieUseCase: CreateMovieUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Movie],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Movie]),
      ],
      providers: [FindMovieUseCase, CreateMovieUseCase, MovieService],
    }).compile();

    findMovieUseCase = module.get<FindMovieUseCase>(FindMovieUseCase);
    createMovieUseCase = module.get<CreateMovieUseCase>(CreateMovieUseCase);
  });

  it('should return a movie by ID', async () => {
    const movie = await createMovieUseCase.execute({
      year: 2022,
      title: 'Test Movie',
      studios: 'Test Studios',
      producers: 'Test Producers',
      winner: false,
    });

    const foundMovie = await findMovieUseCase.execute(movie.id);
    expect(foundMovie).toEqual(movie);
  });

  it('should throw NotFoundException if movie does not exist', async () => {
    await expect(findMovieUseCase.execute(999)).rejects.toThrow(
      NotFoundException,
    );
  });
});
