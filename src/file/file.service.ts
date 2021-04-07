import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { Readable, Writable } from 'stream';
import { DateTime } from 'luxon';
import { from, Observable, of } from 'rxjs';
import { map, tap, switchMap } from 'rxjs/operators';
import { ReadStream } from 'node:fs';
import { FileUpload } from 'graphql-upload';

@Injectable()
export class FileService {
  private cloudStorage = new Storage({
    credentials: JSON.parse(process.env.GCP_CREDENTIALS),
  }).bucket(process.env.GCP_BUCKET_NAME);

  // async upload(filePath: string, readableStream: Readable) {
  //   const file = this.cloudStorage.file(filePath);
  //   await new Promise((resolve, reject) =>
  //     readableStream.pipe(file.createWriteStream()).on('error', reject).on('finish', resolve),
  //   );
  // }

  upload(objectPath: string, fileUpload?: Promise<FileUpload>): Observable<string | null> {
    return fileUpload ? from(fileUpload).pipe(switchMap(({ filename, createReadStream }) => {
      const extension = filename.split('.').reverse()[0]
      return from(new Promise<boolean>((resolve, reject) => {
        createReadStream()
          .pipe(this.createWriteStream(objectPath))
          .on('finish', () => resolve(true))
          .on('error', () => reject(false))
      })).pipe(map(_ => `gs://${process.env.GCP_BUCKET_NAME}/${objectPath}.${extension}`))
    })) : of(null)
  }

  createWriteStream(filePath: string, publicRead: boolean = false): Writable {
    const file = this.cloudStorage.file(filePath);
    return file.createWriteStream({ resumable: false, public: publicRead });
  }

  // Generate a URL that allows temporary access to download file in GCS.
  getSignedUrl(file: string): Observable<string> {
    // gsutil URI.
    const prefix = `gs://${process.env.GCP_BUCKET_NAME}/`
    const fileName = file.includes(prefix) ? file.split(prefix)[1] : file;
    const now = DateTime.now().setZone("Asia/Bangkok")
    const object = this.cloudStorage.file(fileName);

    return from(object.isPublic()).pipe(
      map((isPublicResponse) => isPublicResponse[0]),
      switchMap((isPublic) => {
        return isPublic
          ? from(object.publicUrl())
          : from(
            object.getSignedUrl({
              version: "v4",
              action: 'read',
              expires: now.plus({ day: 1 }).toJSDate(),
              accessibleAt: now.minus({ minutes: 30 }).toJSDate(),
            }),
          ).pipe(map((data) => data[0]));
      }),
    );
  }
}
