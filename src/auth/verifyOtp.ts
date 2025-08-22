import { methodIdFromServer } from './requestOtp';
import { postTrpc } from '../utils/trpc';
import { jar } from '../utils/http';

const VERIFY_PATH = process.env.VERIFY_PATH!;
if (!VERIFY_PATH) throw new Error('VERIFY_PATH missing');

export async function verifyOtp(code: string): Promise<string | null> {
  if (!methodIdFromServer) {
    throw new Error('No methodId received from server — cannot verify OTP');
  }

  const res = await postTrpc(VERIFY_PATH, { methodId: methodIdFromServer, code });

  if (res.status < 300) {
    console.log('OTP verified');

    const cookies = await jar.getCookies(process.env.BASE_URL!);
    const jwt = cookies.find(c => c.key === 'session_jwt')?.value;

    return jwt ?? null;
  }
  throw new Error(
    `[verifyOtp] HTTP ${res.status}: ${
      typeof res.data === 'string' ? res.data : JSON.stringify(res.data)
    }`
  );
}
