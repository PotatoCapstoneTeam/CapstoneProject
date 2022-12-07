import { Scene } from '../scenes/scene';
import { Entity, EntityData } from './entity';

export class Bullet extends Entity {
  lifeTime = 400;

  constructor(
    id: string,
    scene: Scene,
    x: number,
    y: number,
    public source: Entity,
    public damage: number,
    public speed: number,
    angle: number,
    texture = ''
  ) {
    super(id, scene, x, y, texture);

    this.scene.physics.velocityFromAngle(angle, speed, this.body.velocity);
    this.angle = angle;
  }

  override update(time: number, delta: number): void {
    this.lifeTime -= delta;

    if (this.lifeTime <= 0) {
      this.destroy();
    }
  }

  serialize(): EntityData {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      source: this.source,
      damage: this.damage,
      speed: this.speed,
      angle: this.angle,
    };
  }

  deserialize(data: EntityData) {
    const scene = this.scene as Scene;

    this.x = +(data['x'] ?? this.x);
    this.y = +(data['y'] ?? this.y);
    this.source =
      scene.playerGroup.find((data['source'] as string) ?? '') ?? this.source;
    this.damage = +(data['damage'] ?? this.damage);
    this.speed = +(data['speed'] ?? this.speed);
    this.angle = +(data['angle'] ?? this.angle);
  }
}
