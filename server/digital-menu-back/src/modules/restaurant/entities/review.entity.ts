import { Order } from 'src/modules/order/entities/order.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Restaurant } from './restaurant.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  stars: number;

  @OneToOne(() => Order)
  @JoinColumn()
  order: Order;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.reviews)
  restaurant: Restaurant;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  comment: string;
}
