import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { Readable, Writable } from 'stream';

@Injectable()
export class FileService {
  private cloudStorage = new Storage({
    credentials: JSON.parse(process.env.GCP_CREDENTIALS),
  }).bucket(process.env.GCP_BUCKET_NAME);

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
    const file = this.cloudStorage.file(filePath, { public: true });
    return file.createWriteStream({ resumable: false });
  }
}
