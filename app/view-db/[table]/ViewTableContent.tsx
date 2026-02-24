'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'

type DbType = 'local' | 'prod'

interface TableData {
  rows: Record<string, unknown>[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export default function ViewTableContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const table = params.table as string
  const db = (searchParams.get('db') || 'local') as DbType
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [data, setData] = useState<TableData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modal, setModal] = useState<'create' | 'edit' | null>(null)
  const [editRow, setEditRow] = useState<Record<string, unknown> | null>(null)
  const [formData, setFormData] = useState<Record<string, string>>({})

  const fetchData = useCallback(() => {
    setLoading(true)
    setError(null)
    fetch(`/api/view-db/${table}?db=${db}&page=${page}&limit=${limit}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error)
        setData(data)
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Unknown error'))
      .finally(() => setLoading(false))
  }, [table, db, page, limit])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const openCreate = async () => {
    let cols: string[] = []
    if (data?.rows?.[0]) {
      cols = Object.keys(data.rows[0]).filter((k) => !['id', 'created_at', 'updated_at'].includes(k))
    } else {
      const res = await fetch(`/api/view-db/${table}/columns?db=${db}`)
      const json = await res.json()
      if (json.columns) cols = json.columns.filter((k: string) => !['id', 'created_at', 'updated_at'].includes(k))
    }
    const initial: Record<string, string> = {}
    for (const k of cols) initial[k] = ''
    setFormData(initial)
    setEditRow(null)
    setModal('create')
  }

  const openEdit = (row: Record<string, unknown>) => {
    const initial: Record<string, string> = {}
    for (const [k, v] of Object.entries(row)) {
      initial[k] = v != null ? String(v) : ''
    }
    setFormData(initial)
    setEditRow(row)
    setModal('edit')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(formData)) {
      if (k === 'id') continue
      if (v === '') payload[k] = null
      else payload[k] = v
    }

    try {
      if (modal === 'create') {
        const res = await fetch(`/api/view-db/${table}?db=${db}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const json = await res.json()
        if (json.error) throw new Error(json.error)
      } else if (editRow && editRow.id) {
        const res = await fetch(`/api/view-db/${table}/${editRow.id}?db=${db}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const json = await res.json()
        if (json.error) throw new Error(json.error)
      }
      setModal(null)
      setEditRow(null)
      fetchData()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить запись?')) return
    try {
      const res = await fetch(`/api/view-db/${table}/${id}?db=${db}`, { method: 'DELETE' })
      const json = await res.json()
      if (json.error) throw new Error(json.error)
      fetchData()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    }
  }

  const cols = data?.rows?.[0] ? Object.keys(data.rows[0]) : []

  return (
    <div className="view-db-container">
      <div className="view-db-header">
        <button type="button" onClick={() => router.push(`/view-db?db=${db}`)} className="view-db-btn view-db-btn-back">
          ← Назад
        </button>
        <h1>Таблица: {table}</h1>
        <div className="view-db-controls">
          <select value={db} onChange={(e) => router.replace(`/view-db/${table}?db=${e.target.value}`)}>
            <option value="local">Локальная</option>
            <option value="prod">Рабочая</option>
          </select>
        </div>
      </div>

      {loading && <p className="view-db-loading">Загрузка...</p>}
      {error && <p className="view-db-error">{error}</p>}

      {!loading && !error && data && (
        <>
          <div className="view-db-toolbar">
            <button type="button" onClick={openCreate} className="view-db-btn view-db-btn-create">
              Создать
            </button>
          </div>

          <div className="view-db-table-wrap">
            <table className="view-db-table">
              <thead>
                <tr>
                  {cols.map((c) => (
                    <th key={c}>{c}</th>
                  ))}
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {data.rows.map((row, i) => (
                  <tr key={String(row.id ?? i)}>
                    {cols.map((c) => (
                      <td key={c}>{String(row[c] ?? '')}</td>
                    ))}
                    <td>
                      <button type="button" onClick={() => openEdit(row)} className="view-db-btn view-db-btn-sm">
                        Изменить
                      </button>
                      <button type="button" onClick={() => handleDelete(String(row.id))} className="view-db-btn view-db-btn-sm view-db-btn-danger">
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="view-db-pagination">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="view-db-btn"
            >
              Назад
            </button>
            <span>
              {page} / {data.totalPages} (всего {data.total})
            </span>
            <button
              type="button"
              disabled={page >= data.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="view-db-btn"
            >
              Вперёд
            </button>
          </div>
        </>
      )}

      {modal && (
        <div className="view-db-modal-overlay" onClick={() => setModal(null)}>
          <div className="view-db-modal" onClick={(e) => e.stopPropagation()}>
            <h2>{modal === 'create' ? 'Создать' : 'Изменить'}</h2>
            <form onSubmit={handleSubmit}>
              {Object.keys(formData).map((k) => (
                <label key={k}>
                  <span>{k}</span>
                  <input
                    type="text"
                    value={formData[k]}
                    onChange={(e) => setFormData((prev) => ({ ...prev, [k]: e.target.value }))}
                    disabled={k === 'id'}
                    readOnly={k === 'id'}
                  />
                </label>
              ))}
              <div className="view-db-modal-actions">
                <button type="submit" className="view-db-btn view-db-btn-primary">
                  {modal === 'create' ? 'Создать' : 'Сохранить'}
                </button>
                <button type="button" onClick={() => setModal(null)} className="view-db-btn">
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
