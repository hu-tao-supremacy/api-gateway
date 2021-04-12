import { BadRequestException, ConflictException, ForbiddenException, GatewayTimeoutException, HttpException, InternalServerErrorException, NotFoundException, NotImplementedException, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common'
import grpc from 'grpc'

export class GrpcException extends Error {
  public code: number;
  public details: string;

  public static toHttpException(code: number, message: string): HttpException {
    switch (code) {
      case grpc.status.CANCELLED:
        return new ServiceUnavailableException(message);
      case grpc.status.UNKNOWN:
        return new InternalServerErrorException(message);
      case grpc.status.INVALID_ARGUMENT:
        return new BadRequestException(message);
      case grpc.status.DEADLINE_EXCEEDED:
        return new GatewayTimeoutException(message);
      case grpc.status.NOT_FOUND:
        return new NotFoundException(message);
      case grpc.status.ALREADY_EXISTS:
        return new ConflictException(message);
      case grpc.status.PERMISSION_DENIED:
        return new ForbiddenException(message);
      case grpc.status.UNAUTHENTICATED:
        return new UnauthorizedException(message);
      case grpc.status.RESOURCE_EXHAUSTED:
        return new InternalServerErrorException(message);
      case grpc.status.FAILED_PRECONDITION:
        return new BadRequestException(message);
      case grpc.status.ABORTED:
        return new ConflictException(message);
      case grpc.status.UNIMPLEMENTED:
        return new NotImplementedException(message);
      case grpc.status.INTERNAL:
        return new InternalServerErrorException(message);
      case grpc.status.UNAVAILABLE:
        return new ServiceUnavailableException(message);
      default:
        return new InternalServerErrorException(message);
    }
  }

  public get isCancelled() { return this.code === grpc.status.CANCELLED; }
  public get isUnknown() { return this.code === grpc.status.UNKNOWN; }
  public get isInvalidArgument() { return this.code === grpc.status.INVALID_ARGUMENT; }
  public get isDeadlineExceed() { return this.code === grpc.status.DEADLINE_EXCEEDED; }
  public get isNotFound() { return this.code === grpc.status.NOT_FOUND; }
  public get isAlreadyExists() { return this.code === grpc.status.ALREADY_EXISTS; }
  public get isPermissionDenined() { return this.code === grpc.status.PERMISSION_DENIED; }
  public get isUnauthenticated() { return this.code === grpc.status.UNAUTHENTICATED; }
  public get isResourceExhausted() { return this.code === grpc.status.RESOURCE_EXHAUSTED; }
  public get isFailedPrecondition() { return this.code === grpc.status.FAILED_PRECONDITION; }
  public get isAborted() { return this.code === grpc.status.ABORTED; }
  public get isUnimplemented() { return this.code === grpc.status.UNIMPLEMENTED; }
  public get isInternal() { return this.code === grpc.status.INTERNAL; }
  public get isUnavailable() { return this.code === grpc.status.UNAVAILABLE; }

  public httpException(): HttpException {
    return GrpcException.toHttpException(this.code, this.details);
  }
}
