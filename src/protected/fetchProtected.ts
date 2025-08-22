import { getTrpcBatch, logHttpError } from '../utils/trpc';

export async function fetchProtected() {
  const res = await getTrpcBatch('user.current,account.getSubscriptionStatus', [
    null,
    null,
  ]);
  if (res.status < 300) {
    console.log('user.current + account.getSubscriptionStatus:');
    console.log(
      typeof res.data === 'string'
        ? res.data
        : JSON.stringify(res.data, null, 2)
    );
    return;
  }
  logHttpError('fetchProtected', res);
}
