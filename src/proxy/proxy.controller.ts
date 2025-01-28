import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { ProxyService } from './proxy.service';

@Controller('proxies')
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @Post()
  async addProxy(@Body('proxyAddress') proxyAddress: string) {
    return this.proxyService.addProxy(proxyAddress);
  }

  @Post('/targets')
  addTargetSite(
    @Body('name') name: string,
    @Body('healthCheckUrl') healthCheckUrl: string,
  ) {
    return this.proxyService.addTargetSite(name, healthCheckUrl);
  }

  @Post('/check/:proxyId/:targetSiteId')
  async checkProxyHealth(
    @Param('proxyId') proxyId: number,
    @Param('targetSiteId') targetSiteId: number,
  ) {
    return this.proxyService.checkProxyHealth(proxyId, targetSiteId);
  }

  @Get('/healthy/:targetSiteId')
  async getHealthyProxies(@Param('targetSiteId') targetSiteId: number) {
    return await this.proxyService.getHealthyProxiesForTargetSite(targetSiteId);
  }
}
