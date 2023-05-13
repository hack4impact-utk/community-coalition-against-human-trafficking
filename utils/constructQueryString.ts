/**
 * Builds a query string out of the supplied params object
 * @param params key-value pairs to be converted to a query string
 * @returns A query string
 */
export const constructQueryString = (params: { [key: string]: string }) => {
  if (Object.keys(params).length === 0) return ''
  return `&${Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')}`
}
