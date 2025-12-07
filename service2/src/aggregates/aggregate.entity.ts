
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Aggregate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'device_id' })
  deviceId: string;

  @Column('float', { name: 'avg_value' })
  avgValue: number;

  @Column({ name: 'from_ts', type: 'timestamptz', nullable: true })
  from: Date | null;

  @Column({ name: 'to_ts', type: 'timestamptz', nullable: true })
  to: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
