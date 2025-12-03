import { IsNumber, IsString } from 'class-validator';

export class CreateMeasurementDto {
  @IsString()
  deviceId: string;

  @IsNumber()
  value: number;
}