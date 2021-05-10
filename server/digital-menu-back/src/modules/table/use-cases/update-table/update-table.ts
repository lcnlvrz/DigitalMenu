import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Table } from '../../entities/table.entity';
import { GetTable } from '../get-table/get-table';
import { UpdateTableDto } from './update-table.dto';

@Injectable()
export class UpdateTable {
  constructor(
    @InjectRepository(Table)
    private readonly tableRepository: Repository<Table>,
    private readonly getTable: GetTable,
  ) {}

  async execute(
    dto: UpdateTableDto,
    owner: User,
    tableId: number,
  ): Promise<Table> {
    const table = await this.getTable.oneByOwnerAndId(owner, tableId);
    const dtoWithPasswords = {
      ...dto,
      securityPassword: dto.securityPassword,
      securityPasswordHashed: dto.securityPassword,
    };
    const tableMerged = this.tableRepository.merge(table, dtoWithPasswords);
    const tableUpdated = await this.tableRepository.save(tableMerged);
    delete tableUpdated.securityPassword;
    delete tableUpdated.securityPasswordHashed;
    return tableUpdated;
  }
}
