import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { Setting } from './Setting.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: false, select: false })
  password: string;

  @Column({ nullable: false })
  role: string;

  @Column({ type: 'boolean', default: true })
  firstVisit: boolean;

  @Column({ type: 'varchar', nullable: true })
  avatarUrl?: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => Setting, (setting: Setting) => setting.user, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  setting?: Setting;
}