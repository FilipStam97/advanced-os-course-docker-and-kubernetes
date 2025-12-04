import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { connect, Channel, Connection } from 'amqplib';

@Injectable()
export class RabbitmqService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitmqService.name);
  private connection: Connection;
  private channel: Channel;
  private readonly queueName = 'aggregates_queue';

  async onModuleInit() {
    try {
      const url = process.env.RABBITMQ_URL || 'amqp://kalo:kalo@localhost:5672';
      this.connection = await connect(url);
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(this.queueName, { durable: false });
      this.logger.log(`Connected to RabbitMQ at ${url}, queue "${this.queueName}" ready.`);
    } catch (err) {
      this.logger.error('Failed to connect to RabbitMQ', err as any);
    }
  }

  async onModuleDestroy() {
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
