import { Campaing } from 'src/modules/campaing/entities/campaing.entity';
import { Restaurant } from 'src/modules/restaurant/entities/restaurant.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { Plate } from './plate.entity';

export enum MenuStatus {
  PUBLIC = 'PUBLIC',
  HIDDEN = 'HIDDEN',
}

@Entity()
export class Menu {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'enum', enum: MenuStatus, default: MenuStatus.PUBLIC })
  status: MenuStatus;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.menus, {
    onDelete: 'CASCADE',
  })
  restaurant: Restaurant;

  @OneToMany(() => Plate, (plate) => plate.menu)
  plates: Plate[];

  @OneToOne(() => Campaing, (campaing) => campaing.startsWhenSelectedMenu, {
    onDelete: 'CASCADE',
  })
  campaing: Campaing;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
