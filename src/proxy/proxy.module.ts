import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proxy } from './entities/proxy.entity';
import { TargetSite } from './entities/target.entity';
import { ProxyTargetStatus } from './entities/proxy-target-status.entity';
import { ProxyService } from './proxy.service';
import { ProxyController } from './proxy.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Proxy, TargetSite, ProxyTargetStatus]), // Register entities here
  ],
  providers: [ProxyService],
  controllers: [ProxyController],
})
export class ProxyModule {}
