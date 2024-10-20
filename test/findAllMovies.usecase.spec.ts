import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieService } from '../src/application/services/movie.service';
import { Movie } from '../src/domain/entities/movie.entity';
import { CreateMovieUseCase } from '../src/domain/usecases/createMovie.usecase';
import { FindAllMoviesUseCase } from '../src/domain/usecases/findAllMovies.usecase';

describe('FindAllMoviesUseCase', () => {
  let findAllMoviesUseCase: FindAllMoviesUseCase;
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
      providers: [FindAllMoviesUseCase, CreateMovieUseCase, MovieService],
    }).compile();

    findAllMoviesUseCase =
      module.get<FindAllMoviesUseCase>(FindAllMoviesUseCase);
    createMovieUseCase = module.get<CreateMovieUseCase>(CreateMovieUseCase);
  });

  it('should return an array of movies', async () => {
    await createMovieUseCase.execute({
      year: 2022,
      title: 'Test Movie 1',
      studios: 'Test Studios 1',
      producers: 'Test Producers 1',
      winner: false,
    });
    await createMovieUseCase.execute({
      year: 2023,
      title: 'Test Movie 2',
      studios: 'Test Studios 2',
      producers: 'Test Producers 2',
      winner: true,
    });

    const movies = await findAllMoviesUseCase.execute();
    expect(movies).toHaveLength(2);
  });
});
