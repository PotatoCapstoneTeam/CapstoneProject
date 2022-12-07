import styled from 'styled-components';
import { Typography } from '../../../components/Typography';
import { customColor } from '../../../constants/customColor';

export interface IStateBtn {
  ready: () => void;
}

const ReadyBtn = ({ ready }: IStateBtn) => {
  const readyMyUser = () => {
    ready();
  };

  return (
    <Container onClick={readyMyUser}>
      <Ready color="black" size="24" fontWeight="900">
        준비
      </Ready>
    </Container>
  );
};

export default ReadyBtn;
const Container = styled.div``;
const Ready = styled(Typography)`
  background-color: ${customColor.white};
  padding: 20px 88px;
  border-radius: 20px;
  height: 70px;
  width: 230px;
  align-items: center;
  justify-content: center;
  display: flex;
  &:hover {
    cursor: pointer;
  }
`;
