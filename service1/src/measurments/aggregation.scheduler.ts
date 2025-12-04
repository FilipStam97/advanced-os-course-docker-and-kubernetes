import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { AppService } from 'src/app.service';


@Injectable()
export class AggregationScheduler {
  private readonly logger = new Logger(AggregationScheduler.name);

  private readonly windowMinutes =
    parseInt(process.env.AGGREGATE_WINDOW_MINUTES || '10');

//   private readonly intervalMs =
//     parseInt(process.env.AGGREGATE_INTERVAL_MINUTES || '5') * 60 * 1000;

  constructor(private readonly appService: AppService) {}

  @Interval('aggregate-interval', parseInt(process.env.AGGREGATE_INTERVAL_MINUTES || '5') * 60 * 1000) // 5 minutes default (300k ms)
  async handleInterval() {
    try {
      const count = await this.appService.aggregateAndSend(this.windowMinutes);
      this.logger.log(
        `Scheduled aggregateAndSend ran: sent ${count} aggregates for last ${this.windowMinutes} min.`,
      );
    } catch (err) {
      this.logger.error('Error during scheduled aggregateAndSend', err as any);
    }
  }
}