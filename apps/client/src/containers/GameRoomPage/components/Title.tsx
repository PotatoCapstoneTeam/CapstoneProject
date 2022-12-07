import { Typography } from '../../../components/Typography';
import styled from 'styled-components';

interface ITitle {
  name?: string;
  id?: number;
}

export const Title = ({ name, id }: ITitle) => {
  return (
    <Theme>
      <RoomNumber size="16" color="black" fontWeight="900">
        {id}번 방
      </RoomNumber>
      <RoomName size="16" color="black" fontWeight="900">
        {name}
      </RoomName>
    </Theme>
  );
};

export default Title;
const RoomName = styled(Typography)`
  padding-left: 28px;
`;
const RoomNumber = styled(Typography)`
  border-right: 2px solid black;
  padding: 4px 28px;
`;
const Theme = styled.div`
  display: flex;
  z-index: 99;
  align-items: center;
`;
