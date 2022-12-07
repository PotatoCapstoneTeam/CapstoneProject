import { Team } from '..';
import { Scene } from '../scenes/scene';
import { Entity, EntityData } from './entity';

export class Player extends Entity {
  speed = 10;
  angularSpeed = 10;
  hp = 1000;
  fireDelay = 1000;

  constructor(
    id: string,
    scene: Scene,
    x: number,
    y: number,
    public nickname: string,
    public team: Team,
    texture = ''
  ) {
    super(id, scene, x, y, texture);
  }

  serialize(): EntityData {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      angle: this.angle,
      nickname: this.nickname,
      team: this.team,
      speed: this.speed,
      angularSpeed: this.angularSpeed,
      hp: this.hp,
    };
  }

  deserialize(data: EntityData) {
    this.x = +(data['x'] ?? this.x);
    this.y = +(data['y'] ?? this.y);
    this.angle = +(data['angle'] ?? this.angle);
    this.nickname = data['nickname'] + '';
    this.team = data['team'] === 'RED_TEAM' ? 'RED_TEAM' : 'BLUE_TEAM';
    this.speed = +(data['speed'] ?? this.speed);
    this.angularSpeed = +(data['angularSpeed'] ?? this.angularSpeed);
    this.hp = +(data['hp'] ?? this.hp);
  }
}
