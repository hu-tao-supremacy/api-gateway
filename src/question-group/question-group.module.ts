import { Module } from '@nestjs/common';
import { QuestionGroupResolver } from './question-group.resolver';

@Module({
  providers: [QuestionGroupResolver],
})
export class QuestionGroupModule {}
