import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proxy } from './proxy.entity';
import axios from 'axios';

@Injectable()
export class ProxyService {
  constructor(
    @InjectRepository(Proxy)
    private readonly proxyRepository: Repository<Proxy>,
  ) {}

  async addProxy(proxyAddress: string): Promise<Proxy> {
    const proxy = this.proxyRepository.create({ proxyAddress });
    return this.proxyRepository.save(proxy);
  }

  async getHealthyProxy(): Promise<Proxy | null> {
    return this.proxyRepository.findOne({ where: { status: 'healthy' } });
  }

  async checkProxyHealth(proxyId: number): Promise<Proxy> {
    const proxy = await this.proxyRepository.findOne({
      where: { id: proxyId },
    });
    if (!proxy) throw new Error('Proxy not found');

    const proxyConfig = {
      proxy: {
        host: proxy.proxyAddress.split(':')[0],
        port: parseInt(proxy.proxyAddress.split(':')[1]),
      },
    };

    try {
      const start = Date.now();
      const response = await axios.get<{ status: string }>(
        'https://httpbin.org/ip',
        proxyConfig,
      );
      const latency = (Date.now() - start) / 1000;

      proxy.status = response.status === 200 ? 'healthy' : 'unhealthy';
      proxy.latency = latency;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.message);
      } else {
        console.error('Unexpected error:', error);
      }
      proxy.status = 'unhealthy';
      proxy.latency = null;
    }

    proxy.lastChecked = new Date();
    return this.proxyRepository.save(proxy);
  }
}
