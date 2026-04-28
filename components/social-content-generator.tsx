"use client";

import { type Dispatch, type FormEvent, type ReactNode, type SetStateAction, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Platform = "Instagram" | "TikTok" | "Facebook" | "YouTube Shorts" | "LinkedIn";
type Goal = "vendere" | "ottenere contatti" | "aumentare engagement" | "educare" | "creare fiducia";
type Tone = "diretto" | "educativo" | "persuasivo" | "amichevole" | "professionale" | "motivazionale";
type ContentType = "reel" | "carosello" | "post" | "storia" | "video breve";
type NicheCategory = "wellness" | "beauty" | "localFood" | "realEstate" | "knowledge" | "neutral";

type GeneratorForm = {
  niche: string;
  offer: string;
  audience: string;
  problem: string;
  desiredResult: string;
  platform: Platform;
  goal: Goal;
  tone: Tone;
  contentType: ContentType;
};

type GeneratedContent = {
  hooks: string[];
  captions: { title: string; text: string }[];
  ctas: string[];
  reel: {
    duration: string;
    scenes: { time: string; scene: string; screenText: string; voiceover: string; visual: string }[];
  };
  carousel: { slide: number; role: string; title: string; text: string; visual: string }[];
  ideas: string[];
  angles: { title: string; description: string }[];
  mistakes: string[];
};

type StrategicInput = {
  niche: string;
  naturalNiche: string;
  offer: string;
  naturalOffer: string;
  audience: string;
  naturalAudience: string;
  problem: string;
  naturalProblem: string;
  result: string;
  naturalResult: string;
  category: NicheCategory;
  platform: Platform;
  goal: Goal;
  tone: Tone;
  contentType: ContentType;
  opener: string;
};

const platforms: Platform[] = ["Instagram", "TikTok", "Facebook", "YouTube Shorts", "LinkedIn"];
const goals: Goal[] = ["vendere", "ottenere contatti", "aumentare engagement", "educare", "creare fiducia"];
const tones: Tone[] = ["diretto", "educativo", "persuasivo", "amichevole", "professionale", "motivazionale"];
const contentTypes: ContentType[] = ["reel", "carosello", "post", "storia", "video breve"];

const initialForm: GeneratorForm = {
  niche: "",
  offer: "",
  audience: "",
  problem: "",
  desiredResult: "",
  platform: "Instagram",
  goal: "vendere",
  tone: "diretto",
  contentType: "reel"
};

const platformStyles: Record<Platform, string> = {
  Instagram: "border-pink-300 bg-gradient-to-br from-pink-50 via-orange-50 to-purple-50 text-pink-950 ring-pink-200",
  TikTok: "border-cyan-300 bg-gradient-to-br from-cyan-50 via-white to-rose-50 text-cyan-950 ring-cyan-200",
  Facebook: "border-blue-300 bg-blue-50 text-blue-950 ring-blue-200",
  "YouTube Shorts": "border-red-300 bg-red-50 text-red-950 ring-red-200",
  LinkedIn: "border-sky-300 bg-sky-50 text-sky-950 ring-sky-200"
};

export function SocialContentGenerator() {
  const [form, setForm] = useState<GeneratorForm>(initialForm);
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedSection, setCopiedSection] = useState("");

  const canSubmit = Object.values(form).every((value) => value.trim().length > 0) && !isLoading;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    setContent(null);
    setIsLoading(true);

    window.setTimeout(() => {
      setContent(generateLocalContent(form));
      setIsLoading(false);
    }, 1400);
  }

  async function handleCopy(section: string, text: string) {
    await navigator.clipboard.writeText(text);
    setCopiedSection(section);
    window.setTimeout(() => setCopiedSection(""), 1600);
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
        <section className="rounded-[2rem] border border-white/70 bg-white/90 p-5 shadow-soft backdrop-blur sm:p-7 lg:sticky lg:top-6">
          <div className="mb-6">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-gray-600">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              Social Content Studio
            </div>
            <h1 className="text-3xl font-black leading-tight text-gray-950 sm:text-4xl">
              Generatore Contenuti Social PRO
            </h1>
            <p className="mt-3 text-base leading-7 text-gray-600">
              Inserisci contesto reale: il generatore userà nicchia, offerta, pubblico, problema e risultato per creare una base completa e pronta da adattare.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nicchia / settore" value={form.niche} placeholder="Es. prodotti digitali, estetica, fitness, consulenza..." onChange={(value) => setFormField(setForm, "niche", value)} />
              <Field label="Prodotto, servizio o idea" value={form.offer} placeholder="Es. generatore contenuti social, trattamento viso, corso online..." onChange={(value) => setFormField(setForm, "offer", value)} />
            </div>

            <Textarea
              label="Pubblico target"
              placeholder="Es. freelance e creator che vendono online ma non hanno un piano editoriale chiaro"
              value={form.audience}
              onChange={(event) => setFormField(setForm, "audience", event.target.value)}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Textarea
                label="Problema principale del pubblico"
                placeholder="Es. non sa cosa pubblicare e perde tempo ogni giorno davanti al calendario vuoto"
                value={form.problem}
                onChange={(event) => setFormField(setForm, "problem", event.target.value)}
              />
              <Textarea
                label="Risultato desiderato"
                placeholder="Es. creare contenuti velocemente, sentirsi più sicuro e pubblicare con costanza"
                value={form.desiredResult}
                onChange={(event) => setFormField(setForm, "desiredResult", event.target.value)}
              />
            </div>

            <fieldset>
              <legend className="mb-3 text-sm font-semibold text-gray-800">Piattaforma</legend>
              <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
                {platforms.map((platform) => {
                  const selected = form.platform === platform;

                  return (
                    <button
                      className={cn(
                        "min-h-16 rounded-2xl border p-3 text-left text-sm font-bold transition focus:outline-none focus:ring-4",
                        platformStyles[platform],
                        selected ? "scale-[1.01] shadow-md ring-4" : "hover:-translate-y-0.5 hover:shadow-sm"
                      )}
                      key={platform}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setFormField(setForm, "platform", platform)}
                    >
                      <span className="block text-base">{platform}</span>
                      <span className="mt-1 block text-xs font-semibold opacity-70">{selected ? "Selezionata" : "Tocca per scegliere"}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="grid gap-4 sm:grid-cols-3">
              <Select label="Obiettivo" value={form.goal} onChange={(event) => setFormField(setForm, "goal", event.target.value as Goal)}>
                {goals.map((goal) => <option key={goal} value={goal}>{goal}</option>)}
              </Select>
              <Select label="Tono" value={form.tone} onChange={(event) => setFormField(setForm, "tone", event.target.value as Tone)}>
                {tones.map((tone) => <option key={tone} value={tone}>{tone}</option>)}
              </Select>
              <Select label="Tipo contenuto" value={form.contentType} onChange={(event) => setFormField(setForm, "contentType", event.target.value as ContentType)}>
                {contentTypes.map((type) => <option key={type} value={type}>{type}</option>)}
              </Select>
            </div>

            <Button className="w-full text-base sm:text-lg" disabled={!canSubmit} type="submit">
              {isLoading ? <Spinner /> : null}
              {isLoading ? "Sto creando i tuoi contenuti..." : "Genera contenuti"}
            </Button>
          </form>

          <p className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-700">
            Questo tool genera una base strategica pronta da usare. Per ottenere il massimo risultato, personalizza sempre i testi con il tuo tono, la tua esperienza e il tuo modo di comunicare.
          </p>
        </section>

        <OutputPanel content={content} copiedSection={copiedSection} isLoading={isLoading} onCopy={handleCopy} />
      </div>
    </main>
  );
}

function Field({ label, onChange, placeholder, value }: { label: string; onChange: (value: string) => void; placeholder: string; value: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-gray-800">{label}</span>
      <input
        className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-base text-gray-950 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-4 focus:ring-gray-200"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function OutputPanel({
  content,
  copiedSection,
  isLoading,
  onCopy
}: {
  content: GeneratedContent | null;
  copiedSection: string;
  isLoading: boolean;
  onCopy: (section: string, text: string) => Promise<void>;
}) {
  const copyText = useMemo(() => (content ? buildCopyText(content) : null), [content]);

  if (isLoading) {
    return (
      <section className="grid min-h-[22rem] place-items-center rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-soft backdrop-blur">
        <div className="text-center">
          <div className="mx-auto"><Spinner size="large" /></div>
          <p className="mt-4 text-xl font-black text-gray-950">Sto creando i tuoi contenuti...</p>
          <p className="mt-2 max-w-md text-base leading-7 text-gray-600">Organizzo hook, caption, CTA, reel, carosello e angoli di comunicazione in base ai dati inseriti.</p>
        </div>
      </section>
    );
  }

  if (!content || !copyText) return null;

  return (
    <section className="space-y-5 break-words">
      <div className="rounded-[2rem] border border-gray-900 bg-gray-950 p-5 text-white shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-300">Output generato</p>
            <h2 className="mt-1 text-2xl font-black">Piano contenuti pronto da adattare</h2>
          </div>
          <Button className="bg-white text-gray-950 hover:bg-gray-100" onClick={() => onCopy("all", copyText.all)}>
            {copiedSection === "all" ? "Copiato" : "Copia tutto"}
          </Button>
        </div>
      </div>

      <ResultSection copied={copiedSection === "hooks"} title="10 Hook specifici" onCopy={() => onCopy("hooks", copyText.hooks)}>
        <NumberedList items={content.hooks} />
      </ResultSection>

      <ResultSection copied={copiedSection === "captions"} title="5 Caption complete" onCopy={() => onCopy("captions", copyText.captions)}>
        <div className="space-y-4">
          {content.captions.map((caption, index) => (
            <article className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm" key={caption.title}>
              <p className="text-sm font-black text-blue-700">Caption {index + 1}</p>
              <h3 className="mt-2 text-lg font-black leading-tight text-gray-950">{caption.title}</h3>
              <p className="mt-3 whitespace-pre-line text-base leading-8 text-gray-700">{caption.text}</p>
            </article>
          ))}
        </div>
      </ResultSection>

      <ResultSection copied={copiedSection === "ctas"} title="5 CTA diverse" onCopy={() => onCopy("ctas", copyText.ctas)}>
        <NumberedList items={content.ctas} />
      </ResultSection>

      <ResultSection copied={copiedSection === "reel"} title="Struttura reel / video breve" onCopy={() => onCopy("reel", copyText.reel)}>
        <p className="mb-4 rounded-2xl bg-orange-50 p-4 text-base font-bold text-orange-900">Durata consigliata: {content.reel.duration}</p>
        <div className="space-y-3">
          {content.reel.scenes.map((scene) => (
            <article className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm" key={scene.time}>
              <p className="text-sm font-black text-orange-700">{scene.time}</p>
              <h3 className="mt-2 text-base font-black text-gray-950">{scene.scene}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-700"><strong>Testo a schermo:</strong> {scene.screenText}</p>
              <p className="mt-2 text-sm leading-6 text-gray-700"><strong>Voce narrante:</strong> {scene.voiceover}</p>
              <p className="mt-2 text-sm leading-6 text-gray-700"><strong>Visual:</strong> {scene.visual}</p>
            </article>
          ))}
        </div>
      </ResultSection>

      <ResultSection copied={copiedSection === "carousel"} title="Carosello da 7 slide" onCopy={() => onCopy("carousel", copyText.carousel)}>
        <div className="grid gap-3 sm:grid-cols-2">
          {content.carousel.map((slide) => (
            <article className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm" key={slide.slide}>
              <p className="text-sm font-black text-gray-950">Slide {slide.slide}: {slide.role}</p>
              <h3 className="mt-2 text-base font-black text-gray-950">{slide.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-700">{slide.text}</p>
              <p className="mt-3 rounded-xl bg-gray-50 p-3 text-sm leading-6 text-gray-600"><strong>Visual:</strong> {slide.visual}</p>
            </article>
          ))}
        </div>
      </ResultSection>

      <ResultSection copied={copiedSection === "ideas"} title="5 Idee contenuto aggiuntive" onCopy={() => onCopy("ideas", copyText.ideas)}>
        <NumberedList items={content.ideas} />
      </ResultSection>

      <ResultSection copied={copiedSection === "angles"} title="3 Angoli di comunicazione" onCopy={() => onCopy("angles", copyText.angles)}>
        <div className="space-y-3">
          {content.angles.map((angle) => (
            <article className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm" key={angle.title}>
              <h3 className="text-base font-black text-gray-950">{angle.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-700">{angle.description}</p>
            </article>
          ))}
        </div>
      </ResultSection>

      <ResultSection copied={copiedSection === "mistakes"} title="3 Errori da evitare" onCopy={() => onCopy("mistakes", copyText.mistakes)}>
        <NumberedList items={content.mistakes} />
      </ResultSection>
    </section>
  );
}

function ResultSection({ children, copied, onCopy, title }: { children: ReactNode; copied: boolean; onCopy: () => void; title: string }) {
  return (
    <div className="rounded-[2rem] border border-white/70 bg-white/90 p-4 shadow-soft backdrop-blur sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-black leading-tight text-gray-950">{title}</h2>
        <Button className="w-full shrink-0 sm:w-auto" variant="secondary" onClick={onCopy}>
          {copied ? "Copiato" : "Copia questo blocco"}
        </Button>
      </div>
      {children}
    </div>
  );
}

function NumberedList({ items }: { items: string[] }) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <p className="rounded-2xl border border-gray-200 bg-white p-4 text-base font-semibold leading-7 text-gray-900 shadow-sm" key={`${item}-${index}`}>
          {index + 1}. {item}
        </p>
      ))}
    </div>
  );
}

