import { OmitType } from '@nestjs/mapped-types';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  ValidateIf,
} from 'class-validator';

export enum CampaingTriggered {
  MENU_SELECTED = 'MENU_SELECTED',
  PLATE_SELECTED = 'PLATE_SELECTED',
  CERTAIN_TIME = 'CERTAIN_TIME',
}

export class CreateCampaingDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(CampaingTriggered)
  @IsString()
  @IsNotEmpty()
  willTriggeredWhen: CampaingTriggered;

  @ValidateIf((obj) => obj.willTriggeredWhen === CampaingTriggered.CERTAIN_TIME)
  @IsNumber()
  @IsPositive()
  startsAfterSeconds?: number;

  @ValidateIf(
    (obj) => obj.willTriggeredWhen === CampaingTriggered.MENU_SELECTED,
  )
  @IsNumber()
  @IsPositive()
  startsWhenSelectedMenu?: number;

  @ValidateIf(
    (obj) => obj.willTriggeredWhen === CampaingTriggered.PLATE_SELECTED,
  )
  @IsNumber()
  @IsPositive()
  startsWhenSelectedPlate?: number;

  @IsString()
  @IsUrl()
  @IsNotEmpty()
  banner: string;

  @IsString()
  @IsUrl()
  @IsNotEmpty()
  content: string;

  @IsBoolean()
  publish: boolean;
}

export class CreateCampaingWithRelationDto extends OmitType(CreateCampaingDto, [
  'startsAfterSeconds',
  'startsWhenSelectedMenu',
  'startsWhenSelectedPlate',
]) {}

export class CreateCampaingWithoutRelationDto extends OmitType(
  CreateCampaingDto,
  ['startsWhenSelectedMenu', 'startsWhenSelectedPlate', 'startsAfterSeconds'],
) {}
