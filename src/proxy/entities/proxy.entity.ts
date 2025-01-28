import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ProxyTargetStatus } from './proxy-target-status.entity';
import { ProxyProvider } from './proxy-provider.entity';

@Entity()
export class Proxy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  proxyAddress: string;

  @OneToMany(() => ProxyTargetStatus, (status) => status.proxy)
  targetStatuses: ProxyTargetStatus[];

  @ManyToOne(() => ProxyProvider, (provider) => provider.proxies, {
    nullable: true,
  })
  provider: ProxyProvider;
}
