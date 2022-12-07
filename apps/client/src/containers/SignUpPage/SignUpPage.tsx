import styled, { css, keyframes } from 'styled-components';
import Space from '../../canvas/Space';
import { Typography } from '../../components/Typography';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useForm, SubmitHandler } from 'react-hook-form';

interface IFormInput {
  email: string;
  nickname: string;
  password: string;
  passwordCheck: string;
}

const SignUp = () => {
  const [loginHover, setLoginHover] = useState(false);

  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm<IFormInput>();

  const passwordRef = useRef<string | null>(null);
  passwordRef.current = watch('password');

  const onSubmit: SubmitHandler<IFormInput> = async (data, events) => {
    console.log(data);
    events?.preventDefault();

    try {
      const res = await axios.post(
        `${process.env['NX_MAIN_SERVER_URL'] ?? ''}/auth/join`,
        {
          email: formRef.current?.['email'].value,
          nickname: formRef.current?.['nickname'].value,
          password: formRef.current?.['password'].value,
        }
      );
      console.log(res.data);
      navigate('/');
    } catch (err: any) {
      console.log(err);
      alert(err.response.data.error);
    }
  };

  return (
    <>
      <Space />
      <Wrapper>
        <SignUpImg src="../assets/signup.png" alt="none" />
        <SignUpForm ref={formRef} onSubmit={handleSubmit(onSubmit)}>
          <SignUpBox>
            <EmailBox>
              <NewTypography color="white" size="24">
                Email
              </NewTypography>
              <EmailInput
                {...register('email', {
                  required: '이메일을 입력해주세요',
                  pattern: {
                    value:
                      /^[A-Za-z0-9_]+[A-Za-z0-9]*[@]{1}[A-Za-z0-9]+[A-Za-z0-9]*[.]{1}[A-Za-z]{1,3}$/,
                    message: ' 이메일 형식이 올바르지 않습니다',
                  },
                })}
                placeholder="이메일을 입력해주세요"
                name="email"
              />
            </EmailBox>
            {errors.email && <Message>{errors.email.message}</Message>}

            <NameBox>
              <NewTypography color="white" size="24">
                Name
              </NewTypography>
              <NameInput
                {...register('nickname', {
                  required: '닉네임을 입력해주세요',
                  maxLength: {
                    value: 8,
                    message: '닉네임은 8글자 이하로 설정해주세요',
                  },
                  minLength: {
                    value: 2,
                    message: '닉네임은 2글자 이상으로 설정해주세요',
                  },
                })}
                placeholder="닉네임을 입력해주세요"
                name="nickname"
              />
            </NameBox>
            {errors.nickname && <Message>{errors.nickname.message}</Message>}

            <PwBox>
              <NewTypography color="white" size="24">
                PassWord
              </NewTypography>
              <PwInput
                {...register('password', {
                  required: '비밀번호를 입력해주세요',

                  pattern: {
                    value:
                      /^(?=.*[a-zA-Z])(?=.*[.!@#$%^*+=-])(?=.*[0-9]).{6,25}$/,
                    message:
                      '숫자+영문자+특수문자 조합으로 6자리 이상 입력해주세요',
                  },
                })}
                placeholder="비밀번호를 입력해주세요"
                type="password"
                name="password"
              />
            </PwBox>
            {errors.password && <Message>{errors.password.message}</Message>}

            <PwChkBox>
              <NewTypography color="white" size="24">
                PW Check
              </NewTypography>
              <PwChkInput
                {...register('passwordCheck', {
                  required: '비밀번호를 확인해주세요',
                  validate: (value) => value === passwordRef.current,
                })}
                type="password"
                placeholder="비밀번호를 확인해주세요"
                name="passwordCheck"
              />
            </PwChkBox>
            {errors.passwordCheck &&
              errors.passwordCheck.type === 'validate' && (
                <Message>비밀번호가 일치하지않습니다</Message>
              )}
          </SignUpBox>
          <BtnBox>
            <LoginBtn
              type="submit"
              onMouseOver={() => {
                setLoginHover(true);
              }}
              onMouseOut={() => {
                setLoginHover(false);
              }}
            >
              <BtnTypography size="60" color="white">
                Let's GO!
              </BtnTypography>

              <LoginImg
                src="../assets/redFighter.png"
                alt="none"
                hover={loginHover}
              />
            </LoginBtn>
          </BtnBox>
        </SignUpForm>
      </Wrapper>
    </>
  );
};

export default SignUp;

const Wrapper = styled.div`
  position: absolute;
  width: 500x;
  height: 400px;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
`;
const NewTypography = styled(Typography)`
  position: relative;
  width: 200px;
  text-align: center;
  line-height: 32px;
`;

const SignUpBox = styled.div`
  position: absolute;
  width: 400px;
  align-items: center;
  left: 50px;
`;

const EmailBox = styled.div`
  display: flex;
  margin-bottom: 10px;
  height: 36px;
  align-items: center;
`;

const NameBox = styled.div`
  display: flex;
  height: 36px;
  margin-bottom: 10px;
  align-items: center;
`;
const PwBox = styled.div`
  display: flex;
  height: 36px;
  margin-bottom: 10px;
  align-items: center;
`;
const PwChkBox = styled.div`
  display: flex;
  height: 36px;
  margin-bottom: 10px;
  align-items: center;
`;

const Input = styled.input`
  width: 400px;
  height: 32px;

  border-radius: 10px;
`;

const EmailInput = styled(Input)``;

const NameInput = styled(Input)``;

const PwChkInput = styled(Input)``;

const PwInput = styled(Input)``;

const SignUpImg = styled.img`
  width: 100%;
  height: 67px;
  margin-bottom: 50px;
`;

const BtnTypography = styled(Typography)`
  line-height: 50px;
`;

const LoginBtn = styled.button`
  border: 0;
  background-color: transparent;
  outline: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  &:hover {
    cursor: pointer;
  }
`;
const Img = styled.img<{ hover: boolean }>`
  position: relative;
  width: 32px;
  height: 32px;
  margin-left: 12px;
`;

const LoginImg = styled(Img)<{ hover: boolean }>`
  ${(props) => props.hover && Animate};
`;

const hoverBtn = keyframes`
  0%{
    left: 2px;
  }
  25%{
    left : 4px
  }
  50%{
    left: 8px;
  }
   75%{
    left : 16px
  }

  100%{
    left: 32px;
  }
`;

const Animate = css`
  animation: ${hoverBtn} 1s linear 0.1s infinite;
`;

const SignUpForm = styled.form``;

const Message = styled.p`
  position: relative;
  left: 100px;
  color: red;
`;
const BtnBox = styled.div`
  position: relative;
  flex-direction: column;
  top: 300px;
  left: 110px;
`;
