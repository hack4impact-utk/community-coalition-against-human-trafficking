import { NextRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
/**
 * This hook is needed to both access the query parameter utility functions and refer to the current path
 * @returns An object that contains the router object (of type NextRouter) and path string

 * - Usage Example:
 * - start at localhost:3000/test
 * - const {router, path} = useRouterQuery()
 * - addURLQueryParam(router, "hi", "test")
 * - The value of path is now "/test?hi=test"
 */
export function useRouterQuery() {
  const router = useRouter()
  const [path, setPath] = useState('')
  useEffect(() => setPath(router.asPath), [router])
  return { router, path }
}

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
export async function addURLQueryParam(
  router: NextRouter,
  key: string,
  val: string
) {
  await router.replace(
    {
      query: { ...router.query, [key]: val },
    },
    undefined,
    { scroll: false }
  )
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
export async function removeURLQueryParam(router: NextRouter, key: string) {
  delete router.query[key]

  await router.replace(
    {
      query: { ...router.query },
    },
    undefined,
    { scroll: false }
  )
}

export async function bulkAddURLQueryParams(
  router: NextRouter,
  params: Record<string, string>
) {
  const nonEmptyParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v != null)
  )
  await router.replace(
    {
      query: { ...router.query, ...nonEmptyParams },
    },
    undefined,
    { scroll: false }
  )
}

export async function bulkRemoveURLQueryParams(
  router: NextRouter,
  params: string[]
) {
  params.forEach((param) => delete router.query[param])

  await router.replace(
    {
      query: { ...router.query },
    },
    undefined,
    { scroll: false }
  )
}
