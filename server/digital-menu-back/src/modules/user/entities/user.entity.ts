import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { hash } from 'bcrypt';
import { UserRoles } from '../user.roles';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  password: string;

  @Column({ type: 'simple-array' })
  role: UserRoles[];

  @BeforeUpdate()
  @BeforeInsert()
  async hashPassword() {
    if (!this.password) {
      return;
    } else {
      this.password = await hash(this.password, 15);
    }
  }
}
