/* Cloudflare Workers progress API（D1）。部署後填入 Worker URL。 */
const CLOUDFLARE_PROGRESS_URL = 'https://heiheimaths-progress.heiheimaths.workers.dev';
/* dual = Cloudflare 優先讀寫，讀唔到先 fallback Supabase，寫入兩邊 */
/* cloudflare = 只用 Cloudflare */
/* supabase = 只用 Supabase（舊行為） */
const CLOUD_SYNC_MODE = 'dual';
