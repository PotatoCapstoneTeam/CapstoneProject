import { Player, Scene, Team } from '@stellon/game-core';
import { ClientState } from '../managers/client-manager';
import { ServerBullet } from './server-bullet';
import { ServerScene } from '../scenes/server-scene';

export class ServerPlayer extends Player {
  constructor(
    id: string,
    scene: Scene,
    x: number,
    y: number,
    nickname: string,
    team: Team,
    public client: ClientState,
    public userId: number
  ) {
    super(id, scene, x, y, nickname, team, 'LIVE');

    this.onDeath = (entity) => {
      const player = entity as ServerPlayer;

      player.status = 'DEATH';

      setTimeout(() => {
        player.status = 'LIVE';
        player.hp = 200;

        if (player.team === 'RED_TEAM') {
          player.setX(150);
          player.setY(320);
          player.setAngle(0);
        } else {
          player.setX(1050);
          player.setY(320);
          player.setAngle(180);
        }
      }, 3000);
    };
  }

  override update(time: number, delta: number): void {
    super.update(time, delta);

    this.setVelocity(0, 0);
    this.setAngularVelocity(0);

    this.setAngularVelocity(
      this.client.horizontalAxis * this.angularSpeed * delta
    );

    this.scene.physics.velocityFromAngle(
      this.angle,
      this.client.verticalAxis * this.speed * delta,
      this.body.velocity
    );

    if (this.client.fire) {
      const scene = this.scene as ServerScene;

      const bullet = new ServerBullet(
        this.scene as ServerScene,
        this.x,
        this.y,
        this,
        10,
        1000,
        this.angle
      );

      scene.bulletGroup.add(bullet);

      this.scene.physics.velocityFromAngle(
        this.angle,
        1000,
        bullet.body.velocity
      );
      bullet.angle = this.angle;
    }
  }
}
