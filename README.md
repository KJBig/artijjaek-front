# artijjaek-front

## API proxy routing

This project is a static `Vite + Vue` frontend. To keep email links in the form below while still letting the backend handle the request:

`https://www.artijjaek.kr/api/v1/email-links/{articleId}?trackingToken={token}`

the hosting layer must proxy `/api/*` to the backend origin.

### Included configs

- `vercel.json`
  Uses rewrites so `https://www.artijjaek.kr/api/*` is forwarded to `https://prod-server.artijjaek.kr/api/*`.
- `nginx.conf`
  Sample reverse-proxy config for Nginx-based hosting.
- `vite.config.ts`
  Adds a local dev proxy for `/api/*` so the same-origin path can be tested locally.

### Local development

If you want the Vite dev server to forward `/api/*` somewhere other than `http://localhost:8080`, set:

```bash
VITE_API_PROXY_TARGET=https://prod-server.artijjaek.kr
```

### Routing intent

- `www.artijjaek.kr -> /api/* -> backend`
- minimum required path: `/api/v1/email-links/*`
- recommended broader rule: proxy all `/api/*`
