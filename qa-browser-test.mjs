import { chromium } from "playwright";

const scenarios = [
  { name: "vuoto", niche: "", offer: "", audience: "", problem: "", result: "", platform: "Instagram", goal: "vendere", tone: "professionale", type: "post" },
  { name: "corto", niche: "fitness", offer: "scheda", audience: "persone", problem: "costanza", result: "forma", platform: "Instagram", goal: "educare", tone: "amichevole", type: "reel" },
  { name: "lungo", niche: "ecommerce di prodotti artigianali per la casa con materiali naturali e packaging curato", offer: "set di candele e diffusori profumati fatti a mano", audience: "persone che vogliono rendere la casa piu accogliente senza prodotti industriali", problem: "hanno provato prodotti anonimi che profumano poco e non raccontano niente", result: "creare un ambiente piu caldo, personale e curato", platform: "Facebook", goal: "creare fiducia", tone: "professionale", type: "post" },
  { name: "marketing", niche: "tool marketing", offer: "Tool AI che genera hook, caption e idee per creator e freelance", audience: "creator e freelance", problem: "non sanno cosa pubblicare", result: "creare contenuti piu velocemente", platform: "Instagram", goal: "ottenere contatti", tone: "diretto", type: "reel" },
  { name: "ristorante", niche: "ristorante locale", offer: "Ristorante di cucina tradizionale molisana con piatti fatti in casa e ingredienti locali", audience: "persone che amano la cucina autentica", problem: "vogliono mangiare bene fuori casa senza scegliere posti anonimi", result: "vivere una cena con sapori autentici", platform: "Facebook", goal: "vendere", tone: "amichevole", type: "post" },
  { name: "estetista", niche: "centro estetico", offer: "trattamenti viso anti-age", audience: "persone che vogliono una pelle piu luminosa e curata", problem: "pelle spenta e segni del tempo", result: "sentirsi piu sicure e curate", platform: "Instagram", goal: "ottenere contatti", tone: "professionale", type: "storia" },
  { name: "fotografo", niche: "fotografo matrimonio", offer: "reportage naturali spontanei ed eleganti", audience: "coppie che si sposano", problem: "temono foto rigide e poco autentiche", result: "conservare ricordi emozionanti del matrimonio", platform: "Instagram", goal: "creare fiducia", tone: "amichevole", type: "video breve" },
  { name: "immobiliare", niche: "agenzia immobiliare", offer: "valutazione e vendita appartamenti", audience: "proprietari che vogliono vendere casa", problem: "non sanno valorizzare l'immobile", result: "trovare acquirenti interessati", platform: "LinkedIn", goal: "ottenere contatti", tone: "professionale", type: "post" },
  { name: "fitness", niche: "personal trainer online", offer: "percorso allenamento e alimentazione senza diete estreme", audience: "uomini che vogliono perdere peso", problem: "mollano dopo pochi giorni", result: "dimagrire con costanza ed energia", platform: "TikTok", goal: "educare", tone: "motivazionale", type: "reel" },
  { name: "ecommerce", niche: "ecommerce beauty", offer: "prodotti skincare naturali", audience: "persone con routine viso confusa", problem: "comprano prodotti ma non vedono una pelle piu luminosa", result: "routine semplice e pelle piu curata", platform: "Instagram", goal: "vendere", tone: "persuasivo", type: "carosello" },
  { name: "abbigliamento", niche: "abbigliamento personalizzato", offer: "capi personalizzati su giacca di jeans camicia militare e camicia di jeans", audience: "persone che amano la moda e vogliono capi unici che parlano di se", problem: "non vogliono capi anonimi e sempre uguali", result: "indossare qualcosa che racconti personalita", platform: "Instagram", goal: "vendere", tone: "amichevole", type: "reel" },
  { name: "wedding", niche: "wedding planner", offer: "organizzazione matrimoni eleganti e personalizzati", audience: "coppie che vogliono un matrimonio curato", problem: "hanno paura di stress e dettagli fuori controllo", result: "vivere il giorno con serenita", platform: "Instagram", goal: "ottenere contatti", tone: "professionale", type: "post" },
  { name: "consulenza", niche: "consulenza finanziaria", offer: "percorso per organizzare risparmi e investimenti", audience: "professionisti che vogliono gestire meglio il denaro", problem: "non hanno un piano chiaro", result: "prendere decisioni piu consapevoli", platform: "LinkedIn", goal: "creare fiducia", tone: "professionale", type: "post" }
];

