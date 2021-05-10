import { Restaurant } from 'src/modules/restaurant/entities/restaurant.entity';
import { Review } from 'src/modules/restaurant/entities/review.entity';
import { Answer } from 'src/modules/survey-form/entities/answer.entity';
import { SurveyFormResponse } from 'src/modules/survey-form/entities/survey-form-response.entity';
import { Table } from 'src/modules/table/entities/table.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import {
  PaymentMethod,
  OrderStatus,
} from '../use-cases/create-order/create-order.dto';

export interface PlateInOrderDto {
  title: string;
  quantity: number;
  subtotal: number;
  weight: number;
}

export interface TableMinimized {
  name: string;
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  tableName: string;

  @Column({ type: 'enum', enum: PaymentMethod })
  paymentMethod: PaymentMethod;

  @Column()
  total: number;

  @Column({ nullable: true })
  clarifications: string;

  @Column({ type: 'simple-json' })
  plates: PlateInOrderDto[];

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.IN_QUEUE })
  status: OrderStatus;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.orders)
  restaurant: Restaurant;

  @OneToMany(() => Answer, (answer) => answer.order)
  answers: Answer[];

  @OneToOne(() => Review, (review) => review.order)
  review: Review;

  @OneToOne(
    () => SurveyFormResponse,
    (surveyFormResponse) => surveyFormResponse.order,
  )
  surveyFormResponse: SurveyFormResponse;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
