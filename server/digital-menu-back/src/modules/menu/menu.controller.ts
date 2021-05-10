import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ReqUser } from '../auth/decorators/req-user.decorator';
import { JwtStrategyGuard } from '../auth/guards/jwt-strategy.guard';
import { GetRestaurant } from '../restaurant/use-cases/get-restaurant/get-restaurant';
import { User } from '../user/entities/user.entity';
import { Menu, MenuStatus } from './entities/menu.entity';
import { Plate, PlateStatus } from './entities/plate.entity';
import { CreateMenu } from './use-cases/create-menu/create-menu';
import { CreateMenuDto } from './use-cases/create-menu/create-menu.dto';
import { CreatePlate } from './use-cases/create-plate/create-plate';
import { CreatePlateDto } from './use-cases/create-plate/create-plate.dto';
import { DuplicateMenu } from './use-cases/duplicate-menu/duplicate-menu';
import { DuplicatePlate } from './use-cases/duplicate-plate/duplicate-plate';
import { GetMenuPagination } from './use-cases/get-menu-pagination/get-menu-pagination';
import { GetMenu } from './use-cases/get-menu/get-menu';
import { GetPlate } from './use-cases/get-plate/get-plate';
import { DeleteMenu } from './use-cases/remove-menu/remove.menu';
import { DeletePlate } from './use-cases/remove-plate/remove-plate';
import { UpdateMenu } from './use-cases/update-menu/update-menu';
import {
  MenusIdsDto,
  UpdateMenuDto,
} from './use-cases/update-menu/update-menu.dto';
import { UpdatePlate } from './use-cases/update-plate/update-plate';
import {
  PlateIdArray,
  UpdatePlateDto,
} from './use-cases/update-plate/update-plate.dto';
import { UpdateViewsPlate } from './use-cases/update-views-plate/update-views-plate';

@Controller('menu')
export class MenuController {
  constructor(
    private readonly createMenu: CreateMenu,
    private readonly createPlate: CreatePlate,
    private readonly updatePlate: UpdatePlate,
    private readonly updateMenu: UpdateMenu,
    private readonly deletePlate: DeletePlate,
    private readonly deleteMenu: DeleteMenu,
    private readonly getMenu: GetMenu,
    private readonly getPlate: GetPlate,
    private readonly getRestaurant: GetRestaurant,
    private readonly updateViewsPlate: UpdateViewsPlate,
    private readonly getMenuPagination: GetMenuPagination,
    private readonly duplicateMenu: DuplicateMenu,
    private readonly duplicatePlate: DuplicatePlate,
  ) {}

  @UseGuards(JwtStrategyGuard)
  @Get('plate/query')
  async executeGetPlatesByTitle(
    @Query('menuId', ParseIntPipe) menuId: number,
    @Query('title') title: string,
    @Query('status') status: PlateStatus | string,
    @ReqUser() owner: User,
  ): Promise<Plate[]> {
    return await this.getPlate.manyByQuery(owner, menuId, title, status);
  }

  @UseGuards(JwtStrategyGuard)
  @Post('duplicate/:menuId')
  async executeDuplicateMenu(
    @ReqUser() owner: User,
    @Param('menuId', ParseIntPipe) menuId: number,
  ): Promise<Menu> {
    return await this.duplicateMenu.execute(menuId, owner);
  }

  @UseGuards(JwtStrategyGuard)
  @Post('plate/duplicate/:plateId')
  async executeDuplicatePlate(
    @ReqUser() owner: User,
    @Param('plateId', ParseIntPipe) plateId: number,
  ): Promise<Plate> {
    return await this.duplicatePlate.execute(owner, plateId);
  }

  @UseGuards(JwtStrategyGuard)
  @Get('pagination')
  async executeGetManyMenusByName(
    @ReqUser() owner: User,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('search') search: string,
    @Query('status') status: MenuStatus | string,
  ): Promise<Pagination<Menu>> {
    return await this.getMenuPagination.execute(
      owner,
      search,
      limit,
      page,
      status,
    );
  }

  @Get('id/:menuId')
  async executeGetMenuById(
    @Param('menuId', ParseIntPipe) menuId: number,
  ): Promise<Menu> {
    return await this.getMenu.oneById(menuId);
  }

  @UseGuards(JwtStrategyGuard)
  @Get('/plate/:plateName')
  async executeGetManyPlatesByName(
    @ReqUser() owner: User,
    @Param('plateName') plateName: string,
  ): Promise<Plate[]> {
    return await this.getPlate.manyByNameAndOwner(owner, plateName);
  }

  @UseGuards(JwtStrategyGuard)
  @Get()
  async executeGetManyMenus(@ReqUser() owner: User): Promise<Menu[]> {
    return await this.getMenu.manyByOwner(owner);
  }

  @UseGuards(JwtStrategyGuard)
  @Post()
  async executeCreateRestaurant(
    @ReqUser() owner: User,
    @Body() dto: CreateMenuDto,
  ) {
    const restaurant = await this.getRestaurant.byOwner(owner);
    return await this.createMenu.execute(dto, restaurant);
  }

  @UseGuards(JwtStrategyGuard)
  @Put()
  async executeUpdateMenu(@ReqUser() owner: User, @Body() dto: UpdateMenuDto) {
    return await this.updateMenu.execute(dto, owner);
  }

  @UseGuards(JwtStrategyGuard)
  @Delete()
  async executeDeleteMenu(@ReqUser() owner: User, @Body() dto: MenusIdsDto) {
    return await this.deleteMenu.execute(owner, dto);
  }

  @UseGuards(JwtStrategyGuard)
  @Post('plate')
  async executeCreatePlate(
    @ReqUser() owner: User,
    @Body() dto: CreatePlateDto,
  ): Promise<Plate> {
    const menu = await this.getMenu.oneByOwner(owner, dto.menuId);
    if (!menu) {
      throw new NotFoundException({
        code: 'not_found_menu',
        detail: "The menu doesn't exist",
      });
    }
    return await this.createPlate.execute(dto, menu);
  }

  @UseGuards(JwtStrategyGuard)
  @Put('plate')
  async executeUpdatePlate(
    @ReqUser() owner: User,
    @Body() dto: UpdatePlateDto,
  ) {
    return await this.updatePlate.execute(owner, dto);
  }

  @UseGuards(JwtStrategyGuard)
  @Delete('plate')
  async executeDeletePlate(@ReqUser() owner: User, @Body() dto: PlateIdArray) {
    return await this.deletePlate.execute(owner, dto);
  }

  @Get('plate/views/:plateId')
  async executeUpdateViewsPlate(
    @Param('plateId', ParseIntPipe) plateId: number,
  ): Promise<Plate> {
    return await this.updateViewsPlate.execute(plateId);
  }
}
