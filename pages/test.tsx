import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { addURLQueryParam, removeURLQueryParam } from '../utils/queryParams'

export default function Test() {
  const router = useRouter()
  const [path, setPath] = useState("")

  // IMPORTANT
  // router.query isn't really updated until router.push() or router.replace() is called
  // However, when called in the util functions, router.query is still outdated
  // What happened was that hitting button 1 once would show that the path is /test
  // but hitting it a SECOND time would then properly show that the path is /test?hi1=test
  // This has to due with how nextjs router is made and timings/refreshing the page
  // The workaround is to wait for the router object itself to update in a useEffect
  // Here is how I would access the path in code -- I would just use a state variable
  useEffect(() => setPath(router.asPath), [router])

  // proof that this works:
  useEffect(() => console.log(path), [path])

  // Test functions made to test out the util functions
  const addParam = (key: string) => {
    addURLQueryParam(router, key, 'test')
  }

  const removeParam = (key: string) => {
    removeURLQueryParam(router, key)
  }

  return (
    <>
      <button onClick={() => addParam('hi1')}>add key 1</button>
      <button onClick={() => addParam('hi2')}>add key 2</button>
      <button onClick={() => addParam('hi3')}>add key 3</button>
      <button onClick={() => addParam('hi4')}>add key 4</button>
      <button onClick={() => addParam('hi5')}>add key 5</button>

      <button onClick={() => removeParam('hi1')}>delete key 1</button>
      <button onClick={() => removeParam('hi2')}>delete key 2</button>
      <button onClick={() => removeParam('hi3')}>delete key 3</button>
    </>
  )
}
