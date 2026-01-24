import { prisma } from '@/lib/prisma'

async function getNotes() {
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
  let notes = []
  let error = null

  try {
    notes = await getNotes()
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to fetch notes'
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Next.js + Prisma + NeonDB</h1>
        <p>Reading data from PostgreSQL (Neon) database</p>
      </div>

      {error && (
        <div className="error">
          <strong>Error:</strong> {error}
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

