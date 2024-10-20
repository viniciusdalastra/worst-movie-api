export class AwardInterval {
  award: string;
  interval: number;
  previousWin: number;
  followingWin: number;
}

export class AwardIntervalsResponseDTO {
  min: AwardInterval[];
  max: AwardInterval[];
}
