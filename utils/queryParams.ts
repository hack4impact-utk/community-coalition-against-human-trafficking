import { NextRouter } from 'next/router'

/**
 * How to keep track of path in code:
 * The router.query property is not updated right away when router.replace() or router.push() is called.
 * Thus, it is necesarry to use a state variable and update it in your component whenever router is changed to
 * access the path:
 *
 * const router = useRouter()
 * const [path, setPath] = useState("")
 * useEffect(() => setPath(router.asPath), [router])
 */

/**
 * If the input parameter is not already present, this function adds a query parameter to the current URL
 * @param router a NextJS router made using the useRouter() hook
 * @param key The key for the query parameter
 * @param val The value for the query parameter
 *
 * Usage:
 * - If you are on localhost:3000/authenticationTest, calling addURLQueryParam("test", "hi") will
 * change your url to localhost:3000/authenticationTest/?test=hi
 * - See file for more details on keeping track of path.
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
 *
 * Usage:
 * - If you are on localhost:3000/authenticationTest?test=hi, calling removeURLQueryParam("test") will
 * change your url to localhost:3000/authenticationTest
 * - See file for more details on keeping track of path.
 */
export function removeURLQueryParam(router: NextRouter, key: string) {
  delete router.query[key]

  router.replace({
    query: { ...router.query },
  })
}
