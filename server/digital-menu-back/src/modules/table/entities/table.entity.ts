import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { hash } from 'bcrypt';
import { Restaurant } from 'src/modules/restaurant/entities/restaurant.entity';

@Entity()
export class Table {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  securityPasswordHashed: string;

  @Column()
  securityPassword: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.tables, {
    onDelete: 'CASCADE',
  })
  restaurant: Restaurant;

  @BeforeUpdate()
  @BeforeInsert()
  async execute() {
    if (this.securityPasswordHashed) {
      this.securityPasswordHashed = await hash(this.securityPasswordHashed, 15);
    } else {
      return;
    }
  }
}
