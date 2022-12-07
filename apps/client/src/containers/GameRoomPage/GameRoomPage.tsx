import axios from '../../util/axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import ChatRoom from '../../components/ChatRoom';
import useRoomWebSocket, {
  IPlayer,
  IWebSocketData,
} from '../../hooks/useRoomWebSocket';
import { Map, Title, Info, Client, State } from './components/index';
import { GameView } from '@stellon/game-view';
import Space from '../../canvas/Space';

interface IInfo {
  nickname: string;
  winRecord: number;
  loseRecord: number;
}

const GameRoomPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [myInfo, setMyInfo] = useState<IInfo>();
  const { ready, start, webSocketData, readyToggle } = useRoomWebSocket(
    id as string,
    myInfo
  );

  // 웹 소켓 데이터 가공
  const [playerList, setPlayerList] = useState<IPlayer[]>([]);
  const [nowPlayer, setNowPlayer] = useState(0);
  const [gameRoom, setGameRoom] = useState<IWebSocketData['gameRoom']>();
  const [gameServerToken, setGameServerToken] = useState<string>(); // 게임 서버에서 발급한 토큰

  useEffect(() => {
    if (webSocketData.length === 0) return;
    const wsLastData = webSocketData[webSocketData.length - 1];
    if (!Object.keys(wsLastData).includes('gameRoom')) return;

    setPlayerList(Object.values(wsLastData.gameRoom.players));
    setNowPlayer(Object.keys(wsLastData.gameRoom.players).length);
    setGameRoom(webSocketData[0].gameRoom);
    if (wsLastData.token) setGameServerToken(wsLastData.token);
  }, [webSocketData]);

  useEffect(() => {
    console.log('리스트 값', playerList);
  }, [playerList]);

  useEffect(() => {
    console.log('토큰 값', gameServerToken);
  }, [gameServerToken]);

  /////////////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    (async () => {
      await axios.delete('/room/lobby/users');
      const myInfo = await axios.get('/user');
      setMyInfo(myInfo.data);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log(webSocketData);
  }, [webSocketData]);

  const onEnd = () => {
    console.log('게임이 끝남');
    ready();
    setGameServerToken(undefined);
  };
  return (
    <div>
      {!gameServerToken && <Space />}
      <Container token={gameServerToken}>
        <BackgroundBox />
        <Header>
          <Title name={gameRoom?.roomName} id={gameRoom?.id} />
          <Info entire={gameRoom?.roomSize} now={nowPlayer} />
        </Header>
        <Article>
          <Client list={playerList} />
          <Map />
          <ChatRoom state="chatRoom" roomId={id} nickname={myInfo?.nickname} />
          <State ready={ready} start={start} readyToggle={readyToggle} />
        </Article>
      </Container>
      {gameServerToken && (
        <GameView
          url={process.env['NX_STAGE_SERVER_URL'] ?? ''}
          token={gameServerToken}
          onEnd={onEnd}
        />
      )}
    </div>
  );
};

export default GameRoomPage;

const Article = styled.article`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const Header = styled.header`
  width: 100%;
  padding: 0 5px;
  height: 8%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 99;
  position: relative;
  border-bottom: 2px solid black;
`;
const Container = styled.div<{ token: string | undefined }>`
  opacity: ${({ token }) => (token ? 0 : 1)};
  position: absolute;
  top: 50%;
  left: 50%;
  padding: 0 16px;
  transform: translate(-50%, -50%);
  width: 1200px;
  height: 640px;
`;
const BackgroundBox = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: 10px;
  border-radius: 10px;
`;
