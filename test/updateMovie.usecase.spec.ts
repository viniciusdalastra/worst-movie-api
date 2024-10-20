import { NotFoundException } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieService } from 'src/application/services/movie.service';
import { Movie } from 'src/domain/entities/movie.entity';
import { CreateMovieUseCase } from 'src/domain/usecases/createMovie.usecase';
import { UpdateMovieUseCase } from 'src/domain/usecases/updateMovie.usecase';

describe('UpdateMovieUseCase', () => {
  let updateMovieUseCase: UpdateMovieUseCase;
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
      providers: [UpdateMovieUseCase, CreateMovieUseCase, MovieService],
    }).compile();

    updateMovieUseCase = module.get<UpdateMovieUseCase>(UpdateMovieUseCase);
    createMovieUseCase = module.get<CreateMovieUseCase>(CreateMovieUseCase);
  });

  it('should update a movie', async () => {
    const movie = await createMovieUseCase.execute({
      year: 2022,
      title: 'Old Title',
      studios: 'Test Studios',
      producers: 'Test Producers',
      winner: false,
    });

    const updatedMovie = await updateMovieUseCase.execute(movie.id, {
      title: 'New Title',
    });

    expect(updatedMovie.title).toEqual('New Title');
  });

  it('should throw NotFoundException if movie does not exist', async () => {
    await expect(updateMovieUseCase.execute(999, {})).rejects.toThrow(
      NotFoundException,
    );
  });
});
