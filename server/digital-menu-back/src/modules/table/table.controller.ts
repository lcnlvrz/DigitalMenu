import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ReqUser } from '../auth/decorators/req-user.decorator';
import { JwtStrategyGuard } from '../auth/guards/jwt-strategy.guard';
import { User } from '../user/entities/user.entity';
import { Table } from './entities/table.entity';
import { CreateTable } from './use-cases/create-table/create-table';
import { CreateTableDto } from './use-cases/create-table/create-table.dto';
import { GetTable } from './use-cases/get-table/get-table';
import { RemoveTable } from './use-cases/remove-table/remove-table';
import { SendSecurityPasswords } from './use-cases/send-security-passwords/send-security-passwords';
import { UpdateTable } from './use-cases/update-table/update-table';
import { UpdateTableDto } from './use-cases/update-table/update-table.dto';

@Controller('table')
export class TableController {
  constructor(
    private readonly createTable: CreateTable,
    private readonly getTable: GetTable,
    private readonly updateTable: UpdateTable,
    private readonly removeTable: RemoveTable,
    private readonly sendSecurityPasswords: SendSecurityPasswords,
  ) {}

  @UseGuards(JwtStrategyGuard)
  @Get('security-passwords')
  async executeSendSecurityPasswords(@ReqUser() owner: User): Promise<any> {
    return await this.sendSecurityPasswords.execute(owner);
  }

  @UseGuards(JwtStrategyGuard)
  @Post()
  async executeCreateTable(
    @ReqUser() owner: User,
    @Body() dto: CreateTableDto,
  ): Promise<Table> {
    return await this.createTable.execute(dto, owner);
  }

  @UseGuards(JwtStrategyGuard)
  @Get()
  async executeGetTable(@ReqUser() owner: User): Promise<Table[]> {
    return await this.getTable.manyByOwner(owner);
  }

  @UseGuards(JwtStrategyGuard)
  @Put(':tableId')
  async executeUpdateTable(
    @ReqUser() owner: User,
    @Body() dto: UpdateTableDto,
    @Param('tableId', ParseIntPipe) tableId: number,
  ): Promise<Table> {
    return await this.updateTable.execute(dto, owner, tableId);
  }

  @UseGuards(JwtStrategyGuard)
  @Delete(':tableId')
  async executeRemoveTable(
    @ReqUser() owner: User,
    @Param('tableId', ParseIntPipe) tableId: number,
  ): Promise<Table> {
    return await this.removeTable.execute(owner, tableId);
  }
}
