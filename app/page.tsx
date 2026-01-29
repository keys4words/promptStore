import { prisma } from '@/lib/prisma'
import { Note } from '@prisma/client'

async function getNotes(): Promise<Note[]> {
  try {
    const notes = await prisma.note.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
    return notes
  } catch (error) {
    console.error('Error fetching notes:', error)
    throw error
  }
}

export default async function Home() {
  let notes: Note[] = []
  let error: string | null = null

  try {
    notes = await getNotes()
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to fetch notes'
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Next.js + Prisma + Supabase</h1>
        <p>Reading data from PostgreSQL (Supabase) database</p>
      </div>

      {error && (
        <div className="error">
          <strong>Error:</strong> {error}
          {error.includes('does not exist') && (
            <div style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
              <p><strong>Решение:</strong> Выполните миграцию базы данных:</p>
              <code style={{ display: 'block', marginTop: '0.5rem', padding: '0.5rem', background: '#fff', borderRadius: '4px' }}>
                npm run db:push
              </code>
              <p style={{ marginTop: '0.5rem' }}>или</p>
              <code style={{ display: 'block', marginTop: '0.5rem', padding: '0.5rem', background: '#fff', borderRadius: '4px' }}>
                npm run db:migrate
              </code>
            </div>
          )}
        </div>
      )}

      {!error && notes.length === 0 && (
        <div className="empty-state">
          <p>No notes found. Run the seed script to populate the database:</p>
          <code>npm run db:seed</code>
        </div>
      )}

      {!error && notes.length > 0 && (
        <div className="notes-grid">
          {notes.map((note) => (
            <div key={note.id} className="note-card">
              <div className="note-title">{note.title}</div>
              <div className="note-date">
                Created: {new Date(note.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

