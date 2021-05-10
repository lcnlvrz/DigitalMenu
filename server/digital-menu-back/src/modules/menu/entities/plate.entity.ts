import { Campaing } from 'src/modules/campaing/entities/campaing.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { Menu } from './menu.entity';

export enum PlateStatus {
  PUBLIC = 'PUBLIC',
  HIDDEN = 'HIDDEN',
}

@Entity()
export class Plate {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'simple-array' })
  ingredients: string[];

  @Column()
  price: number;

  @Column()
  preparationTime: number;

  @Column({ type: 'enum', enum: PlateStatus, default: PlateStatus.PUBLIC })
  status: PlateStatus;

  @Column()
  image: string;

  @Column()
  weight: number;

  @Column({ default: 0 })
  views: number;

  @ManyToOne(() => Menu, (menu) => menu.plates, { onDelete: 'CASCADE' })
  menu: Menu;

  @OneToOne(() => Campaing, (campaing) => campaing.startsWhenSelectedPlate, {
    onDelete: 'CASCADE',
  })
  campaing: Campaing;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
