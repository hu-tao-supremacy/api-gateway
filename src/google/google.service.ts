import { PubSub } from '@google-cloud/pubsub';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleService {
  private credentials = JSON.parse(process.env.GCP_CREDENTIALS);
  private pubSubClient = new PubSub({ credentials: this.credentials });

  async createPubSubTopic(name: string) {
    const exists = (await this.pubSubClient.topic(name).exists())[0];
    if (!exists) {
      this.pubSubClient.createTopic(name);
    }
  }

  async generateVectorRepresentation(eventId: number): Promise<void> {
    await this.createPubSubTopic('personalization');
    this.pubSubClient.topic('personalization').publishJSON({ eventId });
  }
}
