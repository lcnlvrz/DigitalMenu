import { IsNumber, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsNumber()
  stars: number;

  @IsString()
  comment: string;
}
