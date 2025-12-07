import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Measurement } from './measurments/measurment.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { AggregationScheduler } from './measurments/aggregation.scheduler';
import { RabbitmqService } from './rabbitmq/rabbitmq.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || "5432") ,
      username:  process.env.DB_USER || 'admin',
      password: process.env.DB_PASS || 'admin123',
      database: process.env.DB_NAME || 'bank',
      entities: [Measurement],
      synchronize: true,
    }), TypeOrmModule.forFeature([Measurement])],
  controllers: [AppController],
  providers: [AppService, RabbitmqService,AggregationScheduler],
})
export class AppModule {}
