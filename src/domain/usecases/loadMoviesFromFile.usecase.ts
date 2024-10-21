import { Injectable } from '@nestjs/common';
import * as csv from 'csv-parser';
import * as fs from 'fs';
import { Movie } from '../entities/movie.entity';
import { CreateMovieUseCase } from './createMovie.usecase';

@Injectable()
export class LoadMoviesFromFileUseCase {
  constructor(private readonly createMovieUseCase: CreateMovieUseCase) {}

  async execute(csvFilePath = 'movielist.csv'): Promise<any> {
    const rows: any[] = [];
    let isValidFile = true;

    return new Promise((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(csv({ separator: ';' }))
        .on('data', (row) => {
          if (!this.isValidRow(row)) {
            isValidFile = false;
          }
          rows.push(row);
        })
        .on('end', async () => {
          if (isValidFile) {
            try {
              await this.createMovies(rows);
              resolve({
                success: true,
                message: 'Movies loaded successfully.',
              });
            } catch (error) {
              console.error('Error on saving movies:', error);
              reject({ success: false, message: 'Error while saving movies.' });
            }
          } else {
            console.error(
              'CSV file contains invalid data. No movies were saved.',
            );
            reject({
              success: false,
              message: 'CSV file contains invalid data.',
            });
          }
        })
        .on('error', (error) => {
          console.error('Error reading CSV file:', error);
          reject({ success: false, message: 'Error reading CSV file.' });
        });
    });
  }

  private async createMovies(rows: any[]) {
    for (const row of rows) {
      const year = parseInt(row.year, 10);
      if (year) {
        const movie = new Movie();
        movie.year = year;
        movie.title = row.title;
        movie.winner = row.winner === 'yes';
        movie.studios = row.studios
          .split(',')
          .flatMap((studio) => studio.split(' and ').map((s) => s.trim()));

        movie.producers = row.producers
          .split(',')
          .flatMap((producer) => producer.split(' and ').map((p) => p.trim()));

        await this.createMovieUseCase.execute(movie);
      }
    }
  }

  private isValidRow(row: any): boolean {
    const requiredFields = ['year', 'title', 'studios', 'producers'];

    for (const field of requiredFields) {
      if (!row[field] || row[field].length < 1) {
        console.error(`Missing field ${field} in row: ${JSON.stringify(row)}`);
        return false;
      }
    }

    const year = parseInt(row.year, 10);
    if (isNaN(year) || year <= 0) {
      console.error(`Invalid year in row: ${JSON.stringify(row)}`);
      return false;
    }

    const validWinnerValues = ['yes', 'no'];
    if (row.winner && !validWinnerValues.includes(row.winner.toLowerCase())) {
      console.error(`Invalid winner value in row: ${JSON.stringify(row)}`);
      return false;
    }

    return true;
  }
}
