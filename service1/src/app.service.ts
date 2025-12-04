import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Measurement } from './measurments/measurment.entity';
import { QueryMeasurementsDto } from './measurments/query-measurements.dto';
import { CreateMeasurementDto } from './measurments/create-measurement.dto';
import { MeasurementAggregate } from './measurments/measurement-aggregate.type';
import { RabbitmqService } from './rabbitmq/rabbitmq.service';

@Injectable()
export class AppService {

    constructor(
    @InjectRepository(Measurement)
    private measurementRepo: Repository<Measurement>,
    private readonly rabbitmqService: RabbitmqService,
  ) {}
  
  getHello(): string {
    return 'Hello service1!';
  }

  async create(dto: CreateMeasurementDto): Promise<Measurement> {
    const measurement = this.measurementRepo.create(dto);
    return this.measurementRepo.save(measurement);
  }

  async findAll(query: QueryMeasurementsDto): Promise<Measurement[]> {
    const qb = this.measurementRepo.createQueryBuilder('m');

    if (query.deviceId) {
      qb.where('m.deviceId = :deviceId', { deviceId: query.deviceId });
    }

    return qb.orderBy('m.createdAt', 'DESC').limit(100).getMany();
  }

  async aggregateLastMinutes(
    windowMinutes?: number,
  ): Promise<MeasurementAggregate[]> {
  const to = new Date();

  const minutes = windowMinutes ?? 24 * 60;
  const from = new Date(to.getTime() - minutes * 60 * 1000);

  console.log('AGG WINDOW:', { from, to });

  const rows = await this.measurementRepo
    .createQueryBuilder('m')
    .select('m.deviceId', 'deviceId')
    .addSelect('AVG(m.value)', 'avgValue')
    .where('m.createdAt >= :from', { from })
    .andWhere('m.createdAt <= :to', { to })
    .groupBy('m.deviceId')
    .getRawMany<{ deviceId: string; avgValue: string }>();

  console.log('AGG ROWS RAW:', rows);

  return rows.map((row) => ({
    deviceId: row.deviceId,
    avgValue: Number(row.avgValue),
    from,
    to,
  }));
  }


  async aggregateAndSend(windowMinutes?: number): Promise<number> {
    const aggregates = await this.aggregateLastMinutes(windowMinutes);
    if (aggregates.length > 0) {
      await this.rabbitmqService.publishAggregates(aggregates);
    }
    return aggregates.length;
  }
}
