import { Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { Table } from '../../entities/table.entity';

@Injectable()
export class ValidateTable {
  async execute(table: Table, securityPassword: string): Promise<boolean> {
    return await compare(securityPassword, table.securityPasswordHashed);
  }
}
