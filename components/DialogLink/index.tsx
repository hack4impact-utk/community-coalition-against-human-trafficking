import Link from 'next/link'
import { useMemo } from 'react'
import { dialogRoutes } from 'utils/constants'

interface Props {
  href: string
  backHref?: string
  children: React.ReactNode
}

export default function DialogLink({ href, children, backHref }: Props) {
  const dialogRoute = useMemo(
    () => dialogRoutes.find((dr) => dr.path === href),
    [href]
  )
  return (
    <Link
      href={`?dialog=${dialogRoute?.name}&backHref=${backHref}`}
      as={dialogRoute?.path}
      passHref
      style={{ textDecoration: 'none' }}
    >
      {children}
    </Link>
  )
}
