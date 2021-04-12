import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  GatewayTimeoutException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  NotImplementedException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { status } from 'grpc';

export class GrpcException {
  public code: number;
  public message: string;

  constructor(code: number, message: string) {
    this.code = code;
    this.message = message;
  }

  public static from(error: any): GrpcException {
    return new GrpcException(error.code, error.details);
  }

  public static toHttpException(code: number, message: string): HttpException {
    switch (code) {
      case status.CANCELLED:
        return new ServiceUnavailableException(message);
      case status.UNKNOWN:
        return new InternalServerErrorException(message);
      case status.INVALID_ARGUMENT:
        return new BadRequestException(message);
      case status.DEADLINE_EXCEEDED:
        return new GatewayTimeoutException(message);
      case status.NOT_FOUND:
        return new NotFoundException(message);
      case status.ALREADY_EXISTS:
        return new ConflictException(message);
      case status.PERMISSION_DENIED:
        return new ForbiddenException(message);
      case status.UNAUTHENTICATED:
        return new UnauthorizedException(message);
      case status.RESOURCE_EXHAUSTED:
        return new InternalServerErrorException(message);
      case status.FAILED_PRECONDITION:
        return new BadRequestException(message);
      case status.ABORTED:
        return new ConflictException(message);
      case status.UNIMPLEMENTED:
        return new NotImplementedException(message);
      case status.INTERNAL:
        return new InternalServerErrorException(message);
      case status.UNAVAILABLE:
        return new ServiceUnavailableException(message);
      default:
        console.log(code, message);
        return new InternalServerErrorException(message);
    }
  }

  public get isCancelled() {
    return this.code === status.CANCELLED;
  }
  public get isUnknown() {
    return this.code === status.UNKNOWN;
  }
  public get isInvalidArgument() {
    return this.code === status.INVALID_ARGUMENT;
  }
  public get isDeadlineExceed() {
    return this.code === status.DEADLINE_EXCEEDED;
  }
  public get isNotFound() {
    return this.code === status.NOT_FOUND;
  }
  public get isAlreadyExists() {
    return this.code === status.ALREADY_EXISTS;
  }
  public get isPermissionDenined() {
    return this.code === status.PERMISSION_DENIED;
  }
  public get isUnauthenticated() {
    return this.code === status.UNAUTHENTICATED;
  }
  public get isResourceExhausted() {
    return this.code === status.RESOURCE_EXHAUSTED;
  }
  public get isFailedPrecondition() {
    return this.code === status.FAILED_PRECONDITION;
  }
  public get isAborted() {
    return this.code === status.ABORTED;
  }
  public get isUnimplemented() {
    return this.code === status.UNIMPLEMENTED;
  }
  public get isInternal() {
    return this.code === status.INTERNAL;
  }
  public get isUnavailable() {
    return this.code === status.UNAVAILABLE;
  }

  public get httpException(): HttpException {
    return GrpcException.toHttpException(this.code, this.message);
  }
}
