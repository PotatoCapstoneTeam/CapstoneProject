import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Space from '../../canvas/Space';
import Info from './components/Info';
import GameList from './components/GameList';
import Chat from './components/Chat';
import UserList from './components/UserList';
import Header from './components/Header';
import CreateRoomModal from './modal/CreateRoomModal';
import axios from '../../util/axios';
import HelperModal from './modal/HelperModal';

import { useNavigate } from 'react-router-dom';
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

  const exitScreen = (e: any) => {
    e.preventDefault();
    axios.delete('/room/lobby/users');
    e.returnValue = '';
  };

  useEffect(() => {
    (async () => {
      window.addEventListener('unload', exitScreen);

      const res = await axios.post('/auth/validate');
      if (!res) navigate('/');
      const myInfo = await axios.get('/user');
      const watchRoom = await axios.get('/room');
      await axios.post('/room/lobby/users');
      const watchUserList = await axios.get('/room/lobby/users');
      setUserList(watchUserList.data);
      setList(watchRoom.data);
      setMyInfo(myInfo.data);

      return () => {
        window.removeEventListener('unload', exitScreen);
      };
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <Space />
      <Container>
        <Header setModalOpen={setModalOpen} setHelperModalOpen={setHelperModalOpen}/>
        <ContentBox>
          <BackgroundBox />
          <Info {...myInfo!} />
          <GameList list={list} />
          <Chat {...myInfo!} />
          <UserList userList={userList} />
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
