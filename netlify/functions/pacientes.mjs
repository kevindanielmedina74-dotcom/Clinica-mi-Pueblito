import { getStore } from '@netlify/blobs';

export default async (req, context) => {
  const store = getStore('pacientes');

  if (req.method === 'GET') {
    const data = await store.get('pacientes', { type: 'json' });
    return new Response(JSON.stringify(data || []), {
      headers: { 'content-type': 'application/json' }
    });
  }

  if (req.method === 'POST') {
    const body = await req.json();
    const existing = await store.get('pacientes', { type: 'json' }) || [];
    existing.push(body);
    await store.setJSON('pacientes', existing);
    return new Response(JSON.stringify(existing), {
      headers: { 'content-type': 'application/json' }
    });
  }

  if (req.method === 'DELETE') {
    const url = new URL(req.url);
    const id = Number(url.searchParams.get('id'));
    const existing = await store.get('pacientes', { type: 'json' }) || [];
    const filtered = existing.filter(p => p.id !== id);
    await store.setJSON('pacientes', filtered);
    return new Response(JSON.stringify(filtered), {
      headers: { 'content-type': 'application/json' }
    });
  }

  return new Response('Method not allowed', { status: 405 });
};
