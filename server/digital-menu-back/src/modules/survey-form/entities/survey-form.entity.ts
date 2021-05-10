import { Restaurant } from 'src/modules/restaurant/entities/restaurant.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { Question } from './question.entity';
import { SurveyFormResponse } from './survey-form-response.entity';

@Entity()
export class SurveyForm {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  header: string;

  @Column({ default: true })
  isPublic: boolean;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.surveyForms)
  restaurant: Restaurant;

  @OneToMany(() => Question, (question) => question.surveyForm)
  questions: Question[];

  @OneToMany(
    () => SurveyFormResponse,
    (surveyFormResponse) => surveyFormResponse.surveyForm,
  )
  responses: SurveyFormResponse[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