function Spinner({ size = "normal" }: { size?: "normal" | "large" }) {
  return (
    <span
      className={cn(
        "inline-block animate-spin rounded-full border-2 border-current border-t-transparent",
        size === "large" ? "h-10 w-10 text-gray-900" : "h-5 w-5"
      )}
      aria-hidden="true"
    />
  );
}

function setFormField<Key extends keyof GeneratorForm>(
  setForm: Dispatch<SetStateAction<GeneratorForm>>,
  key: Key,
  value: GeneratorForm[Key]
) {
  setForm((current) => ({ ...current, [key]: value }));
}

function generateLocalContent(form: GeneratorForm): GeneratedContent {
  const data = normalizeForm(form);
  const content = {
    hooks: buildHooks(data),
    captions: buildCaptions(data),
    ctas: buildCtas(data),
    reel: buildReel(data),
    carousel: buildCarousel(data),
    ideas: buildIdeas(data),
    angles: buildAngles(data),
    mistakes: buildMistakes(data)
  };

  return applyQualityControl(content, data);
}

function normalizeForm(form: GeneratorForm) {
  const raw = {
    niche: cleanInput(form.niche),
    offer: cleanInput(form.offer),
    audience: cleanInput(form.audience),
    problem: cleanInput(form.problem),
    result: cleanInput(form.desiredResult)
  };
  const category = detectNicheCategory(raw.niche, raw.offer, raw.problem, raw.result);
  const base: StrategicInput = {
    ...raw,
    naturalNiche: makeNaturalNiche(raw.niche, category),
    naturalOffer: makeNaturalOffer(raw.offer, category),
    naturalAudience: makeNaturalAudience(raw.audience),
    naturalProblem: makeNaturalProblem(raw.problem, category),
    naturalResult: makeNaturalResult(raw.result, category),
    category,
    platform: form.platform,
    goal: form.goal,
    tone: form.tone,
    contentType: form.contentType,
    opener: toneOpener(form.tone)
  };

  return {
    ...base,
    strategy: createStrategicContext(base)
  };
}

