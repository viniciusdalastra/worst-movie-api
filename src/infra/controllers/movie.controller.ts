import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateMovieDto } from 'src/domain/dtos/createMovie.dto';
import { UpdateMovieDto } from 'src/domain/dtos/updateMovie.dto';
import { Movie } from 'src/domain/entities/movie.entity';
import { CreateMovieUseCase } from 'src/domain/usecases/createMovie.usecase';
import { DeleteMovieUseCase } from 'src/domain/usecases/deleteMovie.usecase';
import { FindAllMoviesUseCase } from 'src/domain/usecases/findAllMovies.usecase';
import { FindMovieUseCase } from 'src/domain/usecases/findMovie.usecase';
import { GetMovieAwardIntervalUseCase } from 'src/domain/usecases/getAwardMovieInterval.usecase';
import { UpdateMovieUseCase } from 'src/domain/usecases/updateMovie.usecase';

@ApiTags('Movie')
@Controller('movie')
export class MovieController {
  constructor(
    private getMovieAwardIntervalUseCase: GetMovieAwardIntervalUseCase,
    private readonly createMovieUseCase: CreateMovieUseCase,
    private readonly findAllMoviesUseCase: FindAllMoviesUseCase,
    private readonly findMovieUseCase: FindMovieUseCase,
    private readonly updateMovieUseCase: UpdateMovieUseCase,
    private readonly deleteMovieUseCase: DeleteMovieUseCase,
  ) {}

  @Get('award-interval')
  @ApiResponse({ status: 200, description: 'Intervals of awards' })
  async getAwardIntervals() {
    return this.getMovieAwardIntervalUseCase.execute();
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'The movie has been successfully created.',
    type: Movie,
  })
  async create(@Body() movie: CreateMovieDto): Promise<Movie> {
    return this.createMovieUseCase.execute(movie);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Retrieved all movies.',
    type: [Movie],
  })
  async findAll(): Promise<Movie[]> {
    return this.findAllMoviesUseCase.execute();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Retrieved a movie by ID.',
    type: Movie,
  })
  @ApiResponse({ status: 404, description: 'Movie not found.' })
  async findOne(@Param('id') id: number): Promise<Movie> {
    return this.findMovieUseCase.execute(id);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'The movie has been successfully updated.',
    type: Movie,
  })
  @ApiResponse({ status: 404, description: 'Movie not found.' })
  async update(
    @Param('id') id: number,
    @Body() movie: UpdateMovieDto,
  ): Promise<Movie> {
    return this.updateMovieUseCase.execute(id, movie);
  }

  @Delete(':id')
  @ApiResponse({
    status: 204,
    description: 'The movie has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Movie not found.' })
  async remove(@Param('id') id: number): Promise<void> {
    return this.deleteMovieUseCase.execute(id);
  }
}
