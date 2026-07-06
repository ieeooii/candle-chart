const BASE_URL = 'https://api.upbit.com/v1/'

export const apiUrl = (path: string, init?: RequestInit) => {
  return fetch(`${BASE_URL}${path}`, init)
}
