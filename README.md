# portfolio-spa

Página pessoal estática de Guilherme Gonçalves — Next.js (App Router), TypeScript, Zustand (Flux), Neobrutalism, i18n (pt-BR / en-GB) e Yup.

## Deploy (GitHub Pages)

Repositório: `portfolio-spa` sob [lwglg](https://github.com/lwglg).

URL: `https://lwglg.github.io/portfolio-spa/`

| Item               | Valor                                                     |
| ------------------ | --------------------------------------------------------- |
| `basePath`         | `/portfolio-spa` em produção                              |
| Contact e-mail API | Cloudflare Worker + Resend (ver `workers/contact-email/`) |

### Secret do CI

No repositório GitHub → Settings → Secrets:

- `NEXT_PUBLIC_CONTACT_API_URL` — URL do Worker (ex. `https://portfolio-contact-email.<subdomain>.workers.dev`)

## Contact form (e-mail)

O formulário **não** usa SMTP no GitHub Pages. O fluxo é:

1. SPA → `POST` JSON → **Cloudflare Worker**
2. Worker → **Resend** → `lwglguilherme@gmail.com` (notificação)
3. Se sucesso → Resend → e-mail de **confirmação** ao visitante

Documentação completa: [`workers/contact-email/README.md`](workers/contact-email/README.md).

```bash
# Local sem Worker (mock)
pnpm dev

# Com Worker local
cd workers/contact-email && pnpm install && pnpm dev
# .env.local na raiz da SPA:
# NEXT_PUBLIC_CONTACT_API_URL=http://127.0.0.1:8787
```

## Scripts

```bash
pnpm install
pnpm dev
pnpm test
pnpm build
pnpm lint
```
