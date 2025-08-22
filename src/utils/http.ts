import { CookieJar } from 'tough-cookie';
import { wrapper } from 'axios-cookiejar-support';
import axiosBase from 'axios';

const BASE_URL = process.env.BASE_URL!;
if (!BASE_URL) throw new Error('BASE_URL missing');

export const jar = new CookieJar();

export const axios = wrapper(
  axiosBase.create({
    baseURL: BASE_URL,
    withCredentials: true,
    jar,
    headers: { 'User-Agent': 'otp-login/1.0' },
  })
);

export async function postJson(url: string, payload: any) {
  return axios.post(url, payload, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'x-trpc-source': 'nextjs-react',
    },
    validateStatus: status => status < 500,
  });
}
