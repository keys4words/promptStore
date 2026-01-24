# Next.js + Prisma + NeonDB

Минимальный рабочий проект на Next.js (App Router) + Prisma + NeonDB (PostgreSQL), готовый к деплою на Vercel.

## Требования

- Node.js 18+ 
- npm или yarn
- Аккаунт на [NeonDB](https://neon.tech) для PostgreSQL базы данных

## Установка

### 1. Установка зависимостей

**Стандартная установка:**
```powershell
npm install
```

**Если возникают проблемы с сетью (ошибка `ECONNRESET`):**
```powershell
# Установка без выполнения postinstall скриптов
npm install --ignore-scripts
```

**Примечание:** Если при установке возникает ошибка `ECONNRESET` в `postinstall`, это нормально. Пакеты установятся, но Prisma Client нужно будет сгенерировать вручную (см. следующий шаг).

### 2. Генерация Prisma Client

```powershell
npm run db:generate
```

Или вручную:

```powershell
npx prisma generate
```

### 3. Настройка базы данных (NeonDB)

1. Создайте аккаунт на [neon.tech](https://neon.tech)
2. Создайте новый проект и базу данных
3. Скопируйте connection string из панели NeonDB

### 4. Настройка переменных окружения

Создайте файл `.env` в корне проекта:

```powershell
# Скопируйте .env.example
Copy-Item .env.example .env
```

Отредактируйте `.env` и добавьте ваш DATABASE_URL из NeonDB:

```env
DATABASE_URL="postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require"
```

### 5. Настройка Prisma и миграция базы данных

```powershell
# Применить схему к базе данных
npm run db:push

# Или создать миграцию (рекомендуется для продакшена)
npm run db:migrate
```

### 6. Заполнение базы данных тестовыми данными (опционально)

```powershell
npm run db:seed
```

### 7. Запуск проекта

```powershell
# Режим разработки
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## Деплой на Vercel

### Важно: Prisma Client в Vercel

**Prisma Client генерируется автоматически в Vercel!** 

В `package.json` уже настроен build скрипт:
```json
"build": "prisma generate && next build"
```

Это означает, что при каждом деплое Vercel автоматически:
1. Выполняет `prisma generate` (генерирует Prisma Client)
2. Выполняет `next build` (собирает Next.js приложение)

**Вам не нужно вручную выполнять `npm run db:generate` в Vercel** - это происходит автоматически при сборке.

**В NeonDB** это выполнять нельзя - NeonDB это только база данных (PostgreSQL), там нет возможности запускать npm команды.

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
npm run db:generate  # Сгенерировать Prisma Client
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
- Prisma Client генерируется автоматически при сборке (`npm run build`)
- После установки зависимостей выполните `npm run db:generate` для генерации Prisma Client
- В продакшене используйте `npm run db:migrate` вместо `npm run db:push`
- NeonDB поддерживает serverless режим и отлично работает с Vercel

## Решение проблем

### Ошибка: "The table `public.notes` does not exist"

Эта ошибка означает, что таблица не была создана в базе данных. Выполните следующие команды:

```powershell
# 1. Убедитесь, что Prisma Client сгенерирован
npx prisma generate

# 2. Примените схему к базе данных (выберите один из вариантов)

# Вариант A: Быстрое применение (для разработки)
npm run db:push

# Вариант B: Создание миграции (рекомендуется)
npm run db:migrate
# При запросе имени миграции введите: init

# 3. Заполните базу данных тестовыми данными
npm run db:seed
```

### Ошибка `ECONNRESET` при `npm install`

Если при установке зависимостей возникает ошибка `ECONNRESET` в `postinstall` скрипте пакета `@prisma/engines`:

**Вариант 1: Установка с игнорированием скриптов (рекомендуется)**

```powershell
# Установить зависимости без выполнения postinstall скриптов
npm install --ignore-scripts

# Затем вручную сгенерировать Prisma Client
npm run db:generate
```

**Вариант 2: Повторная попытка установки**

Иногда проблема решается повторной установкой:

```powershell
# Очистить кэш и node_modules
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json -ErrorAction SilentlyContinue

# Повторная установка
npm install

# Если ошибка повторилась, выполните:
npm run db:generate
```

**Вариант 3: Продолжить работу без генерации**

Если установка завершилась с ошибкой, но пакеты установлены:

```powershell
# Проверьте, что node_modules существует
Test-Path node_modules

# Если да, просто сгенерируйте Prisma Client
npm run db:generate
```

**Примечание:** Prisma Client будет автоматически сгенерирован при выполнении `npm run build` или при запуске команд `db:push`/`db:migrate`.

### Ошибка подключения к базе данных

1. Проверьте, что файл `.env` существует и содержит правильный `DATABASE_URL`
2. Убедитесь, что connection string из NeonDB включает `?sslmode=require`
3. Проверьте, что база данных активна в панели NeonDB

### Ошибка при деплое на Vercel

1. Убедитесь, что переменная окружения `DATABASE_URL` добавлена в настройках проекта Vercel
2. После добавления переменной окружения, перезапустите деплой
3. Для продакшена выполните миграцию через Vercel CLI или добавьте скрипт миграции в build процесс

