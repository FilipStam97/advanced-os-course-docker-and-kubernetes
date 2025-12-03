
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Measurement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'device_id' })
  deviceId: string;

  @Column('float')
  value: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt : Date;
}
