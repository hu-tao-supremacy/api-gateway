import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch()
export class GraphFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {}
}
