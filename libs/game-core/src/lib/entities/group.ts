import { Entity } from './entity';
import { Scene } from '@stellon/game-core';
import { Physics } from 'phaser';

export class Group<T extends Entity> extends Physics.Arcade.Group {
  private map = new Map<string, T>();

  constructor(scene: Scene) {
    super(scene.physics.world, scene);

    scene.add.existing(this);
  }

  override add(child: T, addToScene?: boolean): this {
    this.map.set(child.id, child);
    super.add(child, addToScene);

    return this;
  }

  override remove(
    child: T,
    removeFromScene?: boolean,
    destroyChild?: boolean
  ): this {
    this.map.delete(child.id);
    super.remove(child, removeFromScene, destroyChild);

    return this;
  }

  find(id: string) {
    return this.map.get(id);
  }

  forEach(callbackfn: (value: T, key: string, map: Map<string, T>) => void) {
    this.map.forEach(callbackfn);
  }
}
