import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Table } from 'src/modules/table/entities/table.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GetTablesCreated {
  constructor(
    @InjectRepository(Table)
    private readonly tableCreated: Repository<Table>,
  ) {}

  async execute(owner: User): Promise<number> {
    return await this.tableCreated
      .createQueryBuilder('table')
      .leftJoin('table.restaurant', 'restaurant')
      .leftJoin('restaurant.owner', 'owner')
      .where('owner.id = :ownerId', { ownerId: owner.id })
      .getCount();
  }
}
