import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ProxyTargetStatus } from './proxy-target-status.entity';

@Entity()
export class TargetSite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  healthCheckUrl: string;

  @OneToMany(() => ProxyTargetStatus, (status) => status.targetSite)
  proxyStatuses: ProxyTargetStatus[];
}
