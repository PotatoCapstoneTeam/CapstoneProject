import styled from 'styled-components';
import { Typography } from '../../../components/Typography';

interface IInfo {
  entire?: number;
  now: number;
}

export const Info = ({ entire, now }: IInfo) => {
  return (
    <InfoRoom>
      <People>
        <PeopleImg src="../assets/GameRoomPeople.png"></PeopleImg>
        <NumberOfPeople size="16" color="black" fontWeight="900">
          {entire} / {now}
        </NumberOfPeople>
      </People>
      <Tools>
        <SettingImg src="../assets/GameRoomSetting.png"></SettingImg>
        <HelpImg src="../assets/GameRoomHelper.png"></HelpImg>
      </Tools>
    </InfoRoom>
  );
};

export default Info;
const NumberOfPeople = styled(Typography)``;
const PeopleImg = styled.img`
  margin-right: 8px;
  width: 20px;
  height: 20px;
`;
const SettingImg = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 8px;
  &:hover {
    cursor: pointer;
  }
`;
const HelpImg = styled.img`
  margin-right: 8px;
  width: 24px;
  height: 24px;
  &:hover {
    cursor: pointer;
  }
`;
const Tools = styled.div`
  display: flex;
  margin-left: 16px;
`;
const People = styled.div`
  display: flex;
  padding: 4px 16px 4px 0;
  border-right: 2px solid black;
  align-items: center;
`;
const InfoRoom = styled.div`
  display: flex;
  z-index: 99;
  align-items: center;
`;
