import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('import_jobs')
export class ImportJob {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  sourceType: 'M3U_URL' | 'M3U_FILE' | 'XTREAM' | 'JSON' | 'API';

  @Column()
  source: string;

  @Column({ type: 'int', default: 0 })
  totalChannels: number;

  @Column({ type: 'int', default: 0 })
  processedChannels: number;

  @Column({ type: 'varchar', default: 'PENDING' })
  status: string;

  @Column({ type: 'text', nullable: true })
  error: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
