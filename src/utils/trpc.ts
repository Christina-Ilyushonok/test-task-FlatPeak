import { axios } from './http';

// Сформировать body для tRPC batch с одним вызовом
export function trpcBody(json: any) {
  return { '0': { json } } as const;
}

export async function postTrpc(path: string, json: any) {
  return axios.post(path, trpcBody(json), {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'x-trpc-source': 'nextjs-react',
    },
    validateStatus: status => status < 500,
  });
}

export async function getTrpcBatch(route: string, inputs: any[]) {
  const inputIndexed: Record<string, any> = {};
  inputs.forEach((inp, i) => (inputIndexed[String(i)] = { json: inp }));

  return axios.get(`/api/trpc/${route}`, {
    params: { batch: 1, input: JSON.stringify(inputIndexed) },
    headers: { Accept: 'application/json', 'x-trpc-source': 'nextjs-react' },
    validateStatus: s => s < 500,
  });
}

export function logHttpError(where: string, res: any) {
  const body =
    typeof res?.data === 'string'
      ? res.data
      : JSON.stringify(res?.data, null, 2);
  console.log(`\n[${where}] HTTP ${res?.status}\n${body}\n`);
}
