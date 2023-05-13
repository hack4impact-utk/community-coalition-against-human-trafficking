/**
 * Builds a query string out of the supplied params object
 * @param params key-value pairs to be converted to a query string
 * @param first Whether or not this is the first query string item in a URL
 * @returns A query string
 */
export const constructQueryString = (
  params: { [key: string]: string },
  first?: boolean
) => {
  if (Object.keys(params).length === 0) return ''
  return `${first ? '?' : '&'}${Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')}`
}
