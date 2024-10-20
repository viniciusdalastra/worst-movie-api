import { Injectable } from '@nestjs/common';
import { Movie } from '../entities/movie.entity';
import { MovieService } from 'src/application/services/movie.service';
import { AwardIntervalsResponseDTO } from '../dtos/awardIntervalResponse.dto';

@Injectable()
export class GetMovieAwardIntervalUseCase {
  constructor(private readonly movieService: MovieService) {}

  async execute(): Promise<AwardIntervalsResponseDTO> {
    const movies = await this.movieService.findAll();
    const intervals = this.calculateIntervals(movies);
    const min = this.getMinInterval(intervals);
    const max = this.getMaxInterval(intervals);
    return { min, max };
  }

  private calculateIntervals(movies: Movie[]): any[] {
    const awardIntervals: {
      award: string;
      interval: number;
      previousWin: number;
      followingWin: number;
    }[] = [];

    const groupedProducers = movies.reduce(
      (acc, movie) => {
        const producerName = movie.producers;
        if (!acc[producerName]) {
          acc[producerName] = [];
        }
        acc[producerName].push(movie);
        return acc;
      },
      {} as Record<string, Movie[]>,
    );

    for (const producerName in groupedProducers) {
      const movieWins = groupedProducers[producerName].sort(
        (a, b) => a.year - b.year,
      );

      for (let i = 1; i < movieWins.length; i++) {
        const previousWin = movieWins[i - 1].year;
        const followingWin = movieWins[i].year;
        const interval = followingWin - previousWin;

        awardIntervals.push({
          award: producerName,
          interval,
          previousWin,
          followingWin,
        });
      }
    }

    return awardIntervals;
  }

  private getMinInterval(awardIntervals: any[]): any[] {
    const minInterval = Math.min(...awardIntervals.map((p) => p.interval));
    return awardIntervals.filter((p) => p.interval === minInterval);
  }

  private getMaxInterval(awardIntervals: any[]): any[] {
    const maxInterval = Math.max(...awardIntervals.map((p) => p.interval));
    return awardIntervals.filter((p) => p.interval === maxInterval);
  }
}
