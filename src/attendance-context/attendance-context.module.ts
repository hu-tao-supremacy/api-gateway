import { Module } from '@nestjs/common';
import { AttendanceContextResolver } from './attendance-context.resolver';

@Module({
  providers: [AttendanceContextResolver],
})
export class AttendanceContextModule {}
