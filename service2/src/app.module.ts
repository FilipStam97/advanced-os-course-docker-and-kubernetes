import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RabbitmqConsumerService } from './rabbitmq/rabbitmq-consumer.service';
import { Aggregate } from './aggregates/aggregate.entity';

@Module({
    imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || "5333") ,
      username:  process.env.DB_USER || 'admin',
      password: process.env.DB_PASS || 'admin123',
      database: process.env.DB_NAME || 'bank',
      entities: [Aggregate],
      synchronize: true,
    }), TypeOrmModule.forFeature([Aggregate])],
  controllers: [AppController],
  providers: [AppService, RabbitmqConsumerService],
})
export class AppModule {}