function buildHooks(d: ReturnType<typeof normalizeForm>) {
  const s = d.strategy;

  const hooks = [
    `Il problema non è sempre quello che stai cercando di risolvere.`,
    `${s.dailyScene}`,
    `Prima di cambiare tutto, guarda dove stai perdendo continuità.`,
    `La maggior parte delle persone prova ad accelerare, ma salta il passaggio più semplice.`,
    `Non devi complicare tutto per vedere un primo cambiamento concreto.`,
    `Se ti blocchi sempre nello stesso punto, forse non ti manca motivazione.`,
    `Il tuo pubblico non cerca solo una soluzione. Cerca chiarezza.`,
    `La vera differenza la fa il metodo, non l'entusiasmo del primo giorno.`,
    `Prima di scegliere, le persone devono capire perché dovrebbero fidarsi.`,
    `${s.contrastHook}`
  ];

  return hooks.map((hook) => adaptHookForPlatform(polishSentence(hook), d));
}

function buildCaptions(d: ReturnType<typeof normalizeForm>) {
  const s = d.strategy;
  const captions = [
    {
      title: "Storytelling breve",
      text: `${s.storyOpening}

All'inizio sembra un dettaglio piccolo. Poi diventa il motivo per cui si rimanda, si cambia idea o si riparte sempre da capo. Non succede perché le persone non tengono davvero al risultato: spesso succede perché il percorso sembra troppo pieno di passaggi, dubbi e decisioni da prendere.

La svolta arriva quando smetti di cercare la soluzione perfetta e inizi da una cosa più semplice: capire qual è il primo passo sostenibile. ${d.naturalOffer} ha senso proprio qui, perché aiuta a dare ordine, direzione e meno peso mentale.

Il beneficio non è solo pratico. È sentirsi più lucidi, più guidati e meno soli davanti alla scelta successiva.

${captionCta(d, 0)}`
    },
    {
      title: "Problema / soluzione",
      text: `Il blocco più grande non è sempre la mancanza di voglia. Spesso è il fatto che ogni tentativo richiede troppa energia, troppe scelte e troppa improvvisazione.

Quando una persona vive ${d.naturalProblem}, tende a cercare una risposta veloce. Ma una risposta veloce, se non è semplice da mantenere, dopo poco diventa un'altra cosa iniziata e lasciata lì.

La soluzione più utile è ridurre l'attrito: meno confusione, passaggi più chiari, un obiettivo realistico alla volta. In questo modo ${d.naturalOffer} non viene percepito come l'ennesima promessa, ma come un supporto concreto per avvicinarsi a ${d.naturalResult}.

Il punto non è fare tutto subito. È iniziare meglio.

${captionCta(d, 1)}`
    },
    {
      title: "Educativa",
      text: `C'è una falsa credenza molto comune: pensare che per cambiare serva rivoluzionare tutto.

In realtà, nella maggior parte dei casi, le persone non hanno bisogno di aggiungere pressione. Hanno bisogno di capire cosa togliere, cosa semplificare e quale scelta fare per prima. È qui che un contenuto diventa davvero utile: non ripete il problema, lo rende più chiaro.

Se il messaggio mostra un errore concreto, una nuova prospettiva e un passo semplice, diventa molto più credibile. ${d.naturalOffer} può essere presentato come una guida pratica, non come una bacchetta magica.

La promessa più forte è anche la più realistica: rendere il percorso meno confuso e più facile da seguire.

${captionCta(d, 2)}`
    },
    {
      title: "Vendita soft",
      text: `Prima di acquistare, prenotare o chiedere informazioni, una persona deve sentirsi capita.

Non basta dire che un servizio è utile. Bisogna far vedere perché può essere utile proprio nel momento in cui la persona si sente bloccata, confusa o stanca di tentativi poco chiari.

Per questo ${d.naturalOffer} va raccontato partendo dall'esperienza reale, non dalla lista di caratteristiche. Mostra il prima: troppe opzioni, poca direzione, risultati che sembrano lontani. Poi mostra il dopo: un percorso più ordinato, una decisione più semplice, un passo concreto da fare.

Vendere in modo naturale significa far pensare: "ok, questa cosa potrebbe aiutarmi davvero".

${captionCta(d, 3)}`
    },
    {
      title: "Diretta e persuasiva",
      text: `Se una persona continua a rimandare, non serve farla sentire in colpa.

Serve darle una strada più semplice da seguire.

Il problema, spesso, è che il percorso viene percepito come troppo grande: troppe cose da capire, troppe decisioni, troppi contenuti o soluzioni che promettono tanto ma non aiutano a partire davvero.

Qui la comunicazione deve essere chiara: non promettere miracoli, mostra un passo concreto. ${d.naturalOffer} diventa più interessante quando viene raccontato come un modo per togliere confusione e trasformare un desiderio generico in un'azione più precisa.

Se vuoi che le persone si fidino, non parlare solo del risultato finale. Fai vedere perché il prossimo passo è più semplice di quanto pensano.

${captionCta(d, 4)}`
    }
  ];

  return rotate(captions, seedFrom(d)).map((caption) => ({
    title: caption.title,
    text: polishSentence(caption.text)
  }));
}

