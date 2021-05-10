import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Menu } from '../../entities/menu.entity';
import { Plate } from '../../entities/plate.entity';
import { GetMenu } from '../get-menu/get-menu';
import { CreatePlateDto, CreatePlateDtoMinimized } from './create-plate.dto';

@Injectable()
export class CreatePlate {
  constructor(
    @InjectRepository(Plate)
    private readonly plateRepository: Repository<Plate>,
  ) {}

  async execute(dto: CreatePlateDtoMinimized, menu: Menu): Promise<Plate> {
    const plate = this.plateRepository.create(dto);
    plate.menu = menu;
    const plateStored = await this.plateRepository.save(plate);
    delete plateStored.menu;
    return plateStored;
  }
}
