import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieService } from '../src/application/services/movie.service';
import { Movie } from '../src/domain/entities/movie.entity';
import { CreateMovieUseCase } from '../src/domain/usecases/createMovie.usecase';
import { DeleteMovieUseCase } from '../src/domain/usecases/deleteMovie.usecase';

describe('DeleteMovieUseCase', () => {
  let deleteMovieUseCase: DeleteMovieUseCase;
  let createMovieUseCase: CreateMovieUseCase;
  let movieService: MovieService;

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
      providers: [DeleteMovieUseCase, CreateMovieUseCase, MovieService],
    }).compile();

    deleteMovieUseCase = module.get<DeleteMovieUseCase>(DeleteMovieUseCase);
    createMovieUseCase = module.get<CreateMovieUseCase>(CreateMovieUseCase);
    movieService = module.get<MovieService>(MovieService);
  });

  it('should delete a movie', async () => {
    const movie = await createMovieUseCase.execute({
      year: 2022,
      title: 'Movie to Delete',
      studios: ['Test Studios'],
      producers: ['Test Producers'],
      winner: false,
    });

    await deleteMovieUseCase.execute(movie.id);

    const movies = await movieService.findAll();
    expect(movies).toHaveLength(0);
  });

  it('should throw NotFoundException if movie does not exist', async () => {
    await expect(deleteMovieUseCase.execute(999)).rejects.toThrow(
      NotFoundException,
    );
  });
});
