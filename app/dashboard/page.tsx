/**
 * Dashboard — личный кабинет
 * Protected: only authenticated users (middleware)
 */
import { redirect } from 'next/navigation'
import { auth } from '@/auth-utils'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Личный кабинет</h1>
        <div className="dashboard-user">
          {session.user.image && (
            <img src={session.user.image} alt="" className="dashboard-avatar" width={32} height={32} />
          )}
          <span>{session.user.name || session.user.email}</span>
          <a href="/api/auth/signout?callbackUrl=/" className="btn btn-outline">
            Выйти
          </a>
        </div>
      </header>
      <nav className="dashboard-nav">
        <Link href="/my-prompts" className="dashboard-link">
          Мои промты →
        </Link>
      </nav>
      <p className="dashboard-welcome">
        Добро пожаловать! userId: <code>{session.user.id}</code>
      </p>
    </div>
  )
}
