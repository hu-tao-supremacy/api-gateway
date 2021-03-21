import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { Readable, Writable } from 'stream';

@Injectable()
export class FileService {
  private cloudStorage = new Storage().bucket();

  async upload(filePath: string, readableStream: Readable) {
    const file = this.cloudStorage.file(filePath);
    await new Promise((resolve, reject) =>
      readableStream
        .pipe(file.createWriteStream())
        .on('error', reject)
        .on('finish', resolve),
    );
  }

  createWriteStream(filePath: string): Writable {
    const file = this.cloudStorage.file(filePath);
    return file.createWriteStream();
  }
}
