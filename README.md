# Next.js + Prisma + NeonDB

Минимальный рабочий проект на Next.js (App Router) + Prisma ORM + NeonDB (PostgreSQL), готовый к деплою на Vercel.

## Преимущества Prisma

- ✅ **Prisma Studio** - встроенный GUI для просмотра и редактирования данных
- ✅ **Отличная поддержка TypeScript** - автогенерация типов из схемы
- ✅ **Миграции** - версионирование изменений схемы БД
- ✅ **Интуитивный API** - удобные методы для CRUD операций
- ✅ **Поддержка serverless** - адаптер для Neon с WebSocket-подключениями

## Требования

- Node.js 18+ 
- npm или yarn
- Аккаунт на [NeonDB](https://neon.tech) для PostgreSQL базы данных

## Установка

### 1. Установка зависимостей

```powershell
npm install
```

### 2. Настройка базы данных (NeonDB)

1. Создайте аккаунт на [neon.tech](https://neon.tech)
2. Создайте новый проект
3. В настройках проекта скопируйте **Connection String**
   - Формат: `postgresql://user:password@host/database?sslmode=require`
   - Или используйте формат с параметрами

### 3. Настройка переменных окружения

Создайте файл `.env` в корне проекта:

```env
# NeonDB Connection String
# Получите из панели NeonDB: Settings → Connection Details
DATABASE_URL="postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/database?sslmode=require"
```

**Пример:**
```env
DATABASE_URL="postgresql://neondb_owner:password123@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

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
│   └── prisma.ts           # Подключение к базе данных (Neon serverless)
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
   - **Value:** Ваш connection string из NeonDB

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

Или используйте NeonDB Console для выполнения SQL миграций вручную.

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
1. Проверьте правильность `DATABASE_URL` в `.env`
2. Убедитесь, что база данных NeonDB активна
3. Проверьте, что IP-адрес не заблокирован в настройках NeonDB
4. Убедитесь, что используется правильный формат connection string с `?sslmode=require`

### Ошибка при сборке на Vercel

**Решение:**
1. Убедитесь, что `DATABASE_URL` добавлен в переменные окружения Vercel
2. Проверьте, что все зависимости установлены в `package.json`
3. Убедитесь, что `prisma generate` выполняется при сборке (postinstall)

## Полезные ссылки

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma + Neon Guide](https://www.prisma.io/docs/orm/overview/databases/neon)
- [NeonDB Documentation](https://neon.tech/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Deployment Guide](https://vercel.com/docs)

## Лицензия

MIT
