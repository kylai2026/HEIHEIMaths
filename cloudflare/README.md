# HEIHEIMaths Cloudflare progress (D1)

取代 Supabase Free 閒置 pause。資料表同前端 `CloudSync` 兼容。

## 安全遷移步驟（唔會掉資料）

1. **已完成**：`backups/supabase-progress-YYYYMMDD.json` 全量備份（保留，唔刪刪）
2. 登入 Cloudflare：`npx wrangler login`
3. 建立 D1：`npm run db:create` → 把回傳嘅 `database_id` 填入 `wrangler.toml`
4. 套用 schema：`npm run db:migrate:remote`
5. 匯入備份：`node scripts/import-backup.mjs --remote`
6. 部署 Worker：`npm run deploy` → 記下 `*.workers.dev` URL
7. 前端：`js/cloudflare-config.js` 填入  
   `CLOUDFLARE_PROGRESS_URL = 'https://heiheimaths-progress.<你的子網域>.workers.dev'`  
   並保持 `CLOUD_SYNC_MODE = 'dual'`（雙寫／雙讀，Cloudflare 優先）
8. 用 heihei / chunchun 登入驗證分數同卡冊正確
9. 確認無誤後先改 `CLOUD_SYNC_MODE = 'cloudflare'`，**暫時唔刪刪 Supabase project**

## 本機指令

```bash
cd cloudflare
npm install
npx wrangler login
npm run db:create
# 編輯 wrangler.toml 的 database_id
npm run db:migrate:remote
node scripts/import-backup.mjs --remote
npm run deploy
```

## API

- `GET /api/progress?profile_key=2026::heihei` → `{ data, updated_at }` 或 `null`
- `PUT /api/progress?profile_key=...` body `{ family_code, student_name, data }`
