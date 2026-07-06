const BASE_URL = 'https://api.upbit.com/v1'

type QueryParams = Record<string, string | number | boolean | undefined>

const buildQuery = (params?: QueryParams) => {
  if (!params) {
    return ''
  }

  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      search.append(key, String(value))
    }
  })

  const query = search.toString()
  return query ? `?${query}` : ''
}

export const apiUrl = (path: string, init?: RequestInit) => {
  return fetch(`${BASE_URL}${path}`, init)
}

export const https = {
  get: (path: string, params?: QueryParams) => {
    return apiUrl(`${path}${buildQuery(params)}`, {
      method: 'GET',
      headers: { accept: 'application/json' },
    })
  },
}
