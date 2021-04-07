import { User } from '@onepass/entities';
import { FileUploadInput } from '@onepass/inputs/file.input';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { nanoid } from 'nanoid';
import { CurrentUser } from 'src/decorators/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { FileService } from './file.service';

@Resolver()
@UseGuards(AuthGuard)
export class FileResolver {
  constructor(private readonly fileService: FileService) {}

  @Mutation(() => Boolean)
  async upload(@CurrentUser() currentUser: User, @Args('input') input: FileUploadInput): Promise<boolean> {
    console.log(currentUser.id);
    const { filename, createReadStream } = await input.file;
    const ext = filename.split('.').reverse()[0];
    return new Promise<boolean>(async (resolve, reject) =>
      createReadStream()
        .pipe(this.fileService.createWriteStream(nanoid(16) + `.${ext}`))
        .on('finish', () => resolve(true))
        .on('error', () => reject(false)),
    );
  }
}
