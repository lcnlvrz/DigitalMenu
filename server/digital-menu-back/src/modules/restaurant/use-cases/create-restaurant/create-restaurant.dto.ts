import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
  Validate,
  ValidateNested,
} from 'class-validator';
import { DaysOfTheWeek } from '../../days.week';
import { ValidateValuesNotRepeatedSchedule } from './validate-values-not-repeated-schedule';

export class ScheduleDto {
  @IsEnum(DaysOfTheWeek)
  @IsString()
  @IsNotEmpty()
  day: DaysOfTheWeek;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  hour: [string, string];
}

export class CreateRestaurantDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(50)
  @MaxLength(1000)
  description: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsArray()
  @ValidateNested()
  @ArrayMinSize(1)
  @Type(() => ScheduleDto)
  @Validate(ValidateValuesNotRepeatedSchedule, {
    message: 'You have days of the week repeated',
  })
  schedule: ScheduleDto[];

  @IsNumberString()
  cellphone: string;

  @IsString()
  @IsOptional()
  bannerPhoto: string;

  @IsString()
  @IsOptional()
  profilePhoto: string;

  @IsBoolean()
  hasOtherPaymentMethod: boolean;

  @IsBoolean()
  hasTableOrderingSystem: boolean;

  @IsBoolean()
  isDelivery: boolean;
}
