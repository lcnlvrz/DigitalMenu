import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Table } from '../../entities/table.entity';
import { GetTable } from '../get-table/get-table';

@Injectable()
export class RemoveTable {
  constructor(
    @InjectRepository(Table)
    private readonly tableRepository: Repository<Table>,
    private readonly getTable: GetTable,
  ) {}

  async execute(owner: User, tableId: number): Promise<Table> {
    const table = await this.getTable.oneByOwnerAndId(owner, tableId);
    const tableRemoved = await this.tableRepository.remove(table);
    delete tableRemoved.securityPassword;
    return tableRemoved;
  }
}
