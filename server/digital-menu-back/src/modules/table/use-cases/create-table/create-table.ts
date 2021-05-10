import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetOrder } from 'src/modules/order/use-cases/get-order/get-order';
import { GetRestaurant } from 'src/modules/restaurant/use-cases/get-restaurant/get-restaurant';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Table } from '../../entities/table.entity';
import { CreateTableDto } from './create-table.dto';

@Injectable()
export class CreateTable {
  constructor(
    @InjectRepository(Table)
    private readonly tableRepository: Repository<Table>,
    private readonly getRestaurant: GetRestaurant,
  ) {}

  async execute(dto: CreateTableDto, owner: User): Promise<Table> {
    const restaurant = await this.getRestaurant.byOwner(owner);
    const table = this.tableRepository.create(dto);
    table.securityPassword = dto.securityPassword;
    table.securityPasswordHashed = dto.securityPassword;
    table.restaurant = restaurant;
    const tableStored = await this.tableRepository.save(table);
    delete tableStored.restaurant;
    delete tableStored.securityPassword;
    delete tableStored.securityPasswordHashed;
    return tableStored;
  }
}
