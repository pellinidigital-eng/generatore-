# Generatore Contenuti Social PRO — progetto canonico

**Deployment di produzione associato al progetto Vercel `generatore`:** `https://generatore.vercel.app`. Il repository `generatore-` non è intercambiabile con `generatore-contenuti-social-pro` (vecchio progetto distinto).

## Comportamento reale

La UI principale in `components/social-content-generator.tsx` produce contenuti **localmente nel browser** tramite `generateLocalContent`. La route `POST /api/generate-social` esiste per integrazione OpenAI opzionale, ma **non è usata dalla UI attuale** e resta disabilitata per impostazione predefinita (`SOCIAL_PRO_ENABLE_OPENAI_API` deve essere esattamente `true` per abilitarla). Non descrivere il generatore locale come chiamata AI remota in materiali commerciali senza verifica.

## Accesso protetto (branch di review, NON ancora attivo in produzione)

Il middleware verifica una sessione firmata e blocca homepage e API per visitatori senza autorizzazione. Il cliente parte da WordPress/EDD, che deve verificare l'acquisto e generare un JWT a scadenza breve, poi apre `/access?token=<JWT>`. La route scambia il token per un cookie HttpOnly firmato di 6 ore e reindirizza a `/`; `/access-denied` resta pubblica. Token e sessioni scaduti o configurazione incompleta sono rifiutati.

Variabili server necessarie **solo dopo conferma prodotto EDD e revisione della PR**:

- `PELLINIDIGITAL_TOOL_ACCESS_SECRET` — segreto condiviso con il firmatario WordPress, mai committare.
- `PELLINIDIGITAL_TOOL_ACCESS_KEY_ID` — ID chiave che corrisponde a WordPress.
- `PELLINIDIGITAL_TOKEN_ISSUER` — issuer identico a quello firmato da WordPress.
- `PELLINIDIGITAL_TOOL_ID` — ID tool identico al claim.
- `PELLINIDIGITAL_EDD_PRODUCT_ID` — ID numerico del prodotto **reale** da DB EDD; non inventarlo.

Non impostare credenziali, prezzi o EDD ID di produzione durante la review. L'autenticazione blocca l'interfaccia web, **non rende segreto il codice di generazione inviato al browser**. Valutare questa limitazione prima della vendita.

La route OpenAI opzionale richiede `SOCIAL_PRO_ENABLE_OPENAI_API=true`, `OPENAI_API_KEY` e facoltativamente `OPENAI_TEXT_MODEL`; non abilitarla senza una decisione esplicita sui costi.

## Test locali / CI

```bash
npm install
npm run lint
npx tsc --noEmit
node --experimental-strip-types --test tests/protected-access.test.mjs
npm run build
node scripts/smoke-access.mjs
```

Lo smoke test usa ID EDD `999` e segreti **esclusivamente fittizi** nel processo di test. Non verifica l'integrazione WordPress reale.

## SEO e accessibilità

L'applicazione riservata ha metadata `robots: noindex, nofollow` (anche pagina di accesso negato), titolo e descrizione in italiano. **Indicizzare la landing commerciale su WordPress**, non la UI privata; verificare canonical, sitemap, robots, gerarchia H1, linking interno e mobile nella landing prima del go-live. Nessun claim di ranking/velocità senza misure.

## Go-live: controlli obbligatori

1. Verificare in Vercel il collegamento repository → progetto `generatore`, ambiente di preview e produzione.
2. Ottenere ID EDD vero, entitlement WordPress, token e configurazione segreti corrispondenti.
3. QA su preview: visitatore bloccato, utente autorizzato entra, scadenza, manomissione, API protetta, logout/scadenza.
4. Verificare piano Vercel idoneo a uso commerciale; non assumere che Hobby sia adatto.
5. Test checkout EDD in test mode, gateway reali **solo con approvazione**, acquisto end-to-end controllato.
6. Review esplicita prima di merge o deployment di produzione; non pubblicare automaticamente le modifiche.
