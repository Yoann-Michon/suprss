import { Column, Entity, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Setting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'en' })
  language: string;

  @Column({ default: "dark" })
  darkMode: string;

  @OneToOne(() => User, (user) => user.setting, { onDelete: 'CASCADE' })
  user: User;
}