import urls from 'utils/urls'

export { default } from 'next-auth/middleware'

export const config = {
  matcher: [
    urls.pages.dashboard,
    urls.pages.checkIn,
    urls.pages.checkOut,
    urls.pages.inventory,
    urls.pages.history,
    urls.pages.settings.general,
    '/settings/:path*',
  ],
}
