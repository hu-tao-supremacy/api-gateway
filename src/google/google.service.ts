import { PubSub } from '@google-cloud/pubsub';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleService {
  private credentials = JSON.parse(process.env.GCP_CREDENTIALS);
  private pubSubClient = new PubSub({ credentials: this.credentials });

  generateVectorRepresentation(eventId: number): void {
    this.pubSubClient.topic('personalization').publishJSON({ eventId });
  }
}
