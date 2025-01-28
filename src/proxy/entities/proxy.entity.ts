import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ProxyTargetStatus } from './proxy-target-status.entity';

@Entity()
export class Proxy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  proxyAddress: string;

  @OneToMany(() => ProxyTargetStatus, (status) => status.proxy)
  targetStatuses: ProxyTargetStatus[];
}
