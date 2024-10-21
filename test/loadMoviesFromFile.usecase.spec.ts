import { Test, TestingModule } from '@nestjs/testing';
import { CreateMovieUseCase } from 'src/domain/usecases/createMovie.usecase';
import { LoadMoviesFromFileUseCase } from 'src/domain/usecases/loadMoviesFromFile.usecase';

describe('LoadMoviesFromFileUseCase', () => {
  let loadMoviesFromFileUseCase: LoadMoviesFromFileUseCase;
  let createMovieUseCase: CreateMovieUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoadMoviesFromFileUseCase,
        {
          provide: CreateMovieUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(null),
          },
        },
      ],
    }).compile();

    loadMoviesFromFileUseCase = module.get<LoadMoviesFromFileUseCase>(LoadMoviesFromFileUseCase);
    createMovieUseCase = module.get<CreateMovieUseCase>(CreateMovieUseCase);
  });

  it('should load valid movies from movielist.csv', async () => {
    const result = await loadMoviesFromFileUseCase.execute('test_movielist.csv');

    expect(result).toEqual({ success: true, message: 'Movies loaded successfully.' });
    expect(createMovieUseCase.execute).toHaveBeenCalled();
    expect(createMovieUseCase.execute).toHaveBeenCalledTimes(2);
  });

  it('should return an error for invalid movies in movielist_error.csv', async () => {
    await expect(loadMoviesFromFileUseCase.execute('test_movielist_error.csv')).rejects.toEqual({
      success: false,
      message: 'CSV file contains invalid data.',
    });
    expect(createMovieUseCase.execute).not.toHaveBeenCalled();
  });
});