function buildCtas(d: ReturnType<typeof normalizeForm>) {
  const s = d.strategy;
  const ctas = [
    `Scrivimi "${keyword(d)}" se vuoi trasformare questa situazione in un percorso più chiaro e sostenibile.`,
    `Salva questo contenuto se ti serve una traccia meno generica per parlare a chi è fermo tra dubbi, tentativi e troppe opzioni.`,
    `Commenta con l'ostacolo che vedi più spesso: ti rispondo con un'idea di contenuto da usare su ${d.platform}.`,
    `Se vuoi comunicare la tua proposta senza sembrare uguale a tutti, parti da questo cambio di prospettiva.`,
    `Condividilo con chi continua a provare soluzioni diverse ma non ha ancora trovato una direzione semplice da seguire.`,
    `Vuoi rendere più credibile la tua proposta? Parti da ${s.commonMistakeLower} e mostra un'alternativa concreta.`,
    `Mandami un messaggio se vuoi trasformare la tua proposta in un contenuto più ${d.tone}, utile e meno promozionale.`,
    `Salva questa traccia: ti aiuta a parlare del desiderio finale senza ripetere sempre le stesse parole.`,
    `Usala per il tuo prossimo ${d.contentType}: prima mostra il blocco, poi la nuova prospettiva, poi la CTA.`,
    `Se questa lettura ti sembra familiare, il prossimo passo è rendere il messaggio più specifico per ${s.audienceView}.`
  ];

  return rotate(ctas, seedFrom(d)).slice(0, 5);
}

function buildReel(d: ReturnType<typeof normalizeForm>) {
  const s = d.strategy;

  return {
    duration: d.platform === "LinkedIn" ? "35-50 secondi" : "18-28 secondi",
    scenes: [
      {
        time: "0-2 secondi",
        scene: "Apertura con problema riconoscibile",
        screenText: "Non è solo questione di volontà",
        voiceover: `${d.opener} Il blocco spesso nasce quando il percorso sembra più complicato del risultato che vuoi ottenere.`,
        visual: "Primo piano o schermata con troppe opzioni aperte: rende visiva la confusione, senza ripetere l'input alla lettera."
      },
      {
        time: "2-5 secondi",
        scene: "Conseguenza concreta",
        screenText: "Troppi tentativi, poca direzione",
        voiceover: `Quando ${s.audienceView} prova a risolvere tutto insieme, il rischio è fermarsi prima di vedere un progresso stabile.`,
        visual: `Mostra una checklist incompleta, un calendario vuoto o un prima/dopo concettuale legato a ${d.naturalNiche}.`
      },
      {
        time: "5-8 secondi",
        scene: "Cambio di prospettiva",
        screenText: "Prima semplifica, poi accelera",
        voiceover: "Invece di aggiungere pressione, funziona meglio ridurre l'attrito: meno passaggi confusi, più continuità, una scelta concreta alla volta.",
        visual: "Taglio veloce con tre parole chiave: chiarezza, primo passo, continuità."
      },
      {
        time: "Finale",
        scene: "CTA coerente con l'obiettivo",
        screenText: `${capitalize(s.desire)} senza complicarti tutto`,
        voiceover: `${capitalize(d.naturalOffer)}: dare una struttura più semplice per avvicinarsi al risultato senza inseguire soluzioni casuali.`,
        visual: `Schermata finale pulita con CTA grande, promessa realistica e riferimento visivo a ${d.platform}.`
      }
    ]
  };
}

