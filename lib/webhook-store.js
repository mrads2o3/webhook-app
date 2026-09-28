import fs from "node:fs";
import path from "node:path";

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "webhooks.json");

function ensureStore() {
  fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, "[]", "utf8");
}

function readAll() {
  ensureStore();
  try {
    return JSON.parse(fs.readFileSync(dataFile, "utf8"));
  } catch {
    return [];
  }
}

function writeAll(items) {
  ensureStore();
  fs.writeFileSync(dataFile, JSON.stringify(items, null, 2), "utf8");
}

function getBus() {
  if (!globalThis.__webhookBus) {
    globalThis.__webhookBus = new Set();
  }
  return globalThis.__webhookBus;
}

export function subscribe(listener) {
  const bus = getBus();
  bus.add(listener);
  return () => bus.delete(listener);
}

function publish(item) {
  for (const listener of getBus()) {
    try { listener(item); } catch {}
  }
}

export function addWebhook(item) {
  const items = readAll();
  items.unshift(item);
  writeAll(items.slice(0, 1000));
  publish(item);
  return item;
}

export function getWebhooks(limit = 100) {
  return readAll().slice(0, Math.max(1, Math.min(Number(limit) || 100, 1000)));
}

export function getWebhook(id) {
  return readAll().find((item) => item.id === id) || null;
}

export function deleteWebhook(id) {
  const items = readAll();
  const next = items.filter((item) => item.id !== id);
  if (next.length === items.length) return false;
  writeAll(next);
  return true;
}

export function clearWebhooks() {
  writeAll([]);
}

export function createId() {
  return `${Date.now()}-${crypto.randomUUID()}`;
}