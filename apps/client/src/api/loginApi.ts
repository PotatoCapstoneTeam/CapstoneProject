import { Api } from './common';

interface ILogin {
  email: string;
  password: string;
}

export const loginApi = {
  loginCheck: async (token: string) => {
    return await Api.postWithToken('/auth/validate', token);
  },

  receiveRefreshToken: async (accessToken: string, refreshToken: string) => {
    return await Api.postWithToken('/auth/reissue', accessToken, refreshToken);
  },

  login: async (data: ILogin) => {
    return await Api.postWithParams('/auth/login', data);
  },

  logout: async (token: string) => {
    return await Api.deleteWithToken('/room/lobby/users', token);
  },

  tryLogin: async (data: ILogin) => {
    await Api.postWithParams('/auth/login', data);
  },
};
