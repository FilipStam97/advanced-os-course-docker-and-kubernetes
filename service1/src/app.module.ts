import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Measurement } from './measurments/measurment.entity';

@Module({
  imports: [TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5331,
      username: 'admin',
      password: 'admin123',
      database: 'bank',
      entities: [Measurement],
      synchronize: true,
    }), TypeOrmModule.forFeature([Measurement])],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
