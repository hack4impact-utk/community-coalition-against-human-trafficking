import Link from 'next/link'
import { useMemo } from 'react'
import { dialogRoutes } from 'utils/constants'

interface Props {
  href: string
  children: React.ReactNode
}

export default function DialogLink({ href, children }: Props) {
  const dialogRoute = useMemo(
    () => dialogRoutes.find((dr) => dr.path === href),
    [href]
  )
  return (
    <Link href={`?dialog=${dialogRoute?.name}`} as={href} passHref>
      {children}
    </Link>
  )
}
