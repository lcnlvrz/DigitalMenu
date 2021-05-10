import { PartialType } from '@nestjs/mapped-types';
import { CreateTableDto } from '../create-table/create-table.dto';

export class UpdateTableDto extends PartialType(CreateTableDto) {}
