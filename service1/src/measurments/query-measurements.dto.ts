import { IsOptional, IsString } from 'class-validator';

export class QueryMeasurementsDto {
  @IsOptional()
  @IsString()
  deviceId?: string;
}