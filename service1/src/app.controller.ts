import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateMeasurementDto } from './measurments/create-measurement.dto';
import { QueryMeasurementsDto } from './measurments/query-measurements.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // POST /data
  @Post('/data')
  async create(@Body() dto: CreateMeasurementDto) {
    return this.appService.create(dto);
  }

  // GET /data?deviceId=...
  @Get('/data')
  async findAll(@Query() query: QueryMeasurementsDto) {
    return this.appService.findAll(query);
  }


  
  @Get('aggregate')
  async aggregate(@Query('windowMinutes') windowMinutes?: string) {
    const window = windowMinutes ? parseInt(windowMinutes, 10) : 10;
    return this.appService.aggregateLastMinutes(window);
  }

  // MANUAL TRIGGER
  @Post('aggregate/dispatch')
  async aggregateAndSend(@Query('windowMinutes') windowMinutes?: string) {
    const window = windowMinutes ? parseInt(windowMinutes, 10) : 24 * 60;
    const count = await this.appService.aggregateAndSend(window);
    return { sent: count, windowMinutes: window };
  }
}
