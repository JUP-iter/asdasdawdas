# Развёртывание MadeByAibek на Vercel

Проект уже подготовлен: Vite собирает интерфейс в `dist`, весь Express API экспортируется как Vercel Function из `api/[...path].ts`, а постоянные данные пользователей хранятся в Turso через libSQL.

> Важно: ключ DeepSeek, который был отправлен в чат, нужно отозвать и создать заново. Не вставляйте ключ в исходный код, `.env.example`, GitHub или `vercel.json`.

## 1. Создать постоянную базу в Turso

1. Откройте <https://turso.tech> и войдите в аккаунт.
2. В панели Turso создайте базу с именем `madebyaibek`.
3. Откройте созданную базу и скопируйте:
   - Database URL — выглядит как `libsql://madebyaibek-....turso.io`;
   - Database auth token — длинный секретный токен.

Если используете Turso CLI, те же значения можно получить командами:

```powershell
turso db show --url madebyaibek
turso db tokens create madebyaibek
```

Таблицы вручную создавать не нужно: приложение создаст и обновит схему при первом запросе.

## 2. Отправить подготовленные изменения в GitHub

В терминале VS Code, находясь в корне проекта, выполните:

```powershell
git add .env.example package.json package-lock.json server/db.ts server/index.ts api vercel.json VERCEL_DEPLOY.md
git commit -m "Adapt app for Vercel and Turso"
git push origin main
```

Файл `.env` в GitHub отправлять нельзя. Он уже исключён через `.gitignore`.

## 3. Импортировать GitHub-проект в Vercel

1. Откройте <https://vercel.com/new>.
2. Нажмите **Import** напротив репозитория `JUP-iter/asdasdawdas`.
3. В поле **Project Name** можно написать `madebyaibek`.
4. **Root Directory** оставьте `./`.
5. Framework должен определиться как **Vite**.
6. Не переопределяйте Build Command и Output Directory: они уже заданы в `vercel.json`.
7. До нажатия Deploy откройте **Environment Variables**.

## 4. Ввести переменные окружения

Добавляйте каждую строку отдельно. Для секретов используйте только Vercel: **Project → Settings → Environment Variables**.

| Name | Value |
|---|---|
| `TURSO_DATABASE_URL` | URL базы из Turso, например `libsql://madebyaibek-....turso.io` |
| `TURSO_AUTH_TOKEN` | токен базы из Turso |
| `AI_PROVIDER` | `deepseek` |
| `AI_API_KEY` | новый ключ DeepSeek, не тот, который был опубликован в чате |
| `AI_MODEL` | `deepseek-flash` |
| `AI_BASE_URL` | `https://api.deepseek.com` |
| `APP_URL` | сначала предполагаемый адрес, например `https://madebyaibek.vercel.app` |
| `EMAIL_PROVIDER` | `console` для тестирования или `resend` для реальных писем |

Для каждой переменной отметьте **Production**, **Preview** и **Development**, затем нажмите **Save**. `PORT` и `NODE_ENV` добавлять не нужно — ими управляет Vercel.

Если нужен настоящий сброс пароля по email, дополнительно добавьте:

| Name | Value |
|---|---|
| `EMAIL_PROVIDER` | `resend` |
| `RESEND_API_KEY` | API-ключ Resend |
| `EMAIL_FROM` | подтверждённый адрес, например `MadeByAibek <noreply@your-domain.com>` |

## 5. Запустить и проверить

1. Нажмите **Deploy**.
2. После завершения откройте выданный Vercel URL.
3. Если фактический URL отличается от значения `APP_URL`, исправьте `APP_URL` в **Settings → Environment Variables** и сделайте **Deployments → Redeploy**.
4. Откройте `https://ВАШ-ДОМЕН/api/health`. Ожидаемый ответ:

```json
{
  "status": "ok",
  "database": "turso",
  "aiProvider": "deepseek"
}
```

5. Зарегистрируйте нового пользователя, завершите одно упражнение и обновите страницу. XP, оценки навыков и история должны сохраниться.

Если `/api/health` возвращает ошибку, сначала проверьте точное написание `TURSO_DATABASE_URL` и `TURSO_AUTH_TOKEN`, затем выполните Redeploy. Изменения переменных не применяются к старому deployment автоматически.
