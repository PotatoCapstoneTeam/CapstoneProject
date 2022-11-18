import { useCookies } from 'react-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const useApi = () => {
  const [cookies, setCookie, removeCookie] = useCookies([
    'user_access_token',
    'user_refresh_token',
  ]); // 쿠키 훅
  const navigate = useNavigate();

  // 페이지 접속 시 토큰 확인 POST
  const loginCheck = async () => {
    const accessToken = cookies['user_access_token'];

    axios
      .post(
        'https://stellon.shop/auth/validate',
        {},
        {
          headers: {
            Authorization: accessToken,
          },
        }
      ) // 토큰으로 서버에 인증요청
      .then((res) => console.log(res.data)) // 'true' === 토큰 인증완료
      .catch(async (error) => {
        if (error.response.data.code === 444) {
          console.log(error.response.data.code + '토큰 재발급 요청');
          receiveRefreshToken(); // access 토큰 만료 토큰 재발급
        } else if (error.response.data.code === 445) {
          console.log(error.response.data.code);
          logOut(); // access refresh 토큰 모두 만료 로그아웃 처리
        } else {
          logOut(); // 토큰이 없을시
        }
      });
    /// ERROR Code 444 === access Token 만료 -> 토큰 재발급 요청
    /// ERROR Code 445 === access refresh 모두 만료 -> 재로그인 요청 (하루 이내면 refresh토큰 바뀌게 설정)
  };

  const logOut = () => {
    removeCookie('user_access_token');
    removeCookie('user_refresh_token');
    navigate('/');
  };

  // 토큰 재발급 POST
  const receiveRefreshToken = async () => {
    const refreshToken = cookies['user_refresh_token'];
    const accessToken = cookies['user_access_token'];
    axios
      .post(
        'https://stellon.shop/auth/reissue',
        {},
        {
          headers: { Authorization: accessToken, RefreshToken: refreshToken },
        }
      )
      .then((res) => {
        console.log(res.data.response.accessToken);
        const newAccessToken = res.data.response.accessToken;
        const newRefreshToken = res.data.response.refreshToken;
        setCookie('user_access_token', newAccessToken, { path: '/' }); // 쿠키에 access 토큰 저장
        setCookie('user_refresh_token', newRefreshToken, { path: '/' }); // 쿠키에 refresh 토큰 저장
      })
      .catch((err) => {
        console.log(err);
        logOut();
      });
  };

  // 게임방 리스트 GET 요청
  const watchRoom = async () => {
    const accessToken = cookies['user_access_token'];
    axios
      .get('https://stellon.shop/room', {
        headers: { Authorization: accessToken },
      })
      .then((res) => console.log(res.data))
      .catch((err) => err.data + '게임방 리스트 GET');
  };

  const firstEntering = async () => {
    const accessToken = cookies['user_access_token'];
    axios
      .post(
        'https://stellon.shop/room/lobby/users',
        {},
        {
          headers: { Authorization: accessToken },
        }
      )
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err + '게임방 리스트 POST'));
  };

  const enteringUser = async () => {
    const accessToken = cookies['user_access_token'];
    axios
      .get('https://stellon.shop/room/lobby/users', {
        headers: { Authorization: accessToken },
      })
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
  };
  return {
    cookies,
    setCookie,
    removeCookie,
    loginCheck,
    logOut,
    receiveRefreshToken,
    watchRoom,
    firstEntering,
    enteringUser,
  };
};

export default useApi;
