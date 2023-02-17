import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { addURLQueryParam, removeURLQueryParam } from '../utils/queryParams'

export default function Test() {
  // IMPORTANT
  // router.query isn't really updated until router.push() or router.replace() is called
  // However, when called in the util functions, router.query is still outdated
  // What happened was that hitting button 1 once would show that the path is /test
  // but hitting it a SECOND time would then properly show that the path is /test?hi1=test
  // This has to due with how nextjs router is made and timings/refreshing the page
  // The workaround is to wait for the router object itself to update in a useEffect
  // Here is how I would access the path in code -- I would just use a state variable
  const router = useRouter()
  const [path, setPath] = useState("")
  useEffect(() => setPath(router.asPath), [router])

  // proof that this works:
  useEffect(() => console.log(path), [path])


  return (
    <>
      <button onClick={() => addURLQueryParam(router, "hi1", "test")}>add key 1</button>
      <button onClick={() => addURLQueryParam(router, "hi2", "test")}>add key 2</button>
      <button onClick={() => addURLQueryParam(router, "hi3", "test")}>add key 3</button>
      <button onClick={() => addURLQueryParam(router, "hi4", "test")}>add key 4</button>
      <button onClick={() => addURLQueryParam(router, "hi5", "test")}>add key 5</button>

      <button onClick={() => removeURLQueryParam(router, "hi1")}>delete key 1</button>
      <button onClick={() => removeURLQueryParam(router, "hi2")}>delete key 2</button>
      <button onClick={() => removeURLQueryParam(router, "hi3")}>delete key 3</button>
    </>
  )
}
