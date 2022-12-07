import axios from 'axios';
import { loginApi } from '../api/loginApi';
import { setting } from '../constants/setting';
import { getCookie, setCookie } from './cookies';

const Api = axios.create({
  baseURL: `${setting.baseURL}`,
});

Api.interceptors.request.use((config) => {
  config.headers = {
    Authorization: getCookie(`user_access_token`),
    RefreshToken: getCookie('user_refresh_token'),
  };

  return config;
});

Api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response.data.status === 500) {
      return console.log('500 Error 이미 등록된 유저입니다.');
    } else if (error.response.data.error === '존재하지 않는 유저입니다.') {
      return console.log('이미 로비리스트에 삭제하였음.');
    } else if (error.response.data.message === '유효하지 않은 토큰입니다.') {
      return window.location.replace('/');
    } else if (error.response.data.status === 409) {
      return () => {
        console.log(error);
        console.log('다시 접속자 목록에 등록합니다.');
        Api(error.config);
      };
    }
    console.log(error);

    // 토큰 재발급
    const res = await loginApi.receiveRefreshToken(
      getCookie('user_access_token'),
      getCookie('user_refresh_token')
    );

    setCookie('user_access_token', res.data.response.accessToken);
    setCookie('user_refresh_token', res.data.response.refreshToken);
    console.log('토큰 재발급 성공');

    return Api(error.config);
  }
);

export default Api;
