import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ImportJob } from './import-job.entity';

@Entity('ai_classifications')
export class AiClassification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  channelId: string;

  @ManyToOne(() => ImportJob, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'importJobId' })
  importJob: ImportJob;

  @Column()
  importJobId: string;

  @Column({ nullable: true })
  detectedCategory: string;

  @Column({ nullable: true })
  detectedCountry: string;

  @Column({ nullable: true })
  detectedLanguage: string;

  @Column({ type: 'int', nullable: true })
  detectedAgeRating: number;

  @Column({ type: 'boolean', default: false })
  isAdult: boolean;

  @Column({ type: 'boolean', default: false })
  isDuplicate: boolean;

  @Column({ type: 'jsonb', nullable: true })
  reasoning: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}
