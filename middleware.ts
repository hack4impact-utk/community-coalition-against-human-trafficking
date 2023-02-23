export { default } from 'next-auth/middleware'

export const config = {
  matcher: [
    '/',
    '/dashboard',
    '/checkIn',
    '/checkOut',
    '/inventory',
    '/history',
    '/settings',
    '/settings/:path*',
  ],
}
