import { Observable, pipe } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GrpcException } from 'src/exceptions/grpc.exception';

export function catchGrpcException<T>() {
  return pipe(
    catchError((error: any, _: Observable<T>) => {
      throw GrpcException.from(error).httpException;
    }),
  );
}
