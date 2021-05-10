import { OmitType } from '@nestjs/mapped-types';
import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  isPositive,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreatePlateDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(400)
  description: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  ingredients: string[];

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  preparationTime: number;

  @IsUrl()
  @IsString()
  @IsNotEmpty()
  image: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  menuId: number;

  @IsNumber()
  @IsPositive()
  weight: number;
}

export class CreatePlateDtoMinimized extends OmitType(CreatePlateDto, [
  'menuId',
]) {}
