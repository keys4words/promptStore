/**
 * My Prompts — приватные промты пользователя
 * Protected: only owner sees their private prompts
 */
import { redirect } from 'next/navigation'
import { auth } from '@/auth-utils'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function MyPromptsPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  const userId = session.user.id

  // Fetch only prompts owned by current user
  const prompts = await prisma.prompt.findMany({
    where: { ownerId: userId },
    orderBy: { updatedAt: 'desc' },
    include: { category: true },
  })

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Мои промты</h1>
        <Link href="/dashboard" className="btn btn-outline">
          ← Назад
        </Link>
      </header>
      {prompts.length === 0 ? (
        <p className="empty-state">У вас пока нет промтов. Создайте первый!</p>
      ) : (
        <ul className="prompts-list">
          {prompts.map((p) => (
            <li key={p.id} className="prompt-card">
              <h3>{p.title}</h3>
              <p className="prompt-visibility">{p.visibility}</p>
              {p.category && <span className="prompt-category">{p.category.name}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
