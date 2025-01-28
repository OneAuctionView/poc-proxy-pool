import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proxy } from './proxy.entity';
import { ProxyService } from './proxy.service';
import { ProxyController } from './proxy.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Proxy])],
  providers: [ProxyService],
  controllers: [ProxyController],
})
export class ProxyModule {}
