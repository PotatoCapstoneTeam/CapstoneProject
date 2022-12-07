import React from 'react';
import styled from 'styled-components';
import Tool from './Tool';
import MakeRoom from './MakeRoom';
import GameStart from './GameStart';

interface IHeader {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  setHelperModalOpen : React.Dispatch<React.SetStateAction<boolean>>
}

const Header = ({ setModalOpen, setHelperModalOpen }: IHeader) => {
  return (
    <Container>
      <Tool setHelperModalOpen={setHelperModalOpen}/>
      <Menu>
        <MakeRoom setModalOpen={setModalOpen} />
        <GameStart />
      </Menu>
    </Container>
  );
};

export default Header;

const Menu = styled.div`
  display: flex;
  align-items: baseline;
`;

const Container = styled.header`
  justify-content: space-between;
  display: flex;
  width: 100%;
  align-items: baseline;
  height: 47px;
`;
