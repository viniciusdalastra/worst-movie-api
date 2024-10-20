import { Test, TestingModule } from '@nestjs/testing';
import { MovieService } from '../src/application/services/movie.service';
import { CreateMovieUseCase } from '../src/domain/usecases/createMovie.usecase';
import { BadRequestException } from '@nestjs/common';
import { CreateMovieDto } from '../src/domain/dtos/createMovie.dto';

describe('CreateMovieUseCase', () => {
  let createMovieUseCase: CreateMovieUseCase;
  let movieService: MovieService;

  const mockMovieService = {
    create: jest.fn().mockImplementation((movieData) => {
      return { id: 1, ...movieData };
    }),
    findAll: jest.fn().mockResolvedValue([]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateMovieUseCase,
        { provide: MovieService, useValue: mockMovieService },
      ],
    }).compile();

    createMovieUseCase = module.get<CreateMovieUseCase>(CreateMovieUseCase);
    movieService = module.get<MovieService>(MovieService);
  });

  it('should create a movie and return it with an id', async () => {
    const movieData = {
      year: 2022,
      title: 'Test Movie',
      studios: 'Test Studios',
      producers: 'Test Producers',
      winner: false,
    } as CreateMovieDto;

    const movie = await createMovieUseCase.execute(movieData);

    expect(movie).toHaveProperty('id');
    expect(movie.title).toEqual('Test Movie');
  });

  it('should throw an error if producer is not defined', async () => {
    const movieData = {
      year: 2022,
      title: 'Test Movie',
      studios: 'Test Studios',
      winner: false,
    } as CreateMovieDto;

    await expect(createMovieUseCase.execute(movieData)).rejects.toThrow(
      BadRequestException,
    );
    await expect(createMovieUseCase.execute(movieData)).rejects.toThrow(
      'Producer is required.',
    );
  });

  it('should throw an error if year is not defined', async () => {
    const movieData = {
      title: 'Test Movie',
      studios: 'Test Studios',
      producers: 'Test Producers',
      winner: false,
    } as CreateMovieDto;

    await expect(createMovieUseCase.execute(movieData)).rejects.toThrow(
      BadRequestException,
    );
    await expect(createMovieUseCase.execute(movieData)).rejects.toThrow(
      'Year is required.',
    );
  });

  it('should throw an error if studios is not defined', async () => {
    const movieData = {
      year: 2022,
      title: 'Test Movie',
      producers: 'Test Producers',
      winner: false,
    };

    await expect(createMovieUseCase.execute(movieData)).rejects.toThrow(
      BadRequestException,
    );
    await expect(createMovieUseCase.execute(movieData)).rejects.toThrow(
      'Studio is required.',
    );
  });
});
