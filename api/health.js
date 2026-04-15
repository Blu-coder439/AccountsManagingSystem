import { json } from '../lib/server/http.js';

export function GET() {
  return json({ status: 'ok', timestamp: new Date().toISOString() });
}
