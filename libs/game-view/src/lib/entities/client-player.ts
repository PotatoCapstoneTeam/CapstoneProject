import { GameObjects } from 'phaser';
import { Player, Scene, EntityData, Team } from '@stellon/game-core';
import { ClientScene } from '../scenes/client-scene';
import { State } from '@geckos.io/snapshot-interpolation/lib/types';

export interface IClientEntity {
  updateFromServer(state: State, time: number, delta: number): void;
}

export class ClientPlayer extends Player {
  playerLabel: GameObjects.Text;
  hpLabel: GameObjects.Text;

  constructor(scene: Scene, data: EntityData) {
    const team = data['team'] === 'RED_TEAM' ? 'RED_TEAM' : 'BLUE_TEAM';

    super(
      data.id,
      scene,
      +(data['x'] ?? 0),
      +(data['y'] ?? 0),
      data['nickname'] + '',
      team,
      team === 'RED_TEAM' ? 'redPlayer' : 'bluePlayer'
    );

    this.scale = 2;

    this.playerLabel = new GameObjects.Text(
      scene,
      this.x,
      this.y,
      data['nickname'] + '',
      {
        fontSize: '12',
        align: 'center',
      }
    );
    this.playerLabel.setDisplayOrigin(0, -20);
    scene.add.existing(this.playerLabel);

    this.hpLabel = new GameObjects.Text(scene, this.x, this.y, this.hp + '', {
      fontSize: '12',
      align: 'center',
    });
    this.hpLabel.setDisplayOrigin(0, 20);
    scene.add.existing(this.hpLabel);
  }

  override update(time: number, delta: number): void {
    super.update(time, delta);

    (this.scene as ClientScene).si.calcInterpolation('x y', 'players');

    // this.setVelocity(0, 0);
    // this.setAngularVelocity(0);

    // if (this.scene.input.keyboard.checkDown(this.keys.fire, 250)) {
    //   new ClientBullet(this.scene as Scene, this.x, this.y, 1000, this.angle);
    // }

    this.playerLabel.setPosition(this.x, this.y);

    this.hpLabel.text = this.hp + '';
    this.hpLabel.setPosition(this.x, this.y);
  }
}
