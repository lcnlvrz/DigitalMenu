import { PartialType, IntersectionType } from '@nestjs/mapped-types';
import { ArrayNotEmpty, IsArray, IsNumber } from 'class-validator';
import { CreateMenuDto } from '../create-menu/create-menu.dto';

export class MenuPartialDto extends PartialType(CreateMenuDto) {}

export class MenusIdsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  menusIds: number[];
}

export class UpdateMenuDto extends IntersectionType(
  MenuPartialDto,
  MenusIdsDto,
) {}
