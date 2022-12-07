import '@geckos.io/phaser-on-nodejs';
import { SERVER_FPS } from '@stellon/game-core';
import cuid from 'cuid';
import { Game } from 'phaser';
import { User, UserRecord } from './api';
import { ServerScene } from './scenes/server-scene';
import { ServerSocket } from './server-socket';

global.phaserOnNodeFPS = SERVER_FPS;

export class Stage {
  static instances: Map<string, Stage> = new Map();

  id = cuid();
  game: Game;
  scene: ServerScene;

  onEnd?: (users: UserRecord[]) => void;

  constructor(socket: ServerSocket, users: User[]) {
    this.scene = new ServerScene(socket.room(this.id), users);
    this.scene.onCreate = () => {
      Stage.instances.set(this.id, this);
    };

    this.game = new Phaser.Game({
      type: Phaser.HEADLESS,
      banner: false,
      audio: { noAudio: true },
      physics: {
        default: 'arcade',
        arcade: {
          debug: false,
          gravity: { y: 0 },
        },
      },
      fps: {
        target: SERVER_FPS,
      },
      scene: [this.scene],
    });
  }

  destroy() {
    Stage.instances.delete(this.id);
    this.game.destroy(true);
  }
}
