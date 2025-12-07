import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { connect, Channel, Connection } from 'amqplib';

@Injectable()
export class RabbitmqService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitmqService.name);
  private connection: Connection | null = null;
  private channel: Channel | null = null;
  private readonly queueName = 'aggregates_queue';

  async onModuleInit() {
    const url = process.env.RABBITMQ_URL || 'amqp://kalo:kalo@rabbitmq:5672';
    this.logger.log(`Trying to connect to RabbitMQ at: ${url}`);

    const maxRetries = 5;
    const delayMs = 3000;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        this.logger.log(`RabbitMQ connect attempt ${attempt}/${maxRetries}`);
        this.connection = await connect(url);
        this.channel = await this.connection.createChannel();

        await this.channel.assertQueue(this.queueName, { durable: false });

        this.logger.log(
          `✅ Connected to RabbitMQ at ${url}, queue "${this.queueName}" ready.`,
        );
        return;
      } catch (err) {
        this.logger.error(
          `❌ Failed to connect to RabbitMQ (attempt ${attempt}/${maxRetries})`,
          err as any,
        );

        if (attempt === maxRetries) {
          this.logger.error('Giving up, cannot start without RabbitMQ');
          // Crash the app so Docker restarts it, instead of running half-broken
          throw err;
        }

        await new Promise((res) => setTimeout(res, delayMs));
      }
    }
  }

  async onModuleDestroy() {
    this.logger.log('Closing RabbitMQ channel & connection...');
    await this.channel?.close();
    await this.connection?.close();
  }

  async publishAggregates(aggregates: any[]) {
    if (!this.channel) {
      this.logger.error('Channel not initialized, cannot publish aggregates.');
      return;
    }

    const payload = JSON.stringify(aggregates);
    this.channel.sendToQueue(this.queueName, Buffer.from(payload));
    this.logger.log(`Published ${aggregates.length} aggregates to queue "${this.queueName}".`);
  }
}
