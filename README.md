# Next.js + Prisma + Supabase

Минимальный рабочий проект на Next.js (App Router) + Prisma + Supabase (PostgreSQL), готовый к деплою на Vercel.

## Требования

- Node.js 18+ 
- npm или yarn
- Аккаунт на [Supabase](https://supabase.com) для PostgreSQL базы данных

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

**Примечание:** Если при генерации возникает ошибка `ECONNRESET`, это не критично. Prisma Client будет автоматически сгенерирован при выполнении `npm run db:push`, `npm run db:migrate` или `npm run build`. См. раздел "Решение проблем" для подробностей.

### 3. Настройка базы данных (Supabase)

1. Создайте аккаунт на [supabase.com](https://supabase.com)
2. Создайте новый проект
3. В настройках проекта найдите:
   - **Project URL** (например: `https://abcdefghijklmnop.supabase.co`)
   - **Database Password** (пароль, который вы установили при создании проекта)

### 4. Настройка переменных окружения

**Вариант A: Использование скрипта (рекомендуется)**

```powershell
# Запустите скрипт настройки
.\scripts\setup-env.ps1 -ProjectUrl "https://your-project-ref.supabase.co" -DbPassword "your-database-password"
```

**Вариант B: Ручная настройка**

Создайте файл `.env` в корне проекта:

```powershell
# Скопируйте env.example.txt в .env
Copy-Item env.example.txt .env
```

Отредактируйте `.env` и добавьте ваши данные Supabase:

```env
# Supabase Configuration
SUPABASE_PROJECT_URL="https://your-project-ref.supabase.co"
SUPABASE_DB_PASSWORD="your-database-password"

# Database Connection String
# Формат: postgresql://postgres:[PASSWORD]@[PROJECT_REF].supabase.co:5432/postgres
DATABASE_URL="postgresql://postgres:your-database-password@your-project-ref.supabase.co:5432/postgres?sslmode=require"
```

**Как получить Project Reference:**
- Из Project URL: `https://abcdefghijklmnop.supabase.co` → `abcdefghijklmnop`
- Или в настройках проекта Supabase: Settings → API → Project URL

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

**В Supabase** это выполнять нельзя - Supabase это только база данных (PostgreSQL), там нет возможности запускать npm команды.

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
4. В настройках проекта добавьте переменные окружения:
   - **Name**: `DATABASE_URL`
   - **Value**: `postgresql://postgres:[YOUR_PASSWORD]@[YOUR_PROJECT_REF].supabase.co:5432/postgres?sslmode=require`
   
   Или добавьте отдельно:
   - **Name**: `SUPABASE_PROJECT_URL`
   - **Value**: `https://your-project-ref.supabase.co`
   - **Name**: `SUPABASE_DB_PASSWORD`
   - **Value**: `your-database-password`
5. Нажмите "Deploy"

### 4. Настройка переменных окружения в Vercel

После первого деплоя:
1. Перейдите в настройки проекта в Vercel
2. Откройте "Environment Variables"
3. Добавьте `DATABASE_URL` с вашим connection string из Supabase:
   ```
   postgresql://postgres:[PASSWORD]@[PROJECT_REF].supabase.co:5432/postgres?sslmode=require
   ```
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
├── env.example.txt         # Пример файла с переменными окружения
├── scripts/
│   ├── setup-env.ps1       # Скрипт для настройки .env из Supabase
│   ├── download-prisma-engines.ps1  # Скрипт для ручной загрузки Prisma engines
│   └── manual-prisma-setup.md     # Подробная инструкция по ручной установке
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
- Supabase поддерживает serverless режим и отлично работает с Vercel

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

### Ошибка `ECONNRESET` при `npm run db:generate`

Если при генерации Prisma Client возникает ошибка `ECONNRESET` при загрузке engines:

**Вариант 1: Пропустить генерацию (рекомендуется для разработки)**

Prisma Client будет автоматически сгенерирован при выполнении других команд:

```powershell
# Просто пропустите db:generate и продолжайте работу
# Prisma Client сгенерируется автоматически при:
npm run db:push
# или
npm run build
```

**Вариант 2: Повторные попытки**

Иногда помогает повторный запуск:

```powershell
# Попробуйте несколько раз
npm run db:generate
# Если не сработало, попробуйте еще раз через несколько секунд
npm run db:generate
```

**Вариант 3: Использование переменных окружения для Prisma**

Настройте Prisma для использования альтернативного источника engines:

```powershell
# Установите переменную окружения перед генерацией
$env:PRISMA_ENGINES_MIRROR="https://binaries.prisma.sh"
npm run db:generate
```

**Вариант 4: Использование кэшированных engines**

Если engines уже были загружены ранее:

```powershell
# Проверьте наличие engines в кэше
Test-Path "$env:USERPROFILE\.cache\prisma"

# Если engines есть в кэше, Prisma может использовать их
npm run db:generate
```

**Вариант 5: Продолжить без генерации**

Если генерация не критична на данном этапе:

```powershell
# Просто продолжайте работу - Prisma Client будет сгенерирован:
# 1. При сборке: npm run build
# 2. При применении схемы: npm run db:push
# 3. При создании миграции: npm run db:migrate
```

**Важно:** В Vercel генерация Prisma Client происходит автоматически при сборке, поэтому локальная генерация не обязательна для деплоя.

### Ручная загрузка Prisma Engines (Windows)

Если автоматическая загрузка engines не работает, вы можете скачать и установить их вручную:

**Способ 1: Использование скрипта (рекомендуется)**

```powershell
# Автоматическая загрузка и установка engines
.\scripts\download-prisma-engines.ps1
```

Скрипт автоматически определит версию Prisma и загрузит все необходимые engines.

**Способ 2: Ручная загрузка через браузер**

1. **Определите версию engines:**
   ```powershell
   # Проверьте версию в package.json или выполните:
   npm list prisma
   ```

2. **Скачайте файлы вручную:**
   
   Для Prisma 5.22.0 (Windows x64), скачайте с:
   ```
   https://binaries.prisma.sh/all_commits/5.22.0-44.605197351a3c8bdd595af2d2a9bc3025bca48ea2/windows-x64/
   ```
   
   Необходимые файлы:
   - `query-engine-windows.exe.node`
   - `migration-engine-windows.exe`
   - `introspection-engine-windows.exe`
   - `prisma-fmt-windows.exe`

3. **Установите файлы:**
   ```powershell
   # Создайте директорию
   $enginesDir = "node_modules\@prisma\engines"
   New-Item -ItemType Directory -Path $enginesDir -Force
   
   # Скопируйте скачанные файлы
   Copy-Item "query-engine-windows.exe.node" "$enginesDir\"
   Copy-Item "migration-engine-windows.exe" "$enginesDir\"
   Copy-Item "introspection-engine-windows.exe" "$enginesDir\"
   Copy-Item "prisma-fmt-windows.exe" "$enginesDir\"
   ```

4. **Проверьте установку:**
   ```powershell
   npm run db:generate
   ```

**Способ 3: Копирование из другого проекта**

Если у вас есть рабочий проект с Prisma:

```powershell
# Скопируйте engines из рабочего проекта
$source = "C:\path\to\working-project\node_modules\@prisma\engines"
$target = "node_modules\@prisma\engines"
Copy-Item -Path "$source\*" -Destination $target -Recurse -Force
```

**Подробная инструкция:** См. `scripts/manual-prisma-setup.md` для детальных шагов.

### Ошибка подключения к базе данных

1. Проверьте, что файл `.env` существует и содержит правильный `DATABASE_URL`
2. Убедитесь, что connection string включает `?sslmode=require`
3. Проверьте формат DATABASE_URL: `postgresql://postgres:[PASSWORD]@[PROJECT_REF].supabase.co:5432/postgres?sslmode=require`
4. Проверьте, что проект активен в панели Supabase
5. Убедитесь, что Project Reference и Database Password указаны правильно

### Ошибка при деплое на Vercel

1. Убедитесь, что переменная окружения `DATABASE_URL` добавлена в настройках проекта Vercel
2. После добавления переменной окружения, перезапустите деплой
3. Для продакшена выполните миграцию через Vercel CLI или добавьте скрипт миграции в build процесс

