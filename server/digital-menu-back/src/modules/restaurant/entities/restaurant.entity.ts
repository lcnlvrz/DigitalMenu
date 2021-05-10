import { Campaing } from 'src/modules/campaing/entities/campaing.entity';
import { Menu } from 'src/modules/menu/entities/menu.entity';
import { Order } from 'src/modules/order/entities/order.entity';
import { SurveyFormResponse } from 'src/modules/survey-form/entities/survey-form-response.entity';
import { SurveyForm } from 'src/modules/survey-form/entities/survey-form.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ScheduleDto } from '../use-cases/create-restaurant/create-restaurant.dto';
import { Review } from './review.entity';
import { Table } from '../../table/entities/table.entity';

@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  location: string;

  @Column({ type: 'simple-json' })
  schedule: ScheduleDto[];

  @Column()
  cellphone: string;

  @Column({ nullable: true })
  profilePhoto: string;

  @Column({ nullable: true })
  bannerPhoto: string;

  @Column()
  isDelivery: boolean;

  @Column()
  hasOtherPaymentMethod: boolean;

  @Column()
  hasTableOrderingSystem: boolean;

  @OneToOne(() => User)
  @JoinColumn()
  owner: User;

  @OneToMany(() => Menu, (menu) => menu.restaurant)
  menus: Menu[];

  @OneToMany(() => Order, (order) => order.restaurant)
  orders: Order[];

  @OneToMany(() => Review, (review) => review.restaurant)
  reviews: Review[];

  @OneToMany(() => SurveyForm, (surveyForm) => surveyForm.restaurant)
  surveyForms: SurveyForm[];

  @OneToMany(() => Campaing, (campaing) => campaing.restaurant)
  campaings: Campaing[];

  @OneToMany(() => Table, (table) => table.restaurant)
  tables: Table[];
}
