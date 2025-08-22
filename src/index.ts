import 'dotenv/config';
import promptSync from 'prompt-sync';
import { requestOtp } from './auth/requestOtp';
import { verifyOtp } from './auth/verifyOtp';
import { fetchProtected } from './protected/fetchProtected';

const BASE_URL = process.env.BASE_URL!;
const EMAIL = process.env.EMAIL!;
const INIT_PATH = process.env.INIT_PATH!;
const VERIFY_PATH = process.env.VERIFY_PATH!;

if (!BASE_URL || !EMAIL || !INIT_PATH || !VERIFY_PATH) {
  throw new Error('Missing env vars: BASE_URL, EMAIL, INIT_PATH, VERIFY_PATH');
}

(async () => {
  try {
    await requestOtp();
    console.log('OTP requested; check email');

    const prompt = promptSync({ sigint: true });
    const code = prompt('Enter 6-digit OTP from email: ').trim();

    const jwt = await verifyOtp(code);
    console.log('session_jwt:', jwt ?? '(not found)');

    await fetchProtected();
  } catch (e: any) {
    console.error('Error:', e?.message || e);
  }
})();