const forbiddenNonMarketing = [
  "ti mancano idee",
  "non sai cosa pubblicare",
  "contenuti improvvisati",
  "struttura dei contenuti",
  "algoritmo",
  "content creation",
  "pubblicare di più"
];

async function fillByLabel(page, label, value) {
  const field = page.getByLabel(label, { exact: true });
  await field.fill(value);
}

async function chooseButton(page, text) {
  await page.getByRole("button", { name: new RegExp(text, "i") }).first().click();
}

async function chooseSelect(page, index, value) {
  await page.locator("select").nth(index).selectOption(value);
}

function analyzeText(scenario, text) {
  const lower = text.toLowerCase();
  const issues = [];
  if (scenario.name !== "marketing") {
    for (const forbidden of forbiddenNonMarketing) {
      if (lower.includes(forbidden)) issues.push(`forbidden:${forbidden}`);
    }
  }
  if (/\b(donne|uomini)\s+\d{2}\s*\/\s*\d{2}\s*anni\b/i.test(text)) issues.push("invented-age-gender");
  if (lower.includes("donne 30") || lower.includes("uomini 30")) issues.push("invented-demographic");
  for (const section of ["10 Hook specifici", "5 Caption complete", "5 CTA diverse", "Struttura reel", "Carosello", "Idee", "Angoli", "Errori"]) {
    if (!text.includes(section)) issues.push(`missing-section:${section}`);
  }
  if (text.length < 2500) issues.push("too-short-output");
  return issues;
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const results = [];
  const page = await browser.newPage({ viewport: { width: 390, height: 900 } });
  await page.goto("http://127.0.0.1:3000", { waitUntil: "networkidle" });

  const emptyDisabled = await page.getByRole("button", { name: /Genera i miei contenuti/i }).isDisabled();
  results.push({ name: "empty-state", issues: emptyDisabled ? [] : ["generate-enabled-when-empty"] });

  for (let i = 0; i < 30; i++) {
    const scenario = scenarios[i % scenarios.length];
    await page.goto("http://127.0.0.1:3000", { waitUntil: "networkidle" });
    await fillByLabel(page, "Nicchia / settore", scenario.niche);
    await fillByLabel(page, "Prodotto, servizio o idea", scenario.offer);
    await page.getByLabel("Pubblico target").fill(scenario.audience);
    await page.getByLabel("Problema principale del pubblico").fill(scenario.problem);
    await page.getByLabel("Risultato desiderato").fill(scenario.result);
    if (scenario.platform) await chooseButton(page, scenario.platform.replace("YouTube Shorts", "YouTube"));
    await chooseSelect(page, 0, scenario.goal);
    await chooseSelect(page, 1, scenario.tone);
    await chooseSelect(page, 2, scenario.type);
    const canGenerate = !(await page.getByRole("button", { name: /Genera i miei contenuti/i }).isDisabled());
    if (!canGenerate) {
      results.push({ name: `${i + 1}-${scenario.name}`, issues: ["generate-disabled"] });
      continue;
    }
    await page.getByRole("button", { name: /Genera i miei contenuti/i }).click();
    await page.getByText("Piano contenuti pronto da adattare").waitFor({ timeout: 5000 });
    const text = await page.locator("body").innerText();
    const issues = analyzeText(scenario, text);
    await page.getByRole("button", { name: /Copia tutto/i }).click();
    const copiedLabel = await page.getByRole("button", { name: /Copiato|Copia tutto/i }).first().innerText().catch(() => "");
    if (!/Copiato|Copia tutto/.test(copiedLabel)) issues.push("copy-all-no-feedback");
    results.push({ name: `${i + 1}-${scenario.name}`, issues });
  }

  for (const viewport of [
    { width: 360, height: 800 },
    { width: 390, height: 900 },
    { width: 430, height: 900 },
    { width: 768, height: 1024 },
    { width: 1366, height: 900 }
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("http://127.0.0.1:3000", { waitUntil: "networkidle" });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
    results.push({ name: `viewport-${viewport.width}`, issues: overflow ? ["horizontal-overflow"] : [] });
  }

  await browser.close();
  console.log(JSON.stringify(results, null, 2));
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
