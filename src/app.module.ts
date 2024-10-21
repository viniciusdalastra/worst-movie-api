import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieService } from './application/services/movie.service';
import { Movie } from './domain/entities/movie.entity';
import { CreateMovieUseCase } from './domain/usecases/createMovie.usecase';
import { DeleteMovieUseCase } from './domain/usecases/deleteMovie.usecase';
import { FindAllMoviesUseCase } from './domain/usecases/findAllMovies.usecase';
import { FindMovieUseCase } from './domain/usecases/findMovie.usecase';
import { GetMovieAwardIntervalUseCase } from './domain/usecases/getAwardMovieInterval.usecase';
import { LoadMoviesFromFileUseCase } from './domain/usecases/loadMoviesFromFile.usecase';
import { UpdateMovieUseCase } from './domain/usecases/updateMovie.usecase';
import { MovieController } from './infra/controllers/movie.controller';
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
    LoadMoviesFromFileUseCase
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly loadMoviesFromFileUseCase: LoadMoviesFromFileUseCase) { }

  async onModuleInit() {
    try {
      const result = await this.loadMoviesFromFileUseCase.execute();
      console.log(result?.message)
    } catch (error) {
      console.error('Failed to load movies:', error);
    }
  }

}
