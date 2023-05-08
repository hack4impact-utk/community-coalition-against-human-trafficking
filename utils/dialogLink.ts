import { NextRouter } from 'next/router'
import { DialogRoute, dialogRoutes } from './constants'

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
  return `?showDialog=true&${Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')}`
}

export const dialogPush = (router: NextRouter, href: string) => {
  let mr: MatchResult = { success: false, params: {} }
  const f = () => {
    const attemptedDr = dialogRoutes.find((dr) => dr.path === href)

    if (!attemptedDr) {
      // try and find matching result from defined hrefs
      for (const dr of dialogRoutes) {
        mr = matchParams(href, dr.path)
        if (mr.success) {
          return dr
        }
      }
    }
    return attemptedDr
  }
  const dr = f()

  const actualRoute = constructDialogRoute(mr.params, dr)

  router.push(`${actualRoute}`)

  // window.history.pushState({}, '', `${window.location.pathname}${actualRoute}`)
}
