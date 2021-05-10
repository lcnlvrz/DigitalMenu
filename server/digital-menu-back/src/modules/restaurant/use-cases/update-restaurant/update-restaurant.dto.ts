import { PartialType } from '@nestjs/mapped-types';
import { CreateRestaurantDto } from '../create-restaurant/create-restaurant.dto';

export class UpdateRestaurantDto extends PartialType(CreateRestaurantDto) {}
