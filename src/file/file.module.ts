import { Global, Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileResolver } from './file.resolver';

@Global()
@Module({
  providers: [FileService, FileResolver],
  exports: [FileService]
})
export class FileModule {}
