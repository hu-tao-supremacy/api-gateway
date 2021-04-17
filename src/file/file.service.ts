import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { Readable, Writable } from 'stream';
import { DateTime } from 'luxon';
import { from, Observable, forkJoin, of } from 'rxjs';
import { map, tap, switchMap, catchError } from 'rxjs/operators';
import { FileUpload } from 'graphql-upload';
import * as sharp from 'sharp';
import { encode as encodeImage } from 'blurhash';
import { ReadStream } from 'node:fs';
const concat = require('concat-stream');

@Injectable()
export class FileService {
  private cloudStorage = new Storage({
    credentials: JSON.parse(process.env.GCP_CREDENTIALS),
  }).bucket(process.env.GCP_BUCKET_NAME);

  // async encode(buffer: ReadStream) {
  //   const concatStream = concat(async (buf: Buffer) => {
  //     const s = sharp(buf);
  //     const metadata = await s.metadata();
  //     const w = metadata.width!;
  //     const h = metadata.height!;
  //     const resized = await s.raw().ensureAlpha().resize(w, h, { fit: 'inside' }).toBuffer();
  //     console.log(encodeImage(new Uint8ClampedArray(resized), w, h, 4, 4));
  //   });
  //   buffer.pipe(concatStream);
  // }

  upload(objectPath: string, fileUpload?: Promise<FileUpload>): Observable<string | null> {
    return fileUpload
      ? from(fileUpload).pipe(
          switchMap(({ createReadStream }) => {
            const stream = createReadStream();
            const path = objectPath + '.jpg';

            // BlurHash representation.
            let hash = new String();

            const compression = sharp()
              .ensureAlpha()
              .resize(null, 1200, { withoutEnlargement: true })
              .toFormat('jpg', { quality: 75 });

            const sampling = sharp()
              .raw()
              .ensureAlpha()
              .resize(null, 100, { withoutEnlargement: true })
              .toFormat('jpg', { quality: 50 });

            const buffer = concat(async (buf: Buffer) => {
              const s = sharp(buf);
              const metadata = await s.metadata();
              const w = metadata.width!;
              const h = metadata.height!;
              const resized = await s.raw().ensureAlpha().resize(w, h, { fit: 'contain' }).toBuffer();
              hash = encodeImage(new Uint8ClampedArray(resized), w, h, 4, 4);
            });

            const sampling$ = new Promise<boolean>((resolve, reject) => {
              stream
                .pipe(sampling)
                .pipe(buffer)
                .on('finish', () => resolve(true))
                .on('error', () => reject(false));
            });

            const pipeline$ = new Promise<boolean>((resolve, reject) => {
              stream
                .pipe(compression)
                .pipe(this.createWriteStream(path))
                .on('finish', () => resolve(true))
                .on('error', () => reject(false));
            });

            return forkJoin([from(pipeline$), from(sampling$)]).pipe(
              map((_) => `gs://${process.env.GCP_BUCKET_NAME}/${path}`),
            );
          }),
        )
      : of(null);
  }

  createWriteStream(filePath: string, publicRead: boolean = false): Writable {
    const file = this.cloudStorage.file(filePath);
    return file.createWriteStream({ resumable: false, public: publicRead });
  }

  delete(uri: string): Observable<boolean> {
    const prefix = `gs://${process.env.GCP_BUCKET_NAME}/`;
    const fileName = uri.includes(prefix) ? uri.split(prefix)[1] : uri;
    const object = this.cloudStorage.file(fileName);
    return from(object.delete()).pipe(map((_) => true));
  }

  // Generate a URL that allows temporary access to download file in GCS.
  getSignedUrl(file: string): Observable<string> {
    // gsutil URI.
    const prefix = `gs://${process.env.GCP_BUCKET_NAME}/`;
    const fileName = file.includes(prefix) ? file.split(prefix)[1] : file;
    const now = DateTime.now().setZone('Asia/Bangkok');
    const object = this.cloudStorage.file(fileName);

    return from(object.isPublic()).pipe(
      map((isPublicResponse) => isPublicResponse[0]),
      switchMap((isPublic) => {
        return isPublic
          ? from(object.publicUrl())
          : from(
              object.getSignedUrl({
                version: 'v4',
                action: 'read',
                expires: now.plus({ day: 1 }).toJSDate(),
                accessibleAt: now.minus({ minutes: 30 }).toJSDate(),
              }),
            ).pipe(map((data) => data[0]));
      }),
    );
  }
}
