import { Module } from '@nestjs/common';
import { AttendanceResolver } from './attendance.resolver';

@Module({
  providers: [AttendanceResolver]
})
export class AttendanceModule {}
