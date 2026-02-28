# ProStore (Prompt Store)

SaaS-проект на Next.js (App Router) + Prisma + Supabase (PostgreSQL) + Auth.js (Google OAuth), готовый к деплою на Vercel.

## Преимущества Prisma

- ✅ **Prisma Studio** - встроенный GUI для просмотра и редактирования данных
- ✅ **Отличная поддержка TypeScript** - автогенерация типов из схемы
- ✅ **Миграции** - версионирование изменений схемы БД
- ✅ **Интуитивный API** - удобные методы для CRUD операций
- ✅ **Поддержка serverless** - хорошо работает с Supabase Postgres (включая pooler)

## Требования

- Node.js 18+ 
- npm или yarn
- Аккаунт на [Supabase](https://supabase.com) для PostgreSQL базы данных

## Установка

### 1. Установка зависимостей

```powershell
npm install
```

### 2. Настройка базы данных (Supabase)

1. Создайте аккаунт на [Supabase](https://supabase.com) и новый проект
2. Перейдите в **Project Settings → Database → Connection string**
3. Скопируйте строки подключения:
   - **Transaction pooler** (рекомендуется для рантайма на Vercel/Serverless) → в `DATABASE_URL`
   - **Direct connection** (рекомендуется для миграций/DDL) → в `DIRECT_URL`

### 3. Настройка переменных окружения

Создайте файл `.env` в корне проекта:

```env
# Database (Supabase Postgres)
# DATABASE_URL: Transaction pooler (PgBouncer). Хорошо подходит для рантайма.
# DIRECT_URL: Direct connection. Лучше для миграций/DDL.
DATABASE_URL="postgresql://postgres:password@aws-xx-xx.pooler.supabase.com:6543/postgres?sslmode=require"
DIRECT_URL="postgresql://postgres:password@db.xxxxxxxxxxxx.supabase.co:5432/postgres?sslmode=require"

# Auth.js (NextAuth) — OAuth Google
NEXTAUTH_URL="http://localhost:3000"
AUTH_SECRET="сгенерируйте: openssl rand -base64 32"
GOOGLE_CLIENT_ID="ваш-google-client-id"
GOOGLE_CLIENT_SECRET="ваш-google-client-secret"
```

Для AUTH_SECRET:
```powershell
# PowerShell — сгенерировать секрет
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])
```

Примечание: если в URL уже есть `?` (другие параметры), добавляйте SSL как `&sslmode=require`.

### 4. Настройка схемы и миграция базы данных

```powershell
# Применить схему к базе данных (рекомендуется для разработки)
npm run db:push

# Или создать миграцию (рекомендуется для продакшена)
npm run db:migrate:dev
npm run db:migrate
```

### 5. Заполнение базы данных тестовыми данными (опционально)

```powershell
npm run db:seed
```

### 6. Запуск проекта

```powershell
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## Структура проекта

```
.
├── app/
│   ├── layout.tsx          # Корневой layout
│   ├── page.tsx            # Главная страница (читает данные из БД)
│   └── globals.css         # Глобальные стили
├── prisma/
│   ├── schema.prisma       # Схема базы данных (Prisma)
│   ├── seed.ts             # Скрипт для заполнения БД тестовыми данными
│   └── migrations/         # Миграции (создаются автоматически)
├── lib/
│   └── prisma.ts           # Подключение к базе данных (PostgreSQL)
├── package.json
├── tsconfig.json
└── .env                    # Переменные окружения (создайте вручную)
```

## Доступные команды

```powershell
# Разработка
npm run dev                  # Запуск dev-сервера

# База данных
npm run db:generate          # Генерация Prisma Client
npm run db:push              # Применение схемы напрямую (без миграций)
npm run db:migrate           # Применение миграций (продакшен)
npm run db:migrate:dev       # Создание и применение миграций (разработка)
npm run db:studio            # Открыть Prisma Studio (GUI для БД)
npm run db:seed              # Заполнить БД тестовыми данными

# Сборка и деплой
npm run build                # Сборка для продакшена
npm run start                # Запуск продакшен-сервера
npm run lint                 # Проверка кода
```

## Схема базы данных

Проект использует простую схему с одной таблицей `notes`:

```prisma
// prisma/schema.prisma
model Note {
  id        String   @id @default(uuid()) @db.Uuid
  title     String   @db.VarChar(255)
  createdAt DateTime @default(now()) @map("created_at")

  @@map("notes")
}
```

## Использование Prisma

### Чтение данных

```typescript
import { prisma } from '@/lib/prisma'

// Получить все записи
const allNotes = await prisma.note.findMany()

// Сортировка
const sortedNotes = await prisma.note.findMany({
  orderBy: { createdAt: 'desc' },
})

// Фильтрация
const filteredNotes = await prisma.note.findFirst({
  where: { id: 'some-id' },
})
```

### Создание данных

```typescript
import { prisma } from '@/lib/prisma'

const newNote = await prisma.note.create({
  data: { title: 'My new note' },
})
```

### Обновление данных

```typescript
import { prisma } from '@/lib/prisma'

await prisma.note.update({
  where: { id: 'note-id' },
  data: { title: 'Updated title' },
})
```

### Удаление данных

```typescript
import { prisma } from '@/lib/prisma'

await prisma.note.delete({
  where: { id: 'note-id' },
})
```

## Деплой на Vercel

### 1. Подготовка

Убедитесь, что проект собирается локально:

```powershell
npm run build
```

### 2. Настройка переменных окружения в Vercel

1. Перейдите в настройки проекта на Vercel
2. Добавьте переменную окружения:
   - **Name:** `DATABASE_URL`
   - **Value:** ваш connection string из Supabase (желательно Transaction pooler)
3. (Рекомендуется) Добавьте переменную окружения:
   - **Name:** `DIRECT_URL`
   - **Value:** direct connection string из Supabase (для миграций/DDL)

### 3. Деплой

```powershell
# Установите Vercel CLI (если еще не установлен)
npm i -g vercel

# Деплой
vercel
```

Или используйте GitHub интеграцию:
1. Загрузите код в GitHub
2. Подключите репозиторий к Vercel
3. Vercel автоматически определит Next.js и выполнит деплой

### 4. Применение миграций на продакшене

После деплоя выполните миграции:

```powershell
# Убедитесь, что DATABASE_URL указывает на продакшен БД
npm run db:push
```

Или используйте Supabase SQL Editor для выполнения SQL миграций вручную.

## Решение проблем

### Ошибка: "DATABASE_URL environment variable is not set"

**Решение:** Убедитесь, что файл `.env` существует и содержит `DATABASE_URL`.

```powershell
# Проверьте наличие файла
Test-Path .env

# Проверьте содержимое (без показа пароля)
Get-Content .env | Select-String "DATABASE_URL"
```

### Ошибка: "relation 'notes' does not exist"

**Решение:** Примените схему к базе данных:

```powershell
npm run db:push
```

### Ошибка подключения к базе данных

**Решение:** 
1. Проверьте правильность `DATABASE_URL`/`DIRECT_URL` в `.env` (или в переменных окружения Vercel)
2. Убедитесь, что проект Supabase активен и пароль/хост/порт корректны
3. Для рантайма используйте **pooler** (`DATABASE_URL`), а для миграций — **direct** (`DIRECT_URL`)
4. Убедитесь, что используется правильный формат connection string с `?sslmode=require` (или `&sslmode=require`, если уже есть параметры)

### Ошибка при сборке на Vercel

**Решение:**
1. Убедитесь, что `DATABASE_URL` добавлен в переменные окружения Vercel
2. **Value:** ваш connection string из Supabase (желательно pooler) и, при необходимости, `DIRECT_URL` (direct connection)
3. Проверьте, что все зависимости установлены в `package.json`
4. Убедитесь, что `prisma generate` выполняется при сборке (postinstall)

## Аутентификация (Auth.js)

- OAuth через Google
- Server-side сессии (Prisma)
- Защищённые страницы: `/dashboard`, `/my-prompts`
- При первом входе пользователь создаётся в БД (таблица `users`)

**Страницы:**
- `/login` — вход через Google, редирект в /dashboard если уже авторизован
- `/dashboard` — личный кабинет
- `/my-prompts` — промты текущего пользователя (только владелец видит свои приватные)

**Проверка сессии (server-side):**
```typescript
import { auth } from '@/auth'

const session = await auth()
const userId = session?.user?.id
```

После добавления Auth.js выполните миграцию БД:
```powershell
npm run db:push
```

## View DB (тестовая программа)

Программа для просмотра и редактирования данных в локальной или рабочей БД.

**URL:** [http://localhost:3000/view-db](http://localhost:3000/view-db)

**Функции:**
- Выбор БД: локальная (`DATABASE_URL`) или рабочая (`DATABASE_URL_PROD`)
- Список таблиц с кнопкой «Открыть»
- Таблица с пагинацией
- CRUD: Создать, Изменить, Удалить

**Переменные окружения:**
- `DATABASE_URL` — локальная БД
- `DATABASE_URL_PROD` — рабочая БД (если не задана, используется `DATABASE_URL`)

```powershell
npm run dev
# Откройте http://localhost:3000/view-db
```

## Полезные ссылки

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma + Supabase Guide](https://www.prisma.io/docs/orm/overview/databases/supabase)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Deployment Guide](https://vercel.com/docs)

## Лицензия

MIT