function buildCarousel(d: ReturnType<typeof normalizeForm>) {
  const s = d.strategy;

  return [
    {
      slide: 1,
      role: "titolo forte",
      title: "Il blocco non è dove pensi",
      text: "Una guida rapida per trasformare confusione e tentativi casuali in un percorso più semplice.",
      visual: `Titolo grande, contrasto forte, elemento visivo collegato a ${d.naturalNiche} ma senza testo troppo descrittivo.`
    },
    {
      slide: 2,
      role: "problema",
      title: "Il blocco reale",
      text: `${capitalize(s.painPoint)}. Quando succede, anche una buona intenzione diventa difficile da mantenere.`,
      visual: "Mostra confusione, scelte aperte o una situazione quotidiana del pubblico."
    },
    {
      slide: 3,
      role: "errore comune",
      title: "L'errore che rallenta",
      text: `${capitalize(s.commonMistakeLower)}. Così il percorso sembra più pesante di quello che dovrebbe essere.`,
      visual: "Due colonne: 'improvviso tutto' contro 'seguo un passaggio alla volta'."
    },
    {
      slide: 4,
      role: "nuova prospettiva",
      title: "Cambia punto di partenza",
      text: "Non partire dalla soluzione perfetta. Parti da ciò che rende il primo passo più leggero, chiaro e ripetibile.",
      visual: "Freccia da 'confusione' a 'continuità', con una tappa centrale chiamata metodo."
    },
    {
      slide: 5,
      role: "soluzione pratica",
      title: "La soluzione semplice",
      text: `${capitalize(d.naturalOffer)} diventa utile quando riduce attrito: meno decisioni inutili, più guida, un passo concreto da applicare subito.`,
      visual: "Mini schema in quattro step, leggibile anche da smartphone."
    },
    {
      slide: 6,
      role: "beneficio finale",
      title: "Cosa cambia davvero",
      text: `${capitalize(s.emotionalBenefit)}. Questo rende il risultato più vicino e meno dipendente dall'entusiasmo del momento.`,
      visual: "Prima/dopo visivo: caos iniziale e percorso finale ordinato."
    },
    {
      slide: 7,
      role: "CTA",
      title: "Vuoi applicarlo al tuo caso?",
      text: `Salva il carosello o scrivimi "${keyword(d)}" per trasformare questa idea in un contenuto adatto a ${d.platform}.`,
      visual: "CTA grande, spazio bianco, freccia o pulsante grafico ben visibile."
    }
  ];
}

function buildIdeas(d: ReturnType<typeof normalizeForm>) {
  const s = d.strategy;

  return [
    `Mini caso pratico: racconta il passaggio da tentativi disordinati a una prima azione guidata, collegando solo alla fine la tua proposta.`,
    `Post confronto: metodo improvvisato contro metodo guidato, con esempi concreti adatti a ${d.platform}.`,
    "Storia cliente tipo: mostra il momento in cui la persona capisce che il problema non è impegnarsi di più, ma scegliere un percorso più sostenibile.",
    `Checklist rapida: 5 segnali che indicano che stai complicando troppo il percorso verso ${s.desire}.`,
    `Contenuto obiezioni: rispondi al dubbio "e se non facesse per me?" con prove logiche, passaggi semplici e un linguaggio coerente con il tuo stile.`
  ];
}

function buildAngles(d: ReturnType<typeof normalizeForm>) {
  const s = d.strategy;

  return [
    {
      title: "Errore che blocca il risultato",
      description: `Mostra come ${s.commonMistakeLower} renda il percorso più faticoso. Poi presenta una scelta più semplice, concreta e collegata alla tua proposta.`
    },
    {
      title: "Mito da sfatare",
      description: `Parti dalla falsa credenza "${s.falseBeliefLower}" e ribaltala: il pubblico non ha bisogno di pressione extra, ma di un modo più chiaro per iniziare e continuare.`
    },
    {
      title: "Risultato visto dal lato emotivo",
      description: `Non parlare solo del traguardo pratico. Racconta ${s.emotionalBenefitLower}: è spesso questo che rende il contenuto più memorabile e più umano.`
    }
  ];
}

function buildMistakes(d: ReturnType<typeof normalizeForm>) {
  const s = d.strategy;

  return [
    `Ripetere alla lettera il problema dichiarato: suona meccanico. Meglio trasformarlo in una situazione concreta, come ${s.painPointLower}.`,
    `Promettere un risultato garantito: meglio usare una promessa realistica, cioè ${s.realisticPromiseLower}.`,
    `Presentare l'offerta troppo presto: prima crea identificazione, poi mostra il cambio di prospettiva, infine proponi il passo successivo.`
  ];
}

function applyQualityControl(content: GeneratedContent, d: ReturnType<typeof normalizeForm>): GeneratedContent {
  return {
    hooks: content.hooks.map((text, index) => avoidMechanicalPhrasing(text, d, index)),
    captions: content.captions.map((caption, index) => ({
      title: avoidMechanicalPhrasing(caption.title, d, index),
      text: avoidMechanicalPhrasing(caption.text, d, index)
    })),
    ctas: content.ctas.map((text, index) => avoidMechanicalPhrasing(text, d, index)),
    reel: {
      ...content.reel,
      scenes: content.reel.scenes.map((scene, index) => ({
        ...scene,
        screenText: avoidMechanicalPhrasing(scene.screenText, d, index),
        voiceover: avoidMechanicalPhrasing(scene.voiceover, d, index),
        visual: avoidMechanicalPhrasing(scene.visual, d, index)
      }))
    },
    carousel: content.carousel.map((slide, index) => ({
      ...slide,
      title: avoidMechanicalPhrasing(slide.title, d, index),
      text: avoidMechanicalPhrasing(slide.text, d, index),
      visual: avoidMechanicalPhrasing(slide.visual, d, index)
    })),
    ideas: content.ideas.map((text, index) => avoidMechanicalPhrasing(text, d, index)),
    angles: content.angles.map((angle, index) => ({
      title: avoidMechanicalPhrasing(angle.title, d, index),
      description: avoidMechanicalPhrasing(angle.description, d, index)
    })),
    mistakes: content.mistakes.map((text, index) => avoidMechanicalPhrasing(text, d, index))
  };
}

