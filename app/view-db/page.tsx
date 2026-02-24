'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type DbType = 'local' | 'prod'

export default function ViewDbPage() {
  const [db, setDb] = useState<DbType>('local')
  const [tables, setTables] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetch(`/api/view-db/tables?db=${db}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error)
        setTables(data.tables || [])
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Unknown error'))
      .finally(() => setLoading(false))
  }, [db])

  return (
    <div className="view-db-container">
      <h1>View DB</h1>
      <div className="view-db-controls">
        <label>
          <span>База данных:</span>
          <select value={db} onChange={(e) => setDb(e.target.value as DbType)}>
            <option value="local">Локальная</option>
            <option value="prod">Рабочая</option>
          </select>
        </label>
      </div>

      {loading && <p className="view-db-loading">Загрузка таблиц...</p>}
      {error && <p className="view-db-error">{error}</p>}

      {!loading && !error && (
        <div className="view-db-table-list">
          <h2>Таблицы</h2>
          {tables.length === 0 ? (
            <p>Таблицы не найдены</p>
          ) : (
            <ul>
              {tables.map((table) => (
                <li key={table} className="view-db-table-item">
                  <span>{table}</span>
                  <Link href={`/view-db/${table}?db=${db}`} className="view-db-btn view-db-btn-open">
                    Открыть
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
