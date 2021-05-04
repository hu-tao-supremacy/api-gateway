import { Module } from '@nestjs/common';
import { AnswerResolver } from './answer.resolver';

@Module({
  providers: [AnswerResolver]
})
export class AnswerModule {}
