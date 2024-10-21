import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieService } from '../src/application/services/movie.service';
import { AwardIntervalsResponseDTO } from '../src/domain/dtos/awardIntervalResponse.dto';
import { Movie } from '../src/domain/entities/movie.entity';
import { CreateMovieUseCase } from '../src/domain/usecases/createMovie.usecase';
import { GetMovieAwardIntervalUseCase } from '../src/domain/usecases/getAwardMovieInterval.usecase';

describe('GetMovieAwardIntervalUseCase', () => {
  let getMovieAwardIntervalUseCase: GetMovieAwardIntervalUseCase;
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
      providers: [
        GetMovieAwardIntervalUseCase,
        CreateMovieUseCase,
        MovieService,
      ],
    }).compile();

    getMovieAwardIntervalUseCase = module.get<GetMovieAwardIntervalUseCase>(
      GetMovieAwardIntervalUseCase,
    );
    createMovieUseCase = module.get<CreateMovieUseCase>(CreateMovieUseCase);
  });

  it('should return min and max intervals', async () => {
    await createMovieUseCase.execute({
      year: 2015,
      title: 'Movie 1',
      studios: ['Studios A'],
      producers: ['Producers A'],
      winner: true,
    });
    await createMovieUseCase.execute({
      year: 2018,
      title: 'Movie 2',
      studios: ['Studios B'],
      producers: ['Producers A'],
      winner: true,
    });
    await createMovieUseCase.execute({
      year: 2020,
      title: 'Movie 3',
      studios: ['Studios A'],
      producers: ['Producers A'],
      winner: true,
    });

    const result: AwardIntervalsResponseDTO = await getMovieAwardIntervalUseCase.execute();

    expect(result.min).toHaveLength(1);
    expect(result.min[0].interval).toBe(2);
    expect(result.max).toHaveLength(1);
    expect(result.max[0].interval).toBe(3);
  });

  it('should return correct intervals for multiple producers', async () => {
    await createMovieUseCase.execute({
      year: 2010,
      title: 'Movie 1',
      studios: ['Studios A'],
      producers: ['Producers A'],
      winner: true,
    });
    await createMovieUseCase.execute({
      year: 2011,
      title: 'Movie 2',
      studios: ['Studios B'],
      producers: ['Producers A'],
      winner: true,
    });
    await createMovieUseCase.execute({
      year: 2015,
      title: 'Movie 3',
      studios: ['Studios C'],
      producers: ['Producers B'],
      winner: true,
    });
    await createMovieUseCase.execute({
      year: 2017,
      title: 'Movie 4',
      studios: ['Studios D'],
      producers: ['Producers B'],
      winner: true,
    });

    const result: AwardIntervalsResponseDTO = await getMovieAwardIntervalUseCase.execute();

    expect(result.min).toHaveLength(1);
    expect(result.min[0].interval).toBe(1);
    expect(result.max).toHaveLength(1);
    expect(result.max[0].interval).toBe(2);
  });

  it('should return empty min and max if no movies exist', async () => {
    const result: AwardIntervalsResponseDTO = await getMovieAwardIntervalUseCase.execute();

    expect(result.min).toHaveLength(0);
    expect(result.max).toHaveLength(0);
  });

  it('should not consider non-winning movies', async () => {
    await createMovieUseCase.execute({
      year: 2010,
      title: 'Winning Movie 1',
      studios: ['Studios A'],
      producers: ['Producers A'],
      winner: true,
    });
    await createMovieUseCase.execute({
      year: 2015,
      title: 'Winning Movie 2',
      studios: ['Studios B'],
      producers: ['Producers A'],
      winner: true,
    });

    await createMovieUseCase.execute({
      year: 2011,
      title: 'Non-winning Movie 1',
      studios: ['Studios C'],
      producers: ['Producers A'],
      winner: false,
    });
    await createMovieUseCase.execute({
      year: 2018,
      title: 'Non-winning Movie 2',
      studios: ['Studios D'],
      producers: ['Producers B'],
      winner: false,
    });

    const result: AwardIntervalsResponseDTO = await getMovieAwardIntervalUseCase.execute();

    expect(result.min).toHaveLength(1);
    expect(result.min[0].interval).toBe(5);
    expect(result.max).toHaveLength(1);
    expect(result.max[0].interval).toBe(5);
  });
});
