import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Menu } from '../../entities/menu.entity';
import { GetMenu } from '../get-menu/get-menu';
import { MenusIdsDto } from '../update-menu/update-menu.dto';

@Injectable()
export class DeleteMenu {
  constructor(
    private readonly getMenu: GetMenu,
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
  ) {}

  async execute(owner: User, dto: MenusIdsDto): Promise<void> {
    for (let i = 0; i < dto.menusIds.length; i++) {
      const menuId = dto.menusIds[i];
      const menu = await this.getMenu.oneByOwner(owner, menuId);
      await this.menuRepository.remove(menu);
    }
  }
}
