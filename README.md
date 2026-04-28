# Generatore Contenuti Social PRO

Tool web Next.js pronto per Vercel che genera contenuti social reali tramite OpenAI, usando una route API server-side e validazione Zod per input e output.

## Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- API route server-side
- OpenAI API
- Zod

## Installazione

```bash
npm install
```

## Variabili ambiente

Crea un file `.env.local` partendo dall'esempio:

```bash
cp .env.local.example .env.local
```

Inserisci la tua chiave OpenAI:

```env
OPENAI_API_KEY=la-tua-chiave
OPENAI_TEXT_MODEL=gpt-4.1
```

La chiave resta solo lato server. Il frontend chiama esclusivamente `POST /api/generate-social` e non usa variabili `NEXT_PUBLIC_OPENAI_API_KEY`.

## Avvio locale

```bash
npm run dev
```

Apri `http://localhost:3000`.

## Build

```bash
npm run build
```

## Deploy su Vercel

1. Carica il progetto su GitHub, GitLab o Bitbucket.
2. Importa il repository su Vercel.
3. In `Settings > Environment Variables`, aggiungi:
   - `OPENAI_API_KEY`
   - `OPENAI_TEXT_MODEL` con valore `gpt-4.1`
4. Avvia il deploy.

## Funzionamento

Il form raccoglie descrizione, piattaforma, tono e obiettivo. La route `app/api/generate-social/route.ts` valida l'input con Zod, controlla `OPENAI_API_KEY`, chiama OpenAI lato server, richiede JSON strutturato e valida nuovamente l'output prima di inviarlo al frontend.
