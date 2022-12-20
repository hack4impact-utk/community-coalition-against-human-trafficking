import React from 'react'
interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <section className="layout">
      <main>{children}</main>
    </section>
  )
}
