import { Snapshot } from '@geckos.io/snapshot-interpolation/lib/types';
import { EntityData, EntityType } from './entities';

export * from './entities';
export * from './scenes';

export const SERVER_FPS = 30;

export type Team = 'RED_TEAM' | 'BLUE_TEAM';

// Client Event

export type JoinEvent = {
  //
};

export type InputEvent = {
  horizontalAxis: number;
  verticalAxis: number;
  fire: boolean;
};

export type ClientEventMap = {
  join: JoinEvent;
  input: InputEvent;
};

// Server Event

export type WelcomeEvent = {
  playerId: string;
  entities: { type: EntityType; data: EntityData }[];
};

export type CreateEvent = {
  type: EntityType;
  data: EntityData;
};

export type UpdateEvent = {
  snapshot: Snapshot;
};

export type DestroyEvent = {
  id: string;
  type: EntityType;
};

export type ServerEventMap = {
  welcome: WelcomeEvent;
  create: CreateEvent;
  update: UpdateEvent;
  destroy: DestroyEvent;
};
