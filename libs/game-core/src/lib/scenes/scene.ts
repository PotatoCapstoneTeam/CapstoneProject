import { GameObjects } from 'phaser';
import { Bullet, Group, Player } from '../entities';

export class Scene extends Phaser.Scene {
  private updateList: GameObjects.GameObject[] = [];

  playerGroup!: Group<Player>;
  bulletGroup!: Group<Bullet>;

  constructor(config: string | Phaser.Types.Scenes.SettingsConfig) {
    super(config);
  }

  create() {
    this.playerGroup = new Group(this);
    this.bulletGroup = new Group(this);
  }

  override update(time: number, delta: number): void {
    super.update(time, delta);

    this.updateList.forEach((object) => object.update(time, delta));
  }

  addUpdate(object: GameObjects.GameObject) {
    this.updateList.push(object);
  }

  removeUpdate(object: GameObjects.GameObject) {
    const index = this.updateList.findIndex((value) => value === object);

    this.updateList.splice(index, 1);
  }
}
