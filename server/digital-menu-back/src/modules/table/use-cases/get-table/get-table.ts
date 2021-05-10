import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Table } from '../../entities/table.entity';

@Injectable()
export class GetTable {
  constructor(
    @InjectRepository(Table)
    private readonly tableRepository: Repository<Table>,
  ) {}

  async manyByOwner(owner: User): Promise<Table[]> {
    return await this.tableRepository
      .createQueryBuilder('table')
      .leftJoin('table.restaurant', 'restaurant')
      .leftJoin('restaurant.owner', 'owner')
      .where('owner.id = :ownerId', { ownerId: owner.id })
      .select(['table.name', 'table.id', 'table.createdAt', 'table.updatedAt'])
      .getMany();
  }

  async oneByOwnerAndId(owner: User, tableId: number): Promise<Table> {
    return await this.tableRepository
      .createQueryBuilder('table')
      .leftJoin('table.restaurant', 'restaurant')
      .leftJoin('restaurant.owner', 'owner')
      .where('owner.id = :ownerId', { ownerId: owner.id })
      .andWhere('table.id = :tableId', { tableId })
      .select(['table.name', 'table.id', 'table.createdAt', 'table.updatedAt'])
      .getOne();
  }

  async oneById(tableId: number): Promise<Table> {
    return await this.tableRepository
      .createQueryBuilder('table')
      .andWhere('table.id = :tableId', { tableId })
      .select([
        'table.name',
        'table.id',
        'table.createdAt',
        'table.updatedAt',
        'table.securityPassword',
        'table.securityPasswordHashed',
      ])
      .getOne();
  }
}
