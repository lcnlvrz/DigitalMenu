import { Menu } from 'src/modules/menu/entities/menu.entity';
import { Plate } from 'src/modules/menu/entities/plate.entity';
import { Restaurant } from 'src/modules/restaurant/entities/restaurant.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

export enum CampaingTriggered {
  MENU_SELECTED = 'MENU_SELECTED',
  PLATE_SELECTED = 'PLATE_SELECTED',
  CERTAIN_TIME = 'CERTAIN_TIME',
}

@Entity()
export class Campaing {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'enum', enum: CampaingTriggered })
  willTriggeredWhen: CampaingTriggered;

  @Column({ nullable: true })
  startsAfterSeconds: number;

  @Column()
  publish: boolean;

  @Column()
  banner: string;

  @Column()
  content: string;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.campaings)
  restaurant: Restaurant;

  @OneToOne(() => Menu, (menu) => menu.campaing, { onDelete: 'CASCADE' })
  @JoinColumn()
  startsWhenSelectedMenu: Menu;

  @OneToOne(() => Plate, (plate) => plate.campaing, { onDelete: 'CASCADE' })
  @JoinColumn()
  startsWhenSelectedPlate: Plate;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
