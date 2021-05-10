import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Table } from '../../entities/table.entity';

@Injectable()
export class SendSecurityPasswords {
  constructor(
    @InjectRepository(Table)
    private readonly tableRepository: Repository<Table>,
    private readonly mailerService: MailerService,
  ) {}

  async execute(owner: User): Promise<any> {
    const table = await this.tableRepository
      .createQueryBuilder('table')
      .leftJoin('table.restaurant', 'restaurant')
      .leftJoin('restaurant.owner', 'owner')
      .where('owner.id = :ownerId', { ownerId: owner.id })
      .select(['table.securityPassword', 'table.name'])
      .getMany();

    if (!table.length) {
      throw new NotFoundException({
        code: 'not_found_passwords',
        detail: "You don't have any tables created.",
      });
    }

    return await this.mailerService.sendMail({
      to: owner.email,
      from: 'noreply@digital-menu.com',
      subject: 'Your tables security passwords',
      template: './security-passwords',
      context: {
        passwords: table,
        baseURL: process.env.APP_BASE_URL,
      },
    });
  }
}
