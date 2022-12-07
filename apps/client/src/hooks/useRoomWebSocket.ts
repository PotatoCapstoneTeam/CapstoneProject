import { CompatClient, Stomp } from '@stomp/stompjs';
import { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { IInfo } from '../containers/LobbyPage/LobbyPage';
import axios from '../util/axios';

export interface ISend {
  type: 'JOIN' | 'ROOM' | 'START' | 'PLAY' | 'CHANGE' | 'EXIT' | 'READY';
  roomId: number;
  nickname: string;
}

export interface IPlayer {
  authority: string;
  email: string;
  id: number;
  modifiedDate: string;
  nickname: string;
  password: string;
  readyStatus: string;
  refreshToken: string;
  teamStatus: string;
}
export interface IPlayers {
  [key: string]: IPlayer;
}
export interface IWebSocketData {
  gameRoom: {
    createdDate: string;
    id: number;
    modifiedDate: string;
    password: string | null;
    players: IPlayers;
    roomName: string;
    roomSize: number;
    roomStatus: string;
    roomType: string;
  };
  message: any;
  type: string;
  token?: string;
  userInfo: {
    playerNumber: number;
    system: string;
    user: any;
    userStatus: any;
  };
}

const useRoomWebSocket = (roomId: string, myInfo?: IInfo) => {
  const client = useRef<CompatClient>();
  const [readyToggle, setReadyToggle] = useState(false);
  const [webSocketData, setWebSocketData] = useState<IWebSocketData[]>([]);
  useEffect(() => {
    if (!client.current && myInfo) {
      const socket = new SockJS(
        `${process.env['NX_MAIN_SERVER_URL'] ?? ''}/ws-stomp`
      );
      client.current = Stomp.over(() => {
        return socket;
      });

      client.current.connect({}, (frame: string) => {
        console.log('룸 웹소켓 연결 후 조인합니다');

        send({
          type: 'JOIN',
          roomId: Number(roomId),
          nickname: myInfo.nickname,
        });

        client.current?.subscribe(`/sub/room/${roomId}`, (res) => {
          if (res != null) {
            setWebSocketData((prev) => [...prev, JSON.parse(res.body)]);
          } else {
            console.log('none');
          }
        });

        client.current?.subscribe(`/user/sub/room/${roomId}`, (res) => {
          if (res != null) {
            setWebSocketData((prev) => [...prev, JSON.parse(res.body)]);
          } else {
            console.log('none');
          }
        });
      });
    }

    return () => {
      client.current?.disconnect(async () => {
        client.current = undefined;
        console.log('룸 웹소켓 끊어짐');
        !roomId && (await axios.post('/room/lobby/users'));
      });
    };
  }, [myInfo, roomId]);

  useEffect(() => {
    console.log(webSocketData);
  }, [webSocketData]);

  const send = (message: ISend) => {
    console.log('send');
    if (client.current?.connected) {
      client.current.send('/pub/message', {}, JSON.stringify(message));
    }
  };

  const ready = () => {
    console.log('준비합니다');
    if (roomId && myInfo) {
      setReadyToggle((prev) => !prev);
      send({
        type: 'READY',
        roomId: Number(roomId),
        nickname: myInfo.nickname,
      });
    }
  };

  const start = () => {
    console.log('시작합니다');
    if (roomId && myInfo) {
      send({
        type: 'START',
        roomId: Number(roomId),
        nickname: myInfo.nickname,
      });
    }
  };

  return { send, ready, start, webSocketData, readyToggle };
};

export default useRoomWebSocket;
