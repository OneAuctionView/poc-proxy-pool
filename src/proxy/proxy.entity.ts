import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Proxy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  proxyAddress: string;

  @Column({ type: 'datetime', nullable: true })
  lastChecked: Date;

  @Column({ default: 'unhealthy' })
  status: string;

  @Column({ type: 'float', nullable: true })
  latency: number | null;
}
