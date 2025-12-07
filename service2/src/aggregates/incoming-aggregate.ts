export interface IncomingAggregate {
  deviceId: string;
  avgValue: number;
  from?: string | Date | null;
  to?: string | Date | null;
}