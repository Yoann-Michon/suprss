import { UserRole } from '@guards/roles_guard/role.enum';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { Setting } from './Setting.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  firstname: string;

  @Column({ nullable: false })
  lastname: string;

  @Column({ nullable: true })
  username?: string;

  @Column({ nullable: false })
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER, nullable: false })
  role: UserRole;

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