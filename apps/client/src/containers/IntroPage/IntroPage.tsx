import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useCookies } from 'react-cookie';
import { Typography } from '../../components/Typography';
import SignUpButton from './components/SignUpButton';
import LoginButton from './components/LoginButton';
import { loginApi } from '../../api/loginApi';
import Space from '../../canvas/Space';
import axios from '../../util/axios';
import { getCookie } from '../../util/cookies';

const IntroPage = () => {
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);
  const [cookies, setCookie] = useCookies([
    'user_access_token',
    'user_refresh_token',
  ]); // 쿠키 훅

  const loginHandleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await loginApi.login({
        email: formRef.current?.['email'].value,
        password: formRef.current?.['password'].value,
      });
      console.log(res.data);
      setCookie('user_access_token', res.data.response.accessToken); // 쿠키에 access 토큰 저장
      setCookie('user_refresh_token', res.data.response.refreshToken); // 쿠키에 refresh 토큰 저장
      navigate('/lobby');
    } catch (err) {
      console.log(err);
      alert('회원정보가 없습니다.');
    }
  };

  useEffect(() => {
    if (
      getCookie('user_access_token') !== '' &&
      getCookie('user_access_token') !== 'undefined'
    ) {
      console.log(getCookie('user_access_token'));
      navigate('/lobby');
    }
  }, []);

  return (
    <div>
      <Space />
      <Container>
        <IntroImg src="../assets/logo.svg" alt="none" />
        <LoginForm ref={formRef} onSubmit={loginHandleSubmit}>
          <LoginBox>
            <IdBox>
              <NewTypography color="white" size="24">
                ID
              </NewTypography>
              <IdInput type="text" name="email" placeholder="email" />
            </IdBox>
            <PwBox>
              <NewTypography color="white" size="24">
                PW
              </NewTypography>
              <PwInput type="password" name="password" placeholder="password" />
            </PwBox>
          </LoginBox>
          <BtnBox>
            <SignUpButton />
            <LoginButton />
          </BtnBox>
        </LoginForm>
      </Container>
    </div>
  );
};

export default IntroPage;

const BtnBox = styled.div`
  display: flex;
  flex-direction: column;
`;

const LoginBox = styled.div`
  width: 280px;
  align-items: center;
`;

const Input = styled.input`
  width: 240px;
  height: 32px;
  margin-left: 10px;
  border-radius: 10px;
`;
const IdInput = styled(Input)``;

const PwInput = styled(Input)``;

const IdBox = styled.div`
  display: flex;
  margin-bottom: 10px;
  height: 36px;
  align-items: center;
`;

const PwBox = styled.div`
  display: flex;
  height: 36px;
  align-items: center;
`;

const Container = styled.div`
  width: 450px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const LoginForm = styled.form`
  display: flex;
  justify-content: space-between;
`;

const IntroImg = styled.img`
  width: 100%;
  height: 70px;
  margin-bottom: 20px;
`;

const NewTypography = styled(Typography)`
  width: 48px;
  text-align: center;
  line-height: 32px;
`;
