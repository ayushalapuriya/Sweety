import { createClient } from 'redis';

let client;
export async function getCache(key) {
  if (!process.env.REDIS_URL) return null;
  client ??= createClient({ url: process.env.REDIS_URL });
  if (!client.isOpen) await client.connect();
  const value = await client.get(key);
  return value ? JSON.parse(value) : null;
}
export async function setCache(key, value, seconds = 60) {
  if (!process.env.REDIS_URL) return;
  client ??= createClient({ url: process.env.REDIS_URL });
  if (!client.isOpen) await client.connect();
  await client.setEx(key, seconds, JSON.stringify(value));
}
export async function clearReportCache(userId) {
  if (!process.env.REDIS_URL) return;
  client ??= createClient({ url: process.env.REDIS_URL });
  if (!client.isOpen) await client.connect();
  const keys = await client.keys(`report:${userId}:*`);
  if (keys.length) await client.del(keys);
}
