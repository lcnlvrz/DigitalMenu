import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu, MenuStatus } from 'src/modules/menu/entities/menu.entity';
import { Plate } from 'src/modules/menu/entities/plate.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GetMenuPlatesLimit {
  constructor(
    @InjectRepository(Plate)
    private readonly plateRepository: Repository<Plate>,
  ) {}

  async execute(menus: Menu[], limitOfPlates: number): Promise<Menu[]> {
    const plates = await Promise.all(
      menus.map(async (menu) => {
        return this.plateRepository
          .createQueryBuilder('plate')
          .leftJoin('plate.menu', 'menu')
          .where('menu.id = :menuId', { menuId: menu.id })
          .andWhere('plate.status = :public', { public: MenuStatus.PUBLIC })
          .limit(limitOfPlates)
          .getMany();
      }),
    );

    return menus.map((menu, index) => ({
      ...menu,
      plates: plates[index],
    }));
  }
}
