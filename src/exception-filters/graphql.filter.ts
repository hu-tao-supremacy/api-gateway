import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch()
export class GraphqlFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {}
}
