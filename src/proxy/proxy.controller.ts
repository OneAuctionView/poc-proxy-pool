import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { ProxyService } from './proxy.service';
import { Proxy } from './proxy.entity';

@Controller('proxies')
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @Post()
  async addProxy(@Body('proxyAddress') proxyAddress: string): Promise<Proxy> {
    return this.proxyService.addProxy(proxyAddress);
  }

  @Get('healthy')
  async getHealthyProxy(): Promise<Proxy> {
    const proxy = await this.proxyService.getHealthyProxy();
    if (!proxy) throw new Error('No healthy proxies available');
    return proxy;
  }

  @Post('check/:id')
  async checkProxyHealth(@Param('id') id: number): Promise<Proxy> {
    return this.proxyService.checkProxyHealth(id);
  }
}
