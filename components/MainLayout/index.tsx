import React from 'react'
interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <section className="layout">
      {/* TODO: Update with navigation drawer and app bar */}
      <main>{children}</main>
    </section>
  )
}
