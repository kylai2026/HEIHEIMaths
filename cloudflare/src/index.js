/**
 * HEIHEIMaths progress API — Supabase-compatible shape for CloudSync migration.
 *
 * GET  /api/progress?profile_key=family::student  -> { data, updated_at } | null
 * PUT  /api/progress?profile_key=family::student  body: { family_code, student_name, data }
 */

const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
};

function corsHeaders(request, env) {
  const origin = request.headers.get('Origin') || '*';
  const allow = env.ALLOWED_ORIGIN || origin;
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

function jsonResponse(body, status, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...JSON_HEADERS, ...extraHeaders },
  });
}

function parseProgressData(raw) {
  if (raw == null || raw === '') return {};
  if (typeof raw === 'object') return raw;
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function rowToClient(row) {
  if (!row) return null;
  return {
    profile_key: row.profile_key,
    family_code: row.family_code,
    student_name: row.student_name,
    data: parseProgressData(row.data),
    updated_at: row.updated_at,
  };
}

/** Pull-compatible: only data + updated_at (Supabase maybeSingle shape). */
function rowToPullShape(row) {
  if (!row) return null;
  return {
    data: parseProgressData(row.data),
    updated_at: row.updated_at,
  };
}

async function getProgress(db, profileKey) {
  return db
    .prepare(
      `SELECT profile_key, family_code, student_name, data, updated_at
       FROM progress WHERE profile_key = ?`
    )
    .bind(profileKey)
    .first();
}

function requireProfileKey(url, request, env) {
  const profileKey = url.searchParams.get('profile_key')?.trim();
  if (!profileKey) {
    return {
      error: jsonResponse(
        { error: 'profile_key query parameter is required' },
        400,
        corsHeaders(request, env)
      ),
    };
  }
  return { profileKey };
}

function optionalAuth(request, env) {
  const secret = env.API_SECRET;
  if (!secret) return null;
  const header = request.headers.get('Authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : header;
  if (token !== secret) {
    return jsonResponse({ error: 'Unauthorized' }, 401, corsHeaders(request, env));
  }
  return null;
}

async function handleGet(request, env) {
  const url = new URL(request.url);
  const parsed = requireProfileKey(url, request, env);
  if (parsed.error) return parsed.error;

  const row = await getProgress(env.DB, parsed.profileKey);
  const shape = rowToPullShape(row);
  return jsonResponse(shape, 200, corsHeaders(request, env));
}

async function handlePut(request, env) {
  const authErr = optionalAuth(request, env);
  if (authErr) return authErr;

  const url = new URL(request.url);
  const parsed = requireProfileKey(url, request, env);
  if (parsed.error) return parsed.error;

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400, corsHeaders(request, env));
  }

  const familyCode = String(body.family_code ?? body.familyCode ?? '').trim();
  const studentName = String(body.student_name ?? body.studentName ?? '').trim();
  const dataObj = body.data != null ? body.data : {};
  if (!familyCode || !studentName) {
    return jsonResponse(
      { error: 'family_code and student_name are required in body' },
      400,
      corsHeaders(request, env)
    );
  }

  const updatedAt = new Date().toISOString();
  const dataText = JSON.stringify(dataObj);

  await env.DB.prepare(
    `INSERT INTO progress (profile_key, family_code, student_name, data, updated_at)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(profile_key) DO UPDATE SET
       family_code = excluded.family_code,
       student_name = excluded.student_name,
       data = excluded.data,
       updated_at = excluded.updated_at`
  )
    .bind(parsed.profileKey, familyCode, studentName, dataText, updatedAt)
    .run();

  const row = await getProgress(env.DB, parsed.profileKey);
  return jsonResponse(rowToClient(row), 200, corsHeaders(request, env));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cors = corsHeaders(request, env);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    if (url.pathname !== '/api/progress') {
      return jsonResponse({ error: 'Not found' }, 404, cors);
    }

    if (request.method === 'GET') {
      return handleGet(request, env);
    }

    if (request.method === 'PUT') {
      return handlePut(request, env);
    }

    return jsonResponse({ error: 'Method not allowed' }, 405, cors);
  },
};
