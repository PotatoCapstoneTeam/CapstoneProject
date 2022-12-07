import React from 'react';
import styled from 'styled-components';
import { useState } from 'react';


interface ITool {
  setHelperModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Tool = ({ setHelperModalOpen }: ITool) => {
 

  return (
    <Tools>
      <SettingBtn  src="../assets/setting.png" alt="none"></SettingBtn>
     
      <HelperBtn  onClick={() => {
         setHelperModalOpen(true);
        }} src="../assets/help.png" alt="none"></HelperBtn>
    </Tools>
  );
};

export default Tool;
const HelperBtn = styled.img`
  &:hover {
    cursor: pointer;
  }
`;
const SettingBtn = styled.img`
  margin-right: 15px;
  &:hover {
    cursor: pointer;
  }
`;
const Tools = styled.div`
  height: 100%;
`;
