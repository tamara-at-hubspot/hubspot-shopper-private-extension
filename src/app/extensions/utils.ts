import { type JsonValue, hubspot } from '@hubspot/ui-extensions';

export async function proxyRequest<R = any>(request: {
  method: string;
  requestUri: string;
  requestBody?: unknown;
}): Promise<R> {
  const { status, data, error } = await hubspot.serverless('proxy', {
    parameters: request as JsonValue,
  });
  if (status >= 200 && status < 300) {
    return data;
  }
  throw new Error(error);
}
