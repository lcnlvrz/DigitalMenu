import { Order } from 'src/modules/order/entities/order.entity';
import { Restaurant } from 'src/modules/restaurant/entities/restaurant.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { AnswerDto } from '../use-cases/create-survey-form-response/create-survey-form-response.dto';
import { Answer } from './answer.entity';
import { SurveyForm } from './survey-form.entity';

export enum SurveyFormResponseStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

@Entity()
export class SurveyFormResponse {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'enum',
    enum: SurveyFormResponseStatus,
    default: SurveyFormResponseStatus.OPEN,
  })
  status: SurveyFormResponseStatus;

  @ManyToOne(() => SurveyForm, (surveyForm) => surveyForm.responses)
  surveyForm: SurveyForm;

  @OneToOne(() => Order, (order) => order.surveyFormResponse)
  @JoinColumn()
  order: Order;

  @ManyToMany(() => Answer)
  @JoinTable()
  answers: Answer[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
