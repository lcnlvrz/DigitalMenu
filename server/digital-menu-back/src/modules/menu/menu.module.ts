import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantModule } from '../restaurant/restaurant.module';
import { Menu } from './entities/menu.entity';
import { Plate } from './entities/plate.entity';
import { MenuController } from './menu.controller';
import { CreateMenu } from './use-cases/create-menu/create-menu';
import { CreatePlate } from './use-cases/create-plate/create-plate';
import { DeleteMenu } from './use-cases/remove-menu/remove.menu';
import { DeletePlate } from './use-cases/remove-plate/remove-plate';
import { GetMenu } from './use-cases/get-menu/get-menu';
import { GetPlate } from './use-cases/get-plate/get-plate';
import { UpdateMenu } from './use-cases/update-menu/update-menu';
import { UpdatePlate } from './use-cases/update-plate/update-plate';
import { UpdateViewsPlate } from './use-cases/update-views-plate/update-views-plate';
import { GetMenuPlatesLimit } from './use-cases/get-menu-plates-limit/get-menu-plates-limit';
import { GetMenuPagination } from './use-cases/get-menu-pagination/get-menu-pagination';
import { DuplicateMenu } from './use-cases/duplicate-menu/duplicate-menu';
import { DuplicatePlate } from './use-cases/duplicate-plate/duplicate-plate';

@Module({
  imports: [
    TypeOrmModule.forFeature([Menu, Plate]),
    forwardRef(() => RestaurantModule),
  ],
  providers: [
    CreateMenu,
    CreatePlate,
    GetMenu,
    GetPlate,
    UpdateMenu,
    UpdatePlate,
    DeleteMenu,
    DeletePlate,
    UpdateViewsPlate,
    GetMenuPlatesLimit,
    GetMenuPagination,
    DuplicateMenu,
    DuplicatePlate,
  ],
  controllers: [MenuController],
  exports: [GetPlate, GetMenu, GetMenuPlatesLimit],
})
export class MenuModule {}
