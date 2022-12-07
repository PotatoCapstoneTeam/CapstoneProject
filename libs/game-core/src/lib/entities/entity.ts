import { Value } from '@geckos.io/snapshot-interpolation/lib/types';
import { Textures, Physics } from 'phaser';
import { Scene } from '../scenes/scene';

export enum EntityType {
  PLAYER,
  BULLET,
}

export type EntityData = {
  id: string;
  [key: string]: Value;
};

export abstract class Entity extends Physics.Arcade.Sprite {
  constructor(
    public id: string,
    scene: Scene,
    x: number,
    y: number,
    texture: string | Textures.Texture = ''
  ) {
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);
    scene.addUpdate(this);
  }

  override destroy(fromScene?: boolean | undefined): void {
    if (this.scene instanceof Scene) {
      this.scene.removeUpdate(this);
    }

    super.destroy(fromScene);
  }

  override update(time: number, delta: number): void {
    super.update(time, delta);
  }

  abstract serialize(): EntityData;

  abstract deserialize(data: EntityData): void;
}
