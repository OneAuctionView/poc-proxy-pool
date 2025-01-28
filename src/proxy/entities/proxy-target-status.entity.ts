import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Proxy } from './proxy.entity';
import { TargetSite } from './target.entity';

@Entity()
export class ProxyTargetStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Proxy, (proxy) => proxy.targetStatuses, {
    onDelete: 'CASCADE',
  })
  proxy: Proxy;

  @ManyToOne(() => TargetSite, (target) => target.proxyStatuses, {
    onDelete: 'CASCADE',
  })
  targetSite: TargetSite;

  @Column({ default: 'unhealthy' })
  status: string;

  @Column({ type: 'float', nullable: true })
  latency: number | null;

  @Column({ type: 'datetime', nullable: true })
  lastChecked: Date;
}
