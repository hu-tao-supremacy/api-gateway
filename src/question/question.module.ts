import { Module } from '@nestjs/common';
import { QuestionResolver } from './question.resolver';

@Module({
  providers: [QuestionResolver],
})
export class QuestionModule {}
