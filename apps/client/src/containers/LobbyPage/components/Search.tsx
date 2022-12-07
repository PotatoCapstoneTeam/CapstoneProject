import styled from 'styled-components';
import { Typography } from '../../../components/Typography';

const Search = () => {
  return (
    <SearchGameList>
      <RangeBtn>
        <RangeImg src="../assets/range.png" alt="none" />
        <Typography color="black" size="16">
          정렬
        </Typography>
      </RangeBtn>
      <RefreshBtn onClick={() => window.location.reload()}>
        <RefreshImg src="../assets/refresh.png" alt="none" />
        <Typography color="black" size="16">
          새로고침
        </Typography>
      </RefreshBtn>
    </SearchGameList>
  );
};

export default Search;
const SearchGameList = styled.div`
  align-items: center;
  display: flex;
`;
const RangeBtn = styled.div`
  align-items: center;
  display: flex;
  &:hover {
    cursor: pointer;
  }
`;

const RefreshBtn = styled.div`
  align-items: center;
  display: flex;
  margin-left: 16px;
  &:hover {
    cursor: pointer;
  }
`;
const RefreshImg = styled.img`
  margin-right: 4px;
  width: 16px;
  height: 16px;
`;

const RangeImg = styled.img`
  margin-right: 4px;
  width: 16px;
  height: 16px;
`;
