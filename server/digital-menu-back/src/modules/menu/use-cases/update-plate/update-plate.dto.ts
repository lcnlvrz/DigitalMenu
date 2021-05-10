import { PartialType, IntersectionType } from '@nestjs/mapped-types';
import { ArrayNotEmpty, IsArray, IsNumber } from 'class-validator';
import { Repository } from 'typeorm';
import { CreatePlateDto } from '../create-plate/create-plate.dto';

export class PlateIdArray {
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  platesIds: number[];
}

export class PlatePartialDto extends PartialType(CreatePlateDto) {}

export class UpdatePlateDto extends IntersectionType(
  PlateIdArray,
  PlatePartialDto,
) {}