function buildCopyText(content: GeneratedContent) {
  const hooks = content.hooks.map((hook, index) => `${index + 1}. ${hook}`).join("\n");
  const captions = content.captions.map((caption, index) => `Caption ${index + 1}: ${caption.title}\n${caption.text}`).join("\n\n");
  const ctas = content.ctas.map((cta, index) => `${index + 1}. ${cta}`).join("\n");
  const reel = `Durata consigliata: ${content.reel.duration}\n\n${content.reel.scenes.map((scene) => `${scene.time}\nScena: ${scene.scene}\nTesto a schermo: ${scene.screenText}\nVoce narrante: ${scene.voiceover}\nVisual: ${scene.visual}`).join("\n\n")}`;
  const carousel = content.carousel.map((slide) => `Slide ${slide.slide} - ${slide.role}\nTitolo: ${slide.title}\nTesto: ${slide.text}\nVisual: ${slide.visual}`).join("\n\n");
  const ideas = content.ideas.map((idea, index) => `${index + 1}. ${idea}`).join("\n");
  const angles = content.angles.map((angle, index) => `${index + 1}. ${angle.title}\n${angle.description}`).join("\n\n");
  const mistakes = content.mistakes.map((mistake, index) => `${index + 1}. ${mistake}`).join("\n");
  const all = [hooks, captions, ctas, reel, carousel, ideas, angles, mistakes].join("\n\n---\n\n");

  return { all, hooks, captions, ctas, reel, carousel, ideas, angles, mistakes };
}

function captionCta(d: ReturnType<typeof normalizeForm>, index: number) {
  const ctas = [
    `Scrivimi "${keyword(d)}" se vuoi capire qual è il primo passo più semplice da fare.`,
    `Salva questo post: può tornarti utile quando senti di complicare troppo il percorso.`,
    `Commenta con l'ostacolo che ti blocca più spesso: potrei trasformarlo in un esempio pratico.`,
    `Se vuoi più chiarezza, inizia da una scelta piccola ma fatta bene.`,
    `Condividilo con una persona che continua a ripartire da capo.`,
    `Mandami il tuo caso e ti aiuto a renderlo più chiaro e comunicabile.`,
    `Prova questa struttura nel tuo prossimo ${d.contentType} e osserva quali risposte ricevi.`,
    `Scrivi quale parte ti pesa di più: iniziare, scegliere o restare costante.`,
    `Salva la caption se vuoi costruire contenuti più utili e meno improvvisati.`,
    `Usa questa traccia per raccontare la tua proposta senza sembrare generico.`
  ];

  return ctas[index % ctas.length];
}

function rotate<T>(items: T[], seed: number) {
  const start = seed % items.length;
  return [...items.slice(start), ...items.slice(0, start)];
}

function seedFrom(d: ReturnType<typeof normalizeForm>) {
  return `${d.niche}${d.offer}${d.audience}${d.problem}${d.result}${d.platform}${d.tone}${d.goal}`
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), 0);
}

function createStrategicContext(input: StrategicInput) {
  const audienceView = input.naturalAudience;
  const desire = input.naturalResult;
  const painPoint = input.naturalProblem;
  const falseBelief = buildFalseBelief(input.category, input.result);
  const commonMistake = buildCommonMistake(input.category, input.naturalOffer);
  const emotionalBenefit = buildEmotionalBenefit(input.category, desire);
  const realisticPromise = buildRealisticPromise(input.naturalOffer, desire);
  const narrativeAngle = buildNarrativeAngle(audienceView, painPoint, desire);
  const dailyScene = buildDailyScene(input.category, input.platform);
  const contrastHook = buildContrastHook(input.category);
  const storyOpening = `C'è un momento preciso in cui ${audienceView} capisce che ${lowerFirst(painPoint)} non è più solo un fastidio, ma qualcosa che sta rallentando il percorso verso ${desire}.`;

  return {
    audienceView,
    painPoint,
    painPointLower: lowerFirst(painPoint),
    desire,
    falseBelief,
    falseBeliefLower: lowerFirst(falseBelief),
    commonMistake,
    commonMistakeLower: lowerFirst(commonMistake),
    emotionalBenefit,
    emotionalBenefitLower: lowerFirst(emotionalBenefit),
    realisticPromise,
    realisticPromiseLower: lowerFirst(realisticPromise),
    narrativeAngle,
    dailyScene,
    contrastHook,
    storyOpening
  };
}

function detectNicheCategory(...values: string[]): NicheCategory {
  const text = values.join(" ").toLowerCase();
  const groups: Record<NicheCategory, string[]> = {
    wellness: ["dimagr", "dieta", "peso", "forma fisica", "nutriz", "benessere", "palestra", "fitness"],
    beauty: ["estet", "viso", "pelle", "bellezza", "capelli", "unghie", "parrucch", "makeup", "barbiere"],
    localFood: ["ristor", "bar", "pizzeria", "locale", "cibo", "chef", "trattoria", "aperitivo"],
    realEstate: ["immob", "casa", "affitto", "vendita", "appartamento", "villa", "agenzia"],
    knowledge: ["corso", "digitale", "online", "consul", "coaching", "formazione", "mentor", "business"],
    neutral: []
  };

  return (Object.keys(groups) as NicheCategory[]).find((category) =>
    groups[category].some((word) => text.includes(word))
  ) || "neutral";
}

function makeNaturalNiche(niche: string, category: NicheCategory) {
  const variants: Record<NicheCategory, string[]> = {
    wellness: ["benessere e forma fisica", "abitudini più sostenibili", "percorso di cambiamento personale"],
    beauty: ["cura personale", "immagine e routine di bellezza", "risultati visibili e curati"],
    localFood: ["esperienza nel locale", "ospitalità e gusto", "momenti da vivere e condividere"],
    realEstate: ["valorizzazione dell'immobile", "scelta della casa giusta", "presentazione chiara dell'offerta"],
    knowledge: ["competenze trasformate in valore", "fiducia prima della vendita", "percorso guidato di apprendimento"],
    neutral: ["valore comunicato meglio", "problema reale trasformato in contenuto utile", "offerta più chiara e comprensibile"]
  };

  return chooseVariant(variants[category], niche);
}

