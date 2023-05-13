import urls from 'utils/urls'

export { default } from 'next-auth/middleware'

export const config = {
  matcher: [
    '/',
    '/checkIn',
    '/checkOut',
    '/inventory',
    '/history',
    '/settings',
    '/settings/:path*',
  ],
}
