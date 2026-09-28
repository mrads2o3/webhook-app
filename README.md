# Webhook Receiver

Next.js webhook receiver with:

- GET / POST / PUT / PATCH / DELETE
- Arbitrary webhook paths
- Realtime dashboard using Server-Sent Events (SSE)
- Persistent request history in `data/webhooks.json`
- Header, query, body, IP and timestamp inspection
- Copy endpoint / JSON buttons

## Run locally

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

Webhook endpoint:

```text
http://localhost:3000/api/webhook
```

Examples:

```bash
curl "http://localhost:3000/api/webhook?source=test"

curl -X POST "http://localhost:3000/api/webhook/payment" \
  -H "Content-Type: application/json" \
  -H "X-Test: hello" \
  -d '{"event":"payment.success","amount":15000}'

curl -X DELETE "http://localhost:3000/api/webhook/order/123"
```

## Public URL

### Option A: Deploy the Next.js app

Deploy this project to any Node.js host that supports Next.js. The resulting HTTPS domain is your public webhook URL, for example:

```text
https://your-domain.example/api/webhook
```

Important: this version persists history to `data/webhooks.json`, so use a persistent filesystem/volume. For serverless platforms with ephemeral filesystems, replace the store with a database.

### Option B: Expose your local server with Cloudflare Tunnel

With the app running on port 3000:

```bash
cloudflared tunnel --url http://localhost:3000
```

Cloudflare will provide a temporary public HTTPS URL. Use:

```text
https://<generated-hostname>/api/webhook
```

for webhook testing.

## Production recommendation

For a serious public webhook endpoint, add:

- webhook authentication/signature verification
- rate limiting
- payload size limit
- database storage (PostgreSQL/SQLite depending on hosting)
- request retention policy
- HTTPS
- optional IP allowlist
- secret endpoint path

Do not expose sensitive authorization headers or production webhook payloads to an untrusted public dashboard.
