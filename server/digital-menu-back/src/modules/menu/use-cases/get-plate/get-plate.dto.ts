import { IsNumber, IsPositive } from 'class-validator';

export class GetPlateDto {
  @IsNumber()
  @IsPositive()
  plateId: number;
}
