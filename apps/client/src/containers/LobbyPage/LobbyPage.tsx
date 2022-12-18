import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Space from '../../canvas/Space';
import Info from './components/Info';
import GameList from './components/GameList';
import Chat from './components/Chat';
import UserList from './components/UserList';
import Header from './components/Header';
import CreateRoomModal from './modal/CreateRoomModal';
import { axiosPrivate } from '../../util/axios';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
export interface IInfo {
  nickname: string;
  winRecord: number;
  loseRecord: number;
}
export interface IUser {
  nickname: string;
}

const LobbyPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [helperModalOpen, setHelperModalOpen] = useState(false);
  const [list, setList] = useState([]);
  const [userList, setUserList] = useState<IUser[]>([]);
  const [myInfo, setMyInfo] = useState<IInfo>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const exitScreen = (e: any) => {
    e.preventDefault();
    // 창을 나갈 때 delete요청
    axiosPrivate.delete('/room/lobby/users');
    e.returnValue = '';
  };

  // 로그인(토큰) 체크
  const loginCheck = useMutation(() => axiosPrivate.post('/auth/validate'), {
    onSuccess: (res) => {
      !res && navigate('/');
    },
    onError: (err) => console.log(err),
  });

  // 내 정보
  useQuery('myInfo', () => axiosPrivate.get('/user'), {
    onSuccess: (res) => setMyInfo(res.data),
  });

  // 게임룸 리스트
  useQuery('gameRoomList', () => axiosPrivate.get('/room'), {
    onSuccess: (res) => setList(res.data),
  });

  // 접속자 리스트에 자신 추가
  const enterUserList = useMutation(
    () => axiosPrivate.post('/room/lobby/users'),
    {
      onSuccess: () => {
        // enterUserList 성공하면 lobbyUserList api 함수를 실행
        queryClient.invalidateQueries('lobbyUserList');
      },
    }
  );

  // 접속자 리스트
  useQuery('lobbyUserList', () => axiosPrivate.get('/room/lobby/users'), {
    onSuccess: (res) => setUserList(res.data),
  });

  useEffect(() => {
    (async () => {
      window.addEventListener('unload', exitScreen);
      loginCheck.mutate();
      enterUserList.mutate();

      return () => {
        window.removeEventListener('unload', exitScreen);
      };
    })();
  }, []);

  return (
    <div>
      <Space />
      <Container>
        <Header setModalOpen={setModalOpen} setHelperModalOpen={setHelperModalOpen}/>
        <ContentBox>
          <BackgroundBox />
          <Info {...myInfo!} />
          <GameList list={list || []} />
          <Chat {...myInfo!} />
          <UserList userList={userList || []} />
        </ContentBox>
      </Container>
      {modalOpen && <CreateRoomModal setModalOpen={setModalOpen} />} 
      {helperModalOpen && <HelperModal setHelperModalOpen={setHelperModalOpen} />}
    </div>
  );
};

export default LobbyPage;

const BackgroundBox = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(198, 198, 198, 1);
  opacity: 0.7;
  border-radius: 10px;
`;

const ContentBox = styled.div`
  position: relative;
  width: 100%;
  height: 592px;
  border-radius: 10px;
  display: flex;
  flex-wrap: wrap;
`;

const Container = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 1200px;
  height: 640px;
`;
