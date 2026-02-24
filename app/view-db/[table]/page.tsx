'use client'

import { Suspense } from 'react'
import ViewTableContent from './ViewTableContent'

export default function ViewTablePage() {
  return (
    <Suspense fallback={<p className="view-db-loading">Загрузка...</p>}>
      <ViewTableContent />
    </Suspense>
  )
}
