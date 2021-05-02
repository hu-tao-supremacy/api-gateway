import { CreateSubscriptionOptions, PubSub } from '@google-cloud/pubsub';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class GoogleService implements OnModuleInit {
  private credentials = JSON.parse(process.env.GCP_CREDENTIALS);
  private pubSubClient = new PubSub({ credentials: this.credentials });

  async onModuleInit() {
    const TOPIC_NAME = 'personalization';
    const SUBSCRIPTION_NAME = 'cloudrun';
    const SUBSCRIPTION_PUSH_ENDPOINT = null;

    // Create Pub/Sub topic if not exists.
    await this.createPubSubTopic(TOPIC_NAME);

    // Create Pub/Sub subscription if not exists.
    await this.createPubSubSubscription(TOPIC_NAME, SUBSCRIPTION_NAME, {
      pushEndpoint: SUBSCRIPTION_PUSH_ENDPOINT,
    });
  }

  async createPubSubTopic(name: string) {
    const exists = (await this.pubSubClient.topic(name).exists())[0];
    if (!exists) await this.pubSubClient.createTopic(name);
  }

  async createPubSubSubscription(topicName: string, subscriptionName: string, options: CreateSubscriptionOptions) {
    const exists = (await this.pubSubClient.topic(topicName).subscription(subscriptionName).exists())[0];
    if (!exists) await this.pubSubClient.topic(topicName).createSubscription(subscriptionName, options);
  }

  async generateVectorRepresentation(eventId: number): Promise<void> {
    this.pubSubClient.topic('personalization').publishJSON({ eventId });
  }
}
