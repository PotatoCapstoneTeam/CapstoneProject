import { Bullet, Entity, Scene } from '@stellon/game-core';

export class ClientBullet extends Bullet {
  constructor(
    id: string,
    scene: Scene,
    x: number,
    y: number,
    source: Entity,
    damage: number,
    speed: number,
    angle: number
  ) {
    super(id, scene, x, y, source, damage, speed, angle, 'bullet');
  }
}
