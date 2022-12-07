import { useEffect, useRef } from 'react';
import { ClientScene } from './scenes/client-scene';
import { geckos } from '@geckos.io/client';
import { ClientSocket } from './client-socket';

export interface GameViewProps {
  url: string;
  token: string;
  onEnd: () => void;
}

export const GameView = (props: GameViewProps) => {
  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const parent = parentRef.current;

    if (!parent) {
      return;
    }

    const socket = new ClientSocket(props.url, props.token);

    let game: Phaser.Game;

    socket.connect().then(() => {
      game = new Phaser.Game({
        antialias: false,
        parent: parent,
        backgroundColor: '#212123',
        physics: {
          default: 'arcade',
          arcade: {
            debug: false,
            gravity: { y: 0 },
          },
        },
        scene: [new ClientScene(socket)],
      });
    });

    return () => {
      socket.close();
      game.destroy(true);
    };
  }, [props.token, props.url]);

  return <div ref={parentRef}></div>;
};
