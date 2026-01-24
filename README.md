# Next.js + Prisma + NeonDB

Минимальный рабочий проект на Next.js (App Router) + Prisma + NeonDB (PostgreSQL), готовый к деплою на Vercel.

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
2. Создайте новый проект и базу данных
3. Скопируйте connection string из панели NeonDB

### 3. Настройка переменных окружения

Создайте файл `.env` в корне проекта:

```powershell
# Скопируйте .env.example
Copy-Item .env.example .env
```

Отредактируйте `.env` и добавьте ваш DATABASE_URL из NeonDB:

```env
DATABASE_URL="postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require"
```

### 4. Настройка Prisma и миграция базы данных

```powershell
# Применить схему к базе данных
npm run db:push

# Или создать миграцию (рекомендуется для продакшена)
npm run db:migrate
```

### 5. Заполнение базы данных тестовыми данными (опционально)

```powershell
npm run db:seed
```

### 6. Запуск проекта

```powershell
# Режим разработки
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## Деплой на Vercel

### 1. Подготовка

Убедитесь, что:
- Все изменения закоммичены в Git
- Проект настроен локально и работает
- `.env` файл содержит правильный DATABASE_URL

### 2. Деплой через Vercel CLI

```powershell
# Установка Vercel CLI (если еще не установлен)
npm install -g vercel

# Логин в Vercel
vercel login

# Деплой
vercel
```

### 3. Деплой через GitHub (рекомендуется)

1. Загрузите проект на GitHub
2. Перейдите на [vercel.com](https://vercel.com)
3. Импортируйте ваш репозиторий
4. В настройках проекта добавьте переменную окружения:
   - **Name**: `DATABASE_URL`
   - **Value**: ваш connection string из NeonDB
5. Нажмите "Deploy"

### 4. Настройка переменных окружения в Vercel

После первого деплоя:
1. Перейдите в настройки проекта в Vercel
2. Откройте "Environment Variables"
3. Добавьте `DATABASE_URL` с вашим connection string из NeonDB
4. Перезапустите деплой

## Структура проекта

```
.
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Главная страница (читает данные из БД)
│   └── globals.css         # Глобальные стили
├── lib/
│   └── prisma.ts           # Prisma Client singleton
├── prisma/
│   ├── schema.prisma       # Prisma схема
│   └── seed.ts             # Скрипт для заполнения БД
├── .env.example            # Пример файла с переменными окружения
├── next.config.js          # Конфигурация Next.js
├── package.json            # Зависимости и скрипты
└── tsconfig.json           # TypeScript конфигурация
```

## Модель данных

### Note

- `id` (String, UUID) - уникальный идентификатор
- `title` (String) - заголовок заметки
- `createdAt` (DateTime) - дата создания

## Команды

```powershell
# Разработка
npm run dev          # Запуск dev сервера

# База данных
npm run db:push      # Применить схему к БД
npm run db:migrate   # Создать и применить миграцию
npm run db:seed      # Заполнить БД тестовыми данными

# Сборка и запуск
npm run build        # Сборка для продакшена
npm run start        # Запуск продакшен сервера
npm run lint         # Проверка кода линтером
```

## Важные замечания

- Для Vercel: переменная `DATABASE_URL` должна быть установлена в настройках проекта
- Prisma Client генерируется автоматически при сборке (`postinstall` скрипт)
- В продакшене используйте `npm run db:migrate` вместо `npm run db:push`
- NeonDB поддерживает serverless режим и отлично работает с Vercel

