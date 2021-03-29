import { FileUploadInput } from '@inputs/file.input';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { from, Observable } from 'rxjs';
import { AuthGuard } from 'src/guards/auth.guard';
import { FileService } from './file.service';

@Resolver()
@UseGuards(AuthGuard)
export class FileResolver {
  constructor(private readonly fileService: FileService) {}

  @Mutation(() => Boolean)
  async upload(@Args('input') input: FileUploadInput): Promise<boolean> {
    const { filename, createReadStream } = await input.file;
    console.log(filename);
    return new Promise<boolean>(async (resolve, reject) =>
      createReadStream()
        .pipe(this.fileService.createWriteStream(filename))
        .on('finish', () => resolve(true))
        .on('error', () => reject(false)),
    );
  }
}
