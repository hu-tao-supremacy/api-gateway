import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventResolver } from './event.resolver';

@Module({
  imports: [],
  providers: [
    EventService,
    EventResolver,
  ],
})
export class EventModule { }
