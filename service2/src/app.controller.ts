import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('results')
  async findAll(@Query('deviceId') deviceId?: string) {
    return this.appService.findAll(deviceId);
  }
}
