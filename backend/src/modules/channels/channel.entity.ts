import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from '../categories/category.entity';

@Entity('channels')
export class Channel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  originalName: string;

  @Column({ nullable: true })
  logoUrl: string;

  @Column({ nullable: true })
  streamUrl: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  language: string;

  @Column({ type: 'int', nullable: true })
  ageRating: number;

  @Column({ type: 'boolean', default: true })
  isAdult: boolean;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ type: 'float', nullable: true })
  qualityScore: number;

  @ManyToOne(() => Category, { eager: true, nullable: true })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column()
  categoryId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
