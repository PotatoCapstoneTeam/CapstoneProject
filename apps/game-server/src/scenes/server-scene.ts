import { SnapshotInterpolation } from '@geckos.io/snapshot-interpolation';
import { State } from '@geckos.io/snapshot-interpolation/lib/types';
import { EntityData, EntityType, Scene } from '@stellon/game-core';
import cuid from 'cuid';
import { User } from '../api';
import { ServerBullet } from '../entities/server-bullet';
import { ServerPlayer } from '../entities/server-player';
import { ClientManager } from '../managers/client-manager';
import { ServerRoom, ServerChannel } from '../server-socket';

export class ServerScene extends Scene {
  clientManager = new ClientManager();
  si = new SnapshotInterpolation();

  onCreate?: VoidFunction;

  constructor(public room: ServerRoom, public users: User[]) {
    super({ key: 'mainScene' });
  }

  override async create() {
    super.create();

    this.users.forEach((user) => {
      const playerId = cuid();

      const player = new ServerPlayer(
        playerId,
        this,
        200,
        200,
        user.nickname,
        user.team,
        this.clientManager.getClient(user.id),
        user.id
      );

      // 그룹을 ServerPlayer.group으로 바꾸고 생성자에 숨기자
      this.playerGroup.add(player);
    });

    this.physics.add.overlap(
      this.playerGroup,
      this.bulletGroup,
      (player, bullet) => {
        const p = player as ServerPlayer;
        const b = bullet as ServerBullet;

        if (p.id === b.source.id) {
          return;
        }

        p.hp -= b.damage;

        bullet.destroy();
      }
    );

    this.onCreate?.();
  }

  // 무조건 create 뒤에 실행 됨.
  connection(channel: ServerChannel) {
    channel.on('join', (event) => {
      console.log(
        `'${channel.nickname}'님이 ${channel.stageId}로 접속했습니다.`
      );

      const entities: {
        type: EntityType;
        data: EntityData;
      }[] = [];

      let playerId = '';

      this.playerGroup.forEach((player) => {
        entities.push({
          type: EntityType.PLAYER,
          data: player.serialize(),
        });

        if ((player as ServerPlayer).userId === channel.id) {
          playerId = player.id;
        }
      });

      this.bulletGroup.forEach((bullet) => {
        entities.push({
          type: EntityType.BULLET,
          data: bullet.serialize(),
        });
      });

      channel.emit('welcome', {
        playerId,
        entities,
      });
    });

    channel.on('input', (event) => {
      const client = this.clientManager.getClient(channel.id);

      client.horizontalAxis = event.horizontalAxis;
      client.verticalAxis = event.verticalAxis;
      client.fire = event.fire;
    });
  }

  override update(time: number, delta: number): void {
    super.update(time, delta);

    const worldState = {
      players: [] as State,
    };

    this.playerGroup.forEach((player) => {
      worldState.players.push(player.serialize());
    });

    const snapshot = this.si.snapshot.create(worldState);

    this.room.emit('update', { snapshot });
  }
}