function makeNaturalAudience(audience: string) {
  if (isShortInput(audience)) {
    return "chi vuole fare una scelta migliore ma non ha ancora una strada chiara";
  }

  return `persone che si riconoscono in questa situazione: ${softenSentence(audience)}`;
}

function makeNaturalProblem(problem: string, category: NicheCategory) {
  if (!isShortInput(problem)) {
    return `sentirsi bloccati perché ${softenSentence(problem)} diventa un ostacolo concreto nella quotidianità`;
  }

  const variants: Record<NicheCategory, string[]> = {
    wellness: ["iniziare con entusiasmo e poi perdere costanza dopo pochi giorni", "sentirsi confusi tra regole, rinunce e consigli opposti"],
    beauty: ["non vedere un risultato curato e uniforme nonostante tentativi diversi", "sentire che la routine non valorizza davvero la propria immagine"],
    localFood: ["avere qualcosa di valido da offrire ma non riuscire a far venire voglia di provarlo", "pubblicare contenuti che mostrano il prodotto ma non raccontano l'esperienza"],
    realEstate: ["presentare un immobile senza far percepire davvero il suo valore", "attirare curiosi invece di persone realmente interessate"],
    knowledge: ["avere competenze utili ma non riuscire a spiegarle in modo semplice", "creare contenuti che informano ma non costruiscono fiducia"],
    neutral: ["avere un'offerta valida ma comunicarla in modo troppo generico", "non riuscire a trasformare un problema reale in un messaggio chiaro"]
  };

  return chooseVariant(variants[category], problem);
}

function makeNaturalOffer(offer: string, category: NicheCategory) {
  const base = isShortInput(offer) ? "" : softenSentence(offer);
  const variants: Record<NicheCategory, string[]> = {
    wellness: ["un percorso pensato per creare abitudini più sostenibili", "una guida semplice per ritrovare costanza senza estremismi"],
    beauty: ["un percorso pensato per ottenere un risultato più curato, visibile e armonioso", "un servizio che valorizza la routine e l'immagine personale"],
    localFood: ["un'esperienza che fa venire voglia di prenotare e provare dal vivo", "un modo per trasformare prodotto, atmosfera e gusto in desiderio"],
    realEstate: ["una presentazione più chiara per valorizzare l'immobile e attirare persone interessate", "un supporto per rendere più comprensibile il valore della casa"],
    knowledge: ["un percorso guidato per trasformare competenze in risultati comprensibili", "una proposta che aiuta a capire il valore prima della vendita"],
    neutral: ["una soluzione più chiara per rendere l'offerta comprensibile", "un percorso che aiuta a passare dalla confusione a una scelta più concreta"]
  };

  if (base.length > 22) {
    return `una proposta pensata per rendere più semplice e concreto il percorso legato a ${base}`;
  }

  return chooseVariant(variants[category], offer);
}

function makeNaturalResult(result: string, category: NicheCategory) {
  if (!isShortInput(result)) {
    return `avvicinarsi a quel risultato con meno confusione e più continuità`;
  }

  const variants: Record<NicheCategory, string[]> = {
    wellness: ["sentirsi meglio nel proprio corpo e ritrovare costanza", "rimettersi in forma con un approccio più sostenibile"],
    beauty: ["sentirsi più curati e valorizzati", "vedere un risultato più ordinato, luminoso e naturale"],
    localFood: ["far venire voglia di prenotare", "portare più persone interessate a vivere l'esperienza"],
    realEstate: ["attirare persone realmente interessate", "far percepire meglio il valore dell'immobile"],
    knowledge: ["far capire il valore della proposta prima della vendita", "creare fiducia e rendere più chiaro il prossimo passo"],
    neutral: ["comunicare il valore in modo più chiaro", "parlare al pubblico giusto con un messaggio più concreto"]
  };

  return chooseVariant(variants[category], result);
}

function buildFalseBelief(category: NicheCategory, result: string) {
  const variants: Record<NicheCategory, string[]> = {
    wellness: ["fare tutto perfettamente o rinunciare a tutto per vedere un cambiamento"],
    beauty: ["cambiare continuamente trattamento o prodotto per vedere risultati visibili"],
    localFood: ["pubblicare solo foto belle e aspettare che le persone prenotino"],
    realEstate: ["mostrare tante informazioni tecniche e pensare che bastino a convincere"],
    knowledge: ["spiegare tutto subito per dimostrare competenza"],
    neutral: ["dire tutto in un unico contenuto per convincere più persone possibile"]
  };

  return chooseVariant(variants[category], result);
}

function buildCommonMistake(category: NicheCategory, offer: string) {
  const variants: Record<NicheCategory, string[]> = {
    wellness: ["cambiare piano ogni volta che cala la motivazione"],
    beauty: ["puntare solo sul prima e dopo senza spiegare il percorso"],
    localFood: ["mostrare il prodotto senza far immaginare il momento in cui viverlo"],
    realEstate: ["descrivere l'immobile senza raccontare perché è una scelta sensata"],
    knowledge: ["parlare della soluzione prima di far riconoscere il problema"],
    neutral: ["presentare l'offerta prima di creare identificazione"]
  };

  return chooseVariant(variants[category], offer);
}

function buildEmotionalBenefit(category: NicheCategory, result: string) {
  const variants: Record<NicheCategory, string[]> = {
    wellness: ["sentirsi più leggeri, costanti e meno in lotta con ogni scelta"],
    beauty: ["sentirsi più curati, sicuri e a proprio agio quando ci si guarda"],
    localFood: ["sentire che vale la pena uscire, prenotare e vivere quel momento"],
    realEstate: ["avere più chiarezza e meno dubbi davanti a una decisione importante"],
    knowledge: ["sentirsi guidati, compresi e più sicuri nel fare il passo successivo"],
    neutral: ["sentirsi meno confusi e più sicuri nel scegliere cosa fare dopo"]
  };

  return chooseVariant(variants[category], result);
}

function buildRealisticPromise(offer: string, desire: string) {
  return `${offer} non promette magie: aiuta a rendere più chiaro il prossimo passo verso ${desire}`;
}

