import styled from 'styled-components';
import { Typography } from '../../../components/Typography';
import { customColor } from '../../../constants/customColor';
import { IStateBtn } from './ReadyBtn';

const ReReady = ({ ready }: IStateBtn) => {
  const reReadyMyUser = () => {
    ready();
  };

  return (
    <Container onClick={reReadyMyUser}>
      <ResetReady color="black" size="12" fontWeight="900">
        준비 해제
      </ResetReady>
    </Container>
  );
};

export default ReReady;

const Container = styled.div``;

const ResetReady = styled(Typography)`
  display: flex;
  align-items: center;
  background-color: ${customColor.white};
  padding: 5px 15px;
  padding: 20px 88px;
  border-radius: 20px;
  height: 70px;
  width: 230px;
  &:hover {
    cursor: pointer;
  }
`;
