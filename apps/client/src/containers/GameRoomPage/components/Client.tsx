import { IPlayer } from '../../../hooks/useRoomWebSocket';
import styled from 'styled-components';
import UserCard from './UserCard';

interface IClient {
  list: IPlayer[];
}

export const Client = ({ list }: IClient) => {
  return (
    <UserBox>
      {list &&
        list.map((e: IPlayer, i: number) => (
          <UserCard state={e['readyStatus']} nickname={e['nickname']} key={i} />
        ))}
    </UserBox>
  );
};

export default Client;

const UserBox = styled.div`
  width: 836px;
  height: 380px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: center;
  margin: 12px 0;
`;
