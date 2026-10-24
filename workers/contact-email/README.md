# portfolio-contact-email (Cloudflare Worker + Resend)

Recebe o POST do formulário de contacto da SPA, envia o e-mail para **lwglguilherme@gmail.com** via [Resend](https://resend.com) e, em caso de sucesso, envia o e-mail de confirmação ao visitante.

## Pré-requisitos

1. Conta [Cloudflare](https://dash.cloudflare.com) (Workers free)
2. Conta [Resend](https://resend.com) — criar API key
3. Node.js + `pnpm` / `npm`

## Deploy

```bash
cd workers/contact-email
pnpm install   # ou npm install
pnpm exec wrangler login
pnpm exec wrangler secret put RESEND_API_KEY
# colar a chave re_...

pnpm run deploy
```

Anota a URL do Worker, por exemplo:

`https://portfolio-contact-email.<subdomain>.workers.dev`

## SPA (GitHub Pages)

Em `portfolio-spa`, define (build-time):

```bash
# .env.local (dev) ou secret do CI
NEXT_PUBLIC_CONTACT_API_URL=https://portfolio-contact-email.<subdomain>.workers.dev
```

No GitHub Actions, adiciona o secret `NEXT_PUBLIC_CONTACT_API_URL` e passa-o no step de `pnpm build`.

## Variáveis (`wrangler.toml` / secrets)

| Nome               | Tipo   | Descrição                                   |
| ------------------ | ------ | ------------------------------------------- |
| `RESEND_API_KEY`   | secret | API key Resend                              |
| `CONTACT_TO_EMAIL` | var    | Destino (default `lwglguilherme@gmail.com`) |
| `MAIL_FROM`        | var    | Remetente verificado no Resend              |
| `ALLOWED_ORIGINS`  | var    | Origins CORS permitidas                     |

Em produção, configura um domínio verificado no Resend e actualiza `MAIL_FROM` (ex.: `Contacto <noreply@seudominio.com>`).

## Teste local

```bash
pnpm exec wrangler dev
# POST http://127.0.0.1:8787
```
