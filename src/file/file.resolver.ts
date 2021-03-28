import { FileUploadInput } from '@inputs/file.input';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { from, Observable } from 'rxjs';
import { AuthGuard } from 'src/guards/auth.guard';
import { FileService } from './file.service';

@UseGuards(AuthGuard)
@Resolver()
export class FileResolver {
  constructor(private readonly fileService: FileService) {}

  @Mutation(() => Boolean)
  upload(@Args('input') input: FileUploadInput): Observable<boolean> {
    return from(
      new Promise<boolean>(async (resolve, reject) =>
        input.file
          .createReadStream()
          .pipe(this.fileService.createWriteStream(input.file.filename))
          .on('finish', () => resolve(true))
          .on('error', () => reject(false)),
      ),
    );
  }
}
