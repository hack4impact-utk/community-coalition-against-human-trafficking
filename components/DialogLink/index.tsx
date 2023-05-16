import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { useMemo } from 'react'
import { DialogRoute, dialogRoutes } from 'utils/constants'

interface Props {
  href: string
  backHref?: string
  children: React.ReactNode
}

interface MatchResult {
  success: boolean
  params: {
    [key: string]: string
  }
}

// given '/test/1/edit` and `/test/:id/edit`, return { id: 1 }
const matchParams = (href: string, definedHref: string): MatchResult => {
  const mr: MatchResult = { success: false, params: {} }
  const hrefParts = href.split('/')
  const definedHrefParts = definedHref.split('/')

  if (hrefParts.length !== definedHrefParts.length) {
    return mr
  }

  for (let i = 0; i < definedHrefParts.length; i++) {
    if (definedHrefParts[i].startsWith(':')) {
      const key = definedHrefParts[i].slice(1)
      mr.params[key] = hrefParts[i]
    } else {
      if (hrefParts[i] !== definedHrefParts[i]) {
        mr.params = {}
        return mr
      }
    }
  }

  mr.success = true
  return mr
}

const constructDialogRoute = (
  params: { [key: string]: string },
  dialogRoute?: DialogRoute
) => {
  if (!dialogRoute) return ''
  return `?showDialog=${dialogRoute.name || 'true'}${
    Object.keys(params).length
      ? `&${Object.entries(params)
          .map(([key, value]) => `${key}=${value}`)
          .join('&')}`
      : ''
  }`
}

export default function DialogLink({ href, children }: Props) {
  const [params, setParams] = React.useState<{ [key: string]: string }>({})
  const router = useRouter()
  const dialogRoute = useMemo(() => {
    if (router.query.showDialog) return
    const attemptedDr = dialogRoutes.find((dr) => dr.path === href)
    setParams({ ...(router.query as { [key: string]: string }) })
    if (!attemptedDr) {
      // try and find matching result from defined hrefs
      for (const dr of dialogRoutes) {
        const mr = matchParams(href, dr.path)
        if (mr.success) {
          setParams((params) => ({
            ...params,
            ...mr.params,
          }))
          return dr
        }
      }
    }
    return attemptedDr
  }, [href, router.query])

  const constructedHref = useMemo(() => {
    return constructDialogRoute(params, dialogRoute)
  }, [dialogRoute, params])
  return (
    <Link
      href={constructedHref}
      // as={href}
      passHref
      style={{ textDecoration: 'none' }}
    >
      {children}
    </Link>
  )
}
