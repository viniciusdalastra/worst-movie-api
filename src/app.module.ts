import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieController } from './infra/controllers/movie.controller';
import { MovieService } from './application/services/movie.service';
import { Movie } from './domain/entities/movie.entity';
import { GetMovieAwardIntervalUseCase } from './domain/usecases/getAwardMovieInterval.usecase';
import { CreateMovieUseCase } from './domain/usecases/createMovie.usecase';
import { DeleteMovieUseCase } from './domain/usecases/deleteMovie.usecase';
import { FindAllMoviesUseCase } from './domain/usecases/findAllMovies.usecase';
import { FindMovieUseCase } from './domain/usecases/findMovie.usecase';
import { UpdateMovieUseCase } from './domain/usecases/updateMovie.usecase';
import * as fs from 'fs';
import * as csv from 'csv-parser';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      entities: [Movie],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Movie]),
  ],
  controllers: [MovieController],
  providers: [
    MovieService,
    GetMovieAwardIntervalUseCase,
    CreateMovieUseCase,
    FindAllMoviesUseCase,
    FindMovieUseCase,
    UpdateMovieUseCase,
    DeleteMovieUseCase,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly createMovieUseCase: CreateMovieUseCase) {}

  async onModuleInit() {
    const movies: Movie[] = [];
    const csvFilePath = 'movielist.csv';

    fs.createReadStream(csvFilePath)
      .pipe(csv({ separator: ';' }))
      .on('data', (row) => {
        if (row) {
          const year = parseInt(row.year, 10);
          if (year) {
            const movie = new Movie();
            movie.year = year;
            movie.title = row.title;
            movie.studios = row.studios;
            movie.producers = row.producers;
            movie.winner = row.winner === 'yes';

            try {
              this.createMovieUseCase.execute(movie);
            } catch (error) {
              console.error('Error on save award:', error);
            }
          }
        } else {
          console.error(`Invalid row: ${JSON.stringify(row)}`);
        }
      });
  }
}
