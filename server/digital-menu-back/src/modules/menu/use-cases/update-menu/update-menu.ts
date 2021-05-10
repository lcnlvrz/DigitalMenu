import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Menu } from '../../entities/menu.entity';
import { MenuController } from '../../menu.controller';
import { GetMenu } from '../get-menu/get-menu';
import { UpdateMenuDto } from './update-menu.dto';

@Injectable()
export class UpdateMenu {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
    private readonly getMenu: GetMenu,
  ) {}

  async execute(dto: UpdateMenuDto, owner: User): Promise<void> {
    const { menusIds, ...data } = dto;
    for (let i = 0; i < menusIds.length; i++) {
      const menuId = menusIds[i];
      const menu = await this.getMenu.oneByOwner(owner, menuId);
      const menuUpdated = this.menuRepository.merge(menu, data);
      await this.menuRepository.save(menuUpdated);
    }
  }
}
