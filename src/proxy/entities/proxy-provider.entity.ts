import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Proxy } from './proxy.entity';

@Entity()
export class ProxyProvider {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => Proxy, (proxy) => proxy.provider)
  proxies: Proxy[];
}
