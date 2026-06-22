# Stacks Plugins — Landing Page

Marketing site for the Stacks agent plugins project. Showcases **ElizaOS**, **OpenClaw**, and **Hermes** framework adapters.

## Development

```bash
cd web
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_DOCS_URL to your Mintlify domain
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_DOCS_URL` | Base URL for Mintlify docs (e.g. `https://stacks-plugins.mintlify.app`). Framework and resource links are appended to this. |

## Build

```bash
npm run build
npm run start
```

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS v4
