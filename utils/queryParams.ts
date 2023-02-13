import { NextRouter } from 'next/router'

/**
 * If the input parameter is not already present, this function adds a query parameter to the current URL
 * @param router a NextJS router made using the useRouter() hook
 * @param key The key for the query parameter
 * @param val The value for the query parameter
 *
 * Usage:
 * If you are on localhost:3000/authenticationTest, calling addURLQueryParam("test", "hi") will
 * change your url to localhost:3000/authenticationTest/?test=hi
 */
export function addURLQueryParam(router: NextRouter, key: string, val: string) {
  if (!router.query[key]) {
    router.replace({
      query: { ...router.query, [key]: val },
    })
  }
}

/**
 * Deletes a given query parameter from the current URL
 * @param router a NextJS router made using the useRouter() hook
 * @param key The key for the query parameter that is to be deleted
 */
export function removeURLQueryParam(router: NextRouter, key: string) {
  delete router.query[key]

  router.replace({
    query: { ...router.query },
  })
}
