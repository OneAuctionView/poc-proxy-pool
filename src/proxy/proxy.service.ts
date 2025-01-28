import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proxy } from './entities/proxy.entity';
import { ProxyProvider } from './entities/proxy-provider.entity';
import { TargetSite } from './entities/target.entity';
import { ProxyTargetStatus } from './entities/proxy-target-status.entity';
import axios from 'axios';

@Injectable()
export class ProxyService {
  constructor(
    @InjectRepository(Proxy)
    private readonly proxyRepository: Repository<Proxy>,
    @InjectRepository(TargetSite)
    private readonly targetRepository: Repository<TargetSite>,
    @InjectRepository(ProxyTargetStatus)
    private readonly statusRepository: Repository<ProxyTargetStatus>,
    @InjectRepository(ProxyProvider)
    private readonly providerRepository: Repository<ProxyProvider>,
  ) {}

  async addProxy(proxyAddress: string): Promise<Proxy> {
    const proxy = this.proxyRepository.create({ proxyAddress });
    return this.proxyRepository.save(proxy);
  }

  async addTargetSite(
    name: string,
    healthCheckUrl: string,
  ): Promise<TargetSite> {
    const targetSite = this.targetRepository.create({ name, healthCheckUrl });
    return this.targetRepository.save(targetSite);
  }

  async checkProxyHealth(
    proxyId: number,
    targetSiteId: number,
  ): Promise<ProxyTargetStatus> {
    const proxy = await this.proxyRepository.findOneBy({ id: proxyId });
    const targetSite = await this.targetRepository.findOneBy({
      id: targetSiteId,
    });

    if (!proxy || !targetSite) {
      throw new Error('Proxy or Target Site not found');
    }

    const proxyConfig = {
      proxy: {
        host: proxy.proxyAddress.split(':')[0],
        port: parseInt(proxy.proxyAddress.split(':')[1]),
      },
    };

    let status = 'unhealthy';
    let latency: number | null = null;

    try {
      const start = Date.now();
      const response = await axios.get(targetSite.healthCheckUrl, proxyConfig);
      latency = (Date.now() - start) / 1000;
      if (response.status === 200) {
        status = 'healthy';
      }
    } catch {
      status = 'unhealthy';
    }

    const proxyStatus = await this.statusRepository.findOne({
      where: { proxy, targetSite },
    });

    if (proxyStatus) {
      proxyStatus.status = status;
      proxyStatus.latency = latency;
      proxyStatus.lastChecked = new Date();
      return this.statusRepository.save(proxyStatus);
    }

    const newStatus = this.statusRepository.create({
      proxy,
      targetSite,
      status,
      latency,
      lastChecked: new Date(),
    });

    return this.statusRepository.save(newStatus);
  }
  async getHealthyProxiesForTargetSite(
    targetSiteId: number,
  ): Promise<ProxyTargetStatus[]> {
    const targetSite = await this.targetRepository.findOneBy({
      id: targetSiteId,
    });

    if (!targetSite) {
      throw new Error('Target site not found');
    }

    return this.statusRepository.find({
      where: {
        targetSite,
        status: 'healthy',
      },
      relations: ['proxy'], // Include the proxy details in the result
    });
  }
  // Add a new Proxy Provider
  async addProxyProvider(
    name: string,
    description?: string,
  ): Promise<ProxyProvider> {
    const provider = this.providerRepository.create({ name, description });
    return this.providerRepository.save(provider);
  }
  // Assign a Proxy to a Proxy Provider
  async assignProxyToProvider(
    proxyId: number,
    providerId: number,
  ): Promise<Proxy> {
    const proxy = await this.proxyRepository.findOneBy({ id: proxyId });
    const provider = await this.providerRepository.findOneBy({
      id: providerId,
    });

    if (!proxy) throw new Error('Proxy not found');
    if (!provider) throw new Error('Proxy Provider not found');

    proxy.provider = provider;
    return this.proxyRepository.save(proxy);
  }
  // Get all Proxies under a specific Proxy Provider
  async getProxiesByProvider(providerId: number): Promise<Proxy[]> {
    const providers = await this.providerRepository.findBy({
      id: providerId,
    });

    if (providers.length === 0) throw new Error('Proxy Provider not found');

    return providers[0].proxies;
  }
}
