import { Order } from 'src/modules/order/entities/order.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SurveyFormResponse } from './survey-form-response.entity';
import { SurveyForm } from './survey-form.entity';

enum TypesQuestion {
  SMILEY = 'Smiley',
  RATING = 'Rating',
  TEXT = 'Text',
  YES_OR_NO = 'Yes/No',
}

@Entity()
export class Answer {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'enum', enum: TypesQuestion })
  type: TypesQuestion;

  @Column()
  value: string;

  @Column()
  question: string;

  @ManyToOne(() => Order, (order) => order.answers, { onDelete: 'CASCADE' })
  order: Order;

  @CreateDateColumn()
  createdAt: Date;
}
