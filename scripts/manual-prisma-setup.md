# Ручная установка Prisma Engines в Windows

Если автоматическая загрузка Prisma engines не работает из-за проблем с сетью, вы можете скачать и установить их вручную.

## Способ 1: Использование скрипта (рекомендуется)

```powershell
# Запустите скрипт для автоматической загрузки
.\scripts\download-prisma-engines.ps1
```

Скрипт автоматически:
- Определит версию Prisma из package.json
- Скачает все необходимые engines
- Установит их в правильную директорию

## Способ 2: Ручная загрузка через браузер

### Шаг 1: Определите версию engines

```powershell
# Проверьте версию Prisma
npm list prisma

# Или посмотрите в package.json
# Версия engines обычно указана в node_modules/@prisma/engines/package.json
```

### Шаг 2: Найдите URL для загрузки

Формат URL:
```
https://binaries.prisma.sh/all_commits/[ENGINE_VERSION]/windows-x64/[ENGINE_NAME]
```

Пример для Prisma 5.22.0:
- Engine version: `5.22.0-44.605197351a3c8bdd595af2d2a9bc3025bca48ea2`
- Base URL: `https://binaries.prisma.sh/all_commits/5.22.0-44.605197351a3c8bdd595af2d2a9bc3025bca48ea2/windows-x64/`

### Шаг 3: Скачайте необходимые файлы

Скачайте следующие файлы для Windows x64:

1. **query-engine-windows.exe.node**
   - URL: `https://binaries.prisma.sh/all_commits/[VERSION]/windows-x64/query-engine-windows.exe.node`

2. **migration-engine-windows.exe**
   - URL: `https://binaries.prisma.sh/all_commits/[VERSION]/windows-x64/migration-engine-windows.exe`

3. **introspection-engine-windows.exe**
   - URL: `https://binaries.prisma.sh/all_commits/[VERSION]/windows-x64/introspection-engine-windows.exe`

4. **prisma-fmt-windows.exe**
   - URL: `https://binaries.prisma.sh/all_commits/[VERSION]/windows-x64/prisma-fmt-windows.exe`

**Для Windows ARM64** замените `windows-x64` на `windows-arm64` и используйте соответствующие файлы.

### Шаг 4: Установите файлы

```powershell
# Создайте директорию для engines (если не существует)
$enginesDir = "node_modules\@prisma\engines"
New-Item -ItemType Directory -Path $enginesDir -Force

# Скопируйте скачанные файлы в эту директорию
Copy-Item "query-engine-windows.exe.node" "$enginesDir\"
Copy-Item "migration-engine-windows.exe" "$enginesDir\"
Copy-Item "introspection-engine-windows.exe" "$enginesDir\"
Copy-Item "prisma-fmt-windows.exe" "$enginesDir\"
```

### Шаг 5: Проверьте установку

```powershell
# Попробуйте сгенерировать Prisma Client
npm run db:generate
```

## Способ 3: Использование кэша из другого проекта

Если у вас есть другой проект с работающим Prisma:

```powershell
# 1. Найдите engines в рабочем проекте
$sourceEngines = "C:\path\to\working-project\node_modules\@prisma\engines"

# 2. Скопируйте engines в текущий проект
$targetEngines = "node_modules\@prisma\engines"
Copy-Item -Path "$sourceEngines\*" -Destination $targetEngines -Recurse -Force
```

## Способ 4: Использование альтернативного зеркала

```powershell
# Установите переменную окружения для использования альтернативного источника
$env:PRISMA_ENGINES_MIRROR="https://binaries.prisma.sh"

# Попробуйте снова
npm run db:generate
```

## Способ 5: Использование VPN или прокси

Если проблема в доступе к серверам Prisma:

```powershell
# Настройте прокси для npm (если используете прокси)
npm config set proxy http://proxy-server:port
npm config set https-proxy http://proxy-server:port

# Или используйте VPN для доступа к серверам
```

## Проверка версии engines

Чтобы узнать точную версию engines для вашей версии Prisma:

```powershell
# После установки зависимостей
$enginesPackage = Get-Content "node_modules\@prisma\engines\package.json" | ConvertFrom-Json
Write-Host "Engine version: $($enginesPackage.version)"
```

## Альтернатива: Пропустить генерацию

Если ничего не помогает, вы можете пропустить генерацию Prisma Client локально:

```powershell
# Prisma Client будет автоматически сгенерирован при:
npm run db:push
# или
npm run build
```

В Vercel генерация происходит автоматически при сборке, поэтому локальная генерация не обязательна для деплоя.

