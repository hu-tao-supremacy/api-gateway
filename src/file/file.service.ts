import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { Readable, Writable } from 'stream';
import { DateTime } from 'luxon';
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable()
export class FileService {
  private cloudStorage = new Storage({
    credentials: JSON.parse(process.env.GCP_CREDENTIALS),
  }).bucket(process.env.GCP_BUCKET_NAME);

  async upload(filePath: string, readableStream: Readable) {
    const file = this.cloudStorage.file(filePath);
    await new Promise((resolve, reject) =>
      readableStream.pipe(file.createWriteStream()).on('error', reject).on('finish', resolve),
    );
  }

  createWriteStream(filePath: string, publicRead: boolean = false): Writable {
    const file = this.cloudStorage.file(filePath);
    return file.createWriteStream({ resumable: false, public: publicRead });
  }

  // Generate a URL that allows temporary access to download file in GCS.
  getSignedUrl(file: string): Observable<string> {
    // gsutil URI.
    const now = DateTime.now();
    const object = this.cloudStorage.file(file);

    return from(object.isPublic()).pipe(
      map((isPublicResponse) => isPublicResponse[0]),
      switchMap((isPublic) => {
        return isPublic
          ? from(object.publicUrl())
          : from(
              object.getSignedUrl({
                action: 'read',
                expires: now.plus({ day: 1 }).toJSDate(),
                accessibleAt: now.minus({ minutes: 30 }).toJSDate(),
              }),
            ).pipe(map((data) => data[0]));
      }),
    );
  }
}
