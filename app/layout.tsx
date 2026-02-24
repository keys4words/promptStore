import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ProStore — Prompt Store',
  description: 'Prompt Store with Next.js, Prisma, Auth.js, NeonDB',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

