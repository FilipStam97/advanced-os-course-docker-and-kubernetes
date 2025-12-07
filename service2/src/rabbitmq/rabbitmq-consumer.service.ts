import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { connect, Channel, Connection, ConsumeMessage  } from 'amqplib';
import { IncomingAggregate } from 'src/aggregates/incoming-aggregate';
import { AppService } from 'src/app.service';

@Injectable()
export class RabbitmqConsumerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitmqConsumerService.name);

  private connection: Connection;
  private channel: Channel;
  private readonly queueName = 'aggregates_queue';

  constructor(private readonly appService: AppService) {}

  async onModuleInit() {
    try {
      const url = process.env.RABBITMQ_URL || 'amqp://kalo:kalo@localhost:5672';
      this.logger.log(`Connecting to RabbitMQ at: ${url}`);
      this.connection = await connect(url);
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(this.queueName, { durable: false });

      // Start consuming
      await this.channel.consume(
        this.queueName,
        (msg) => this.handleMessage(msg),
        { noAck: false },
      );

      this.logger.log(`Consuming from queue "${this.queueName}"`);
    } catch (err) {
      this.logger.error('Failed to connect/consume from RabbitMQ', err as any);
    }
  }

  async onModuleDestroy() {
    await this.channel?.close();
    await this.connection?.close();
  }

  private async handleMessage(msg: ConsumeMessage | null) {
    if (!msg) return;

    try {
      const content = msg.content.toString();
      const aggregates: IncomingAggregate[] = JSON.parse(content);

      this.logger.log(
        `Received ${Array.isArray(aggregates) ? aggregates.length : 1} aggregates`,
      );

      if (Array.isArray(aggregates)) {
        await this.appService.saveAggregates(aggregates);
      } else {
        await this.appService.saveAggregates([aggregates]);
      }

      this.channel.ack(msg);
    } catch (err) {
      this.logger.error('Error handling message from RabbitMQ', err as any);
      // don't requeue or you'll loop errors forever
      this.channel.nack(msg, false, false);
    }
  }
}
