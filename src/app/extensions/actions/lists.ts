import type { List } from '../types';
import { proxyRequest } from '../utils';

const BASE_URL = 'http://localhost:3000';

interface ListResults {
  results: List[];
}

export function getList(
  hubId: number,
  objectTypeId: string,
  objectId: number
): Promise<List | null> {
  return proxyRequest<ListResults>({
    method: 'GET',
    requestUri: `${BASE_URL}/list?hubId=${hubId}&objectTypeId=${objectTypeId}&objectId=${objectId}`,
  }).then((response) => {
    return response.results[0] ?? null;
  });
}

export function createList(list: Partial<List>) {
  return proxyRequest<List>({
    method: 'POST',
    requestUri: `${BASE_URL}/list`,
    requestBody: list,
  });
}

export function updateList(list: List) {
  return proxyRequest<List>({
    method: 'PUT',
    requestUri: `${BASE_URL}/list/${list.id}`,
    requestBody: list,
  });
}

export function deleteList(list: List) {
  return proxyRequest<void>({
    method: 'DELETE',
    requestUri: `${BASE_URL}/list/${list.id}`,
  });
}
