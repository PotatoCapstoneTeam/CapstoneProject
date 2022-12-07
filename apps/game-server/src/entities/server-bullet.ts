import {
  Bullet,
  CreateEvent,
  DestroyEvent,
  Entity,
  EntityType,
} from '@stellon/game-core';
import cuid from 'cuid';
import { ServerScene } from '../scenes/server-scene';
import { ServerRoom } from '../server-socket';

export class ServerBullet extends Bullet {
  room: ServerRoom;

  constructor(
    scene: ServerScene,
    x: number,
    y: number,
    source: Entity,
    damage: number,
    speed: number,
    angle: number
  ) {
    super(cuid(), scene, x, y, source, damage, speed, angle);

    this.room = scene.room;

    this.room.emit('create', {
      type: EntityType.BULLET,
      data: this.serialize(),
    } as CreateEvent);
  }

  override destroy(fromScene?: boolean): void {
    super.destroy(fromScene);

    this.room.emit('destroy', {
      id: this.id,
      type: EntityType.BULLET,
    } as DestroyEvent);
  }
}
