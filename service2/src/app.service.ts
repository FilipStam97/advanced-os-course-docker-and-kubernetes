import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Aggregate } from './aggregates/aggregate.entity';
import { Repository } from 'typeorm';
import { IncomingAggregate } from './aggregates/incoming-aggregate';



@Injectable()
export class AppService {

  constructor(
    @InjectRepository(Aggregate)
    private readonly aggregateRepo: Repository<Aggregate>,
  ) {}

  getHello(): string {
    return 'Hello service2!';
  }

async saveAggregates(aggregates: IncomingAggregate[]): Promise<void> {
  if (!aggregates || aggregates.length === 0) return;

  const entities = aggregates.map((a) =>
  this.aggregateRepo.create({
    deviceId: a.deviceId,
    avgValue: a.avgValue,
    from: a.from ? new Date(a.from) : null,
    to: a.to ? new Date(a.to) : null,
  }),
  );

await this.aggregateRepo.save(entities);
}

  async findAll(deviceId?: string): Promise<Aggregate[]> {
    const qb = this.aggregateRepo.createQueryBuilder('a');

    if (deviceId) {
      qb.where('a.deviceId = :deviceId', { deviceId });
    }

    return qb.orderBy('a.createdAt', 'DESC').limit(100).getMany();
  }
}

