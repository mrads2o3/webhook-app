 "use client";

import { useEffect, useMemo, useState } from "react";

function pretty(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  return JSON.stringify(value, null, 2);
}

function MethodBadge({ method }) {
  return <span className={`method method-${method.toLowerCase()}`}>{method}</span>;
}

export default function Home() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [connected, setConnected] = useState(false);
  const [baseUrl, setBaseUrl] = useState("");

  async function loadHistory() {
    const response = await fetch("/api/history?limit=10000", { cache: "no-store" });
    if (!response.ok) return;
    const data = await response.json();
    setItems(data);
    setSelected((current) => current || data[0] || null);
  }

  useEffect(() => {
    setBaseUrl(window.location.origin);
    loadHistory();

    const source = new EventSource("/api/events");
    source.onopen = () => setConnected(true);
    source.onerror = () => setConnected(false);
    source.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "webhook") {
        setItems((current) => [message.item, ...current].slice(0, 200));
        setSelected(message.item);
      }
    };

    return () => source.close();
  }, []);

  const endpoint = useMemo(() => `${baseUrl}/api/webhook`, [baseUrl]);

  async function clearHistory() {
    if (!confirm("Clear all webhook history?")) return;
    await fetch("/api/history", { method: "DELETE" });
    setItems([]);
    setSelected(null);
  }

  async function copy(text) {
    await navigator.clipboard.writeText(text);
  }

  return (
    <main className="page">
      <header className="header">
        <div>
          <h1>Webhook Receiver</h1>
          <p>Public endpoint · realtime inspector · request history</p>
        </div>
        <div className={`status ${connected ? "online" : "offline"}`}>
          <span /> {connected ? "Realtime connected" : "Disconnected"}
        </div>
      </header>

      <section className="endpoint-card">
        <div>
          <div className="label">Webhook endpoint</div>
          <code>{endpoint}</code>
        </div>
        <button onClick={() => copy(endpoint)}>Copy URL</button>
      </section>

      <section className="hint">
        Supports <b>GET</b>, <b>POST</b>, <b>PUT</b>, <b>PATCH</b> and <b>DELETE</b>.
        You can also use any path, e.g. <code>/api/webhook/payment/123</code>.
      </section>

      <div className="toolbar">
        <strong>{items.length} request{items.length === 1 ? "" : "s"}</strong>
        <button className="danger" onClick={clearHistory}>Clear history</button>
      </div>

      <section className="workspace">
        <aside className="history">
          {items.length === 0 && (
            <div className="empty">Waiting for your first webhook…</div>
          )}

          {items.map((item) => (
            <button
              className={`history-item ${selected?.id === item.id ? "active" : ""}`}
              key={item.id}
              onClick={() => setSelected(item)}
            >
              <div>
                <MethodBadge method={item.method} />
                <span className="time">
                  {new Date(item.receivedAt).toLocaleTimeString()}
                </span>
              </div>
              <div className="path">{item.path}{Object.keys(item.query || {}).length ? "?" + new URLSearchParams(item.query).toString() : ""}</div>
            </button>
          ))}
        </aside>

        <article className="detail">
          {!selected ? (
            <div className="empty large">Select a request to inspect it.</div>
          ) : (
            <>
              <div className="detail-title">
                <div>
                  <MethodBadge method={selected.method} />
                  <h2>{selected.path}</h2>
                </div>
                <button onClick={() => copy(JSON.stringify(selected, null, 2))}>Copy JSON</button>
              </div>

              <div className="meta">
                <span><b>Received:</b> {new Date(selected.receivedAt).toLocaleString()}</span>
                <span><b>IP:</b> {selected.ip}</span>
                <span><b>ID:</b> {selected.id}</span>
              </div>

              <Panel title="Query Parameters" value={pretty(selected.query)} />
              <Panel title="Headers" value={pretty(selected.headers)} />
              <Panel title="Body" value={pretty(selected.body)} />
            </>
          )}
        </article>
      </section>
    </main>
  );
}

function Panel({ title, value }) {
  return (
    <section className="panel">
      <div className="panel-header"><h3>{title}</h3></div>
      <pre>{value || "(empty)"}</pre>
    </section>
  );
}