/**
 * Login page — "Войти через Google"
 * Redirect to /dashboard if already authenticated
 */
import { redirect } from 'next/navigation'
import { auth } from '@/auth-utils'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const session = await auth()

  if (session?.user) {
    redirect('/dashboard')
  }

  const { error } = await searchParams

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>ProStore</h1>
        <p className="login-subtitle">Prompt Store</p>
        {error === 'google' && (
          <p className="login-error">Ошибка входа через Google. Проверьте настройки OAuth.</p>
        )}
        <p className="login-hint">Войдите через Google для доступа к личному кабинету</p>
        <a href="/api/auth/signin/google?callbackUrl=/dashboard" className="login-btn">
          Войти через Google
        </a>
      </div>
    </div>
  )
}
