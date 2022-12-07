import geckos, { GeckosServer } from '@geckos.io/server';
import { ClientEventMap, ServerEventMap, Team } from '@stellon/game-core';
import http from 'http';
import jwt, { JwtPayload } from 'jsonwebtoken';

export type ServerEmit = <K extends keyof ServerEventMap>(
  name: K,
  event: ServerEventMap[K]
) => void;

export type ServerRoom = {
  emit: ServerEmit;
};

export type ServerChannel = {
  id: number;
  nickname: string;
  team: Team;
  stageId: string;
  emit: ServerEmit;
  on: <K extends keyof ClientEventMap>(
    name: K,
    callback: (event: ClientEventMap[K]) => void
  ) => void;
};

export class ServerSocket {
  io?: GeckosServer;

  constructor(server: http.Server, callback: (channel: ServerChannel) => void) {
    this.io = geckos({
      authorization: async (auth) => {
        if (!auth) {
          return false;
        }

        try {
          if (process.env['JWT_PRIVATE_KEY'] === undefined) {
            throw '환경변수가 설정되지 않음';
          }

          const decoded = jwt.verify(
            auth,
            process.env['JWT_PRIVATE_KEY']
          ) as JwtPayload;

          return {
            id: decoded['id'],
            nickname: decoded['nickname'],
            team: decoded['team'],
            stageId: decoded['stageId'],
          };
        } catch (error) {
          return false;
        }
      },
      cors: { origin: '*', allowAuthorization: true },
    });

    this.io.addServer(server);

    this.io.onConnection((channel) => {
      channel.join(channel.userData.stageId);

      callback({
        id: channel.userData.id,
        nickname: channel.userData.nickname,
        team: channel.userData.team,
        stageId: channel.userData.stageId,
        emit(name, event) {
          channel.emit(name, event);
        },
        on(name, callback) {
          channel.on(name, callback as any);
        },
      });
    });
  }

  emit<K extends keyof ServerEventMap>(name: K, event: ServerEventMap[K]) {
    this.io?.emit(name, event);
  }

  room(stageId: string): ServerRoom {
    return {
      emit: (name, event) => {
        this.io?.room(stageId).emit(name, event);
      },
    };
  }
}
