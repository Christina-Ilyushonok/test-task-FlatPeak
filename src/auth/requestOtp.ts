import { postTrpc } from "../utils/trpc";

const EMAIL = process.env.EMAIL!;
const INIT_PATH = process.env.INIT_PATH!;

if (!EMAIL || !INIT_PATH) throw new Error('EMAIL/INIT_PATH missing');

export let methodIdFromServer: string | null = null;

export async function requestOtp() {
  const res = await postTrpc(INIT_PATH, { email: EMAIL });

  if (res.status < 300) {
    const data: any = res.data;

    methodIdFromServer = data?.[0]?.result?.data?.json?.methodId || null;
    console.log('OTP requested; check email');

    if (methodIdFromServer) console.log('methodId:', methodIdFromServer);
    return;
  }
  throw new Error(`[requestOtp] HTTP ${res.status}: ${typeof res.data === 'string' ? res.data : JSON.stringify(res.data)}`);
}