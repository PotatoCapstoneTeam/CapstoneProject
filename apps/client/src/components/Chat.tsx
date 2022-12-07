import React from 'react';
import styled from 'styled-components';
import { IChat } from './ChatRoom';
import { Typography } from './Typography';

const Chat = ({ nickname, message }: IChat) => {
  return (
    <ChatBox size="12" color="black">
      {(nickname || 'System') + ' : ' + message}
    </ChatBox>
  );
};

export default React.memo(Chat);

const ChatBox = styled(Typography)`
  width: 97%;
  padding: 8px 6px;
  border-bottom: 0.8px solid black;
  margin: 0 auto;
`;