function buildNarrativeAngle(audienceView: string, painPoint: string, desire: string) {
  return `raccontare il passaggio da "${painPoint}" a una situazione in cui ${audienceView} riesce a ${desire}`;
}

function adaptHookForPlatform(hook: string, d: ReturnType<typeof normalizeForm>) {
  const variants: Record<Platform, string[]> = {
    Instagram: [hook, `${hook} Salvalo prima di improvvisare.`],
    TikTok: [hook, `${hook} Guardalo prima di ripartire da zero.`],
    Facebook: [hook, `${hook} Parliamone con onestà.`],
    "YouTube Shorts": [hook, `${hook} In pochi secondi si capisce il perché.`],
    LinkedIn: [hook, `${hook} È una questione di metodo, non di rumore.`]
  };

  return chooseVariant(variants[d.platform], hook + d.platform);
}

function isShortInput(value: string) {
  return cleanInput(value).split(" ").filter(Boolean).length <= 2;
}

function softenSentence(value: string) {
  return cleanInput(value)
    .replace(/^(non riesco a|non riescono a|voglio|vuole|vorrei|ottenere|raggiungere)\s+/i, "")
    .replace(/[.!?]+$/g, "");
}

function cleanInput(value: string) {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .replace(/^[-–—:;,.!?]+|[-–—:;,.!?]+$/g, "");
}

function chooseVariant(options: string[], seed: string | number) {
  const numericSeed = typeof seed === "number"
    ? seed
    : seed.split("").reduce((total, char) => total + char.charCodeAt(0), 0);

  return options[Math.abs(numericSeed) % options.length];
}

function buildDailyScene(category: NicheCategory, platform: Platform) {
  const variants: Record<NicheCategory, string[]> = {
    wellness: ["Ogni lunedì riparti convinto, poi bastano tre giorni complicati per perdere il filo."],
    beauty: ["Ti guardi allo specchio e capisci che non vuoi stravolgere tutto: vuoi solo vederti più curato."],
    localFood: ["Qualcuno vede una foto, ma non sente ancora il profumo, l'atmosfera o il motivo per prenotare."],
    realEstate: ["Una casa può essere valida, ma se viene raccontata male sembra solo un annuncio come tanti."],
    knowledge: ["Apri il foglio delle idee, sai di avere valore da condividere, ma non sai da quale messaggio partire."],
    neutral: ["Sai che la proposta è valida, ma quando devi raccontarla diventa tutto più freddo e meno chiaro."]
  };

  const scene = chooseVariant(variants[category], platform);
  return platform === "LinkedIn" ? `${scene} Questo è il punto in cui serve più metodo.` : scene;
}

function buildContrastHook(category: NicheCategory) {
  const variants: Record<NicheCategory, string[]> = {
    wellness: ["Piccoli passi fatti bene battono mille partenze drastiche lasciate a metà."],
    beauty: ["Non serve inseguire il cambiamento più evidente: spesso vince il risultato più armonioso."],
    localFood: ["Un buon prodotto fa assaggiare. Un buon contenuto fa venire voglia di esserci."],
    realEstate: ["Non vince l'annuncio con più dettagli. Vince quello che rende la scelta più chiara."],
    knowledge: ["Non conquista chi spiega di più. Conquista chi rende semplice capire il valore."],
    neutral: ["Non serve dire tutto. Serve dire la cosa giusta nel momento giusto."]
  };

  return chooseVariant(variants[category], category);
}

function avoidMechanicalPhrasing(text: string, d: ReturnType<typeof normalizeForm>, index: number) {
  const fallback = [
    "Il punto non è aggiungere altro rumore. È rendere più chiaro il prossimo passo.",
    "Quando il messaggio diventa semplice, anche la scelta sembra meno pesante.",
    "Le persone non cercano solo una soluzione. Cercano un motivo per fidarsi.",
    "Prima viene l'identificazione. Poi arriva la proposta.",
    "Un contenuto funziona quando trasforma confusione in una direzione concreta."
  ];
  const rawInputs = [d.niche, d.offer, d.audience, d.problem, d.result].filter((value) => value.length > 3);
  const mechanicalPatterns = [
    "se lavori in",
    "il tuo pubblico sente che",
    "verso creare",
    "può diventare",
    "capisce meglio",
    "non percepisce",
    "nel tuo caso il pubblico",
    "con tono",
    "se l'obiettivo"
  ];
  const lower = text.toLowerCase();
  const repeatsRawInput = rawInputs.some((input) => countOccurrences(lower, input.toLowerCase()) > 2);
  const hasMechanicalPattern = mechanicalPatterns.some((pattern) => lower.includes(pattern));
  const tooLongSentence = text.split(/[.!?]/).some((sentence) => sentence.trim().split(" ").length > 38);
  const cleaned = polishSentence(text);

  if (hasMechanicalPattern || repeatsRawInput || tooLongSentence) {
    return chooseVariant(fallback, seedFrom(d) + index);
  }

  return cleaned;
}

function polishSentence(value: string) {
  return value
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").replace(/\s+([,.!?;:])/g, "$1").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\s+([,.!?;:])/g, "$1")
    .replace(/([.!?])([A-ZÀ-Ù])/g, "$1 $2")
    .trim();
}

function countOccurrences(text: string, search: string) {
  if (!search) return 0;
  return text.split(search).length - 1;
}

function lowerFirst(value: string) {
  if (!value) return value;
  return value.charAt(0).toLowerCase() + value.slice(1);
}

function keyword(d: ReturnType<typeof normalizeForm>) {
  const firstWord = d.niche.split(" ")[0] || "contenuti";
  return firstWord.toUpperCase().replace(/[^A-ZÀ-Ù]/g, "");
}

function toneOpener(tone: Tone) {
  const map: Record<Tone, string> = {
    diretto: "Te lo dico in modo diretto.",
    educativo: "Partiamo da un concetto semplice.",
    persuasivo: "Ecco perché questo conta davvero.",
    amichevole: "Facciamola semplice.",
    professionale: "Guardiamo il punto con metodo.",
    motivazionale: "Se vuoi sbloccare la situazione, parti da qui."
  };

  return map[tone];
}

function clean(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function capitalize(value: string) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}
