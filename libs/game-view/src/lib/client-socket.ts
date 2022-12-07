import { geckos, ClientChannel } from '@geckos.io/client';
import { ClientEventMap, ServerEventMap } from '@stellon/game-core';

export class ClientSocket {
  channel?: ClientChannel;

  constructor(private url: string, private token: string) {}

  async connect() {
    return new Promise<void>((resolve, reject) => {
      this.channel = geckos({
        url: this.url,
        port: 80,
        authorization: this.token,
      });

      this.channel.onConnect((error) => {
        if (error) {
          return reject();
        }

        resolve();
      });
    });
  }

  emit<K extends keyof ClientEventMap>(name: K, event: ClientEventMap[K]) {
    this.channel?.emit(name, event);
  }

  on<K extends keyof ServerEventMap>(
    name: K,
    callback: (event: ServerEventMap[K]) => void
  ) {
    this.channel?.on(name, callback as any);
  }

  close() {
    this.channel?.close();
  }
}
