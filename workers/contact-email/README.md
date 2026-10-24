# portfolio-contact-email (Cloudflare Worker + Resend)

Worker em **arquitetura DDD** que recebe o POST do formulário de contato, notifica **lwglguilherme@gmail.com** via Resend e envia e-mail de confirmação ao visitante.

## Estrutura (DDD)

```bash
src/
  domain/             # Modelo e regras (sem frameworks)
    contact/          # Aggregate ContactMessage + value objects
    mail/             # EmailMessage + port MailSender
    shared/           # DomainError
  application/        # Caso de uso SubmitContactMessage + ports de composição
  infrastructure/     # ResendMailSender, composers HTML
  interfaces/http/    # Controller HTTP, CORS, Env
  index.ts            # Composition root (export do Worker)
```

## Module aliases

| Alias               | Path                           |
| ------------------- | ------------------------------ |
| `@domain/*`         | `src/domain/*`                 |
| `@application/*`    | `src/application/*`            |
| `@infrastructure/*` | `src/infrastructure/*`         |
| `@interfaces/*`     | `src/interfaces/*`             |
| `@portfolio/*`      | `../../src/*` (SPA partilhada) |

Definidos em `tsconfig.json` (`paths`) e `wrangler.toml` (`[alias]`).

## Deploy

```bash
cd workers/contact-email
pnpm install
pnpm exec wrangler login
pnpm exec wrangler secret put RESEND_API_KEY
pnpm run deploy
```

## SPA

```bash
NEXT_PUBLIC_CONTACT_API_URL=https://portfolio-contact-email.<subdomain>.workers.dev
```

Ver também o README da raiz do monorepo.
