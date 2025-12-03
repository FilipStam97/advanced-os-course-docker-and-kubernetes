import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Measurement } from './measurments/measurment.entity';
import { QueryMeasurementsDto } from './measurments/query-measurements.dto';
import { CreateMeasurementDto } from './measurments/create-measurement.dto';
import { MeasurementAggregate } from './measurments/measurement-aggregate.type';

@Injectable()
export class AppService {

    constructor(
    @InjectRepository(Measurement)
    private measurementRepo: Repository<Measurement>,
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
    windowMinutes = 10,
  ): Promise<MeasurementAggregate[]> {
    const to = new Date();
    const from = new Date(to.getTime() - windowMinutes * 60 * 1000);

    const rows = await this.measurementRepo
      .createQueryBuilder('m')
      .select('m.deviceId', 'deviceId')
      .addSelect('AVG(m.value)', 'avgValue')
      .where('m.createdAt BETWEEN :from AND :to', { from, to })
      .groupBy('m.deviceId')
      .getRawMany<{
        deviceId: string;
        avgValue: string;
      }>();

    return rows.map((row) => ({
      deviceId: row.deviceId,
      avgValue: Number(row.avgValue),
      from,
      to,
    }));
  }
}
