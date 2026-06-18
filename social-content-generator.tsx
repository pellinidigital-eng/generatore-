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
type NicheCategory = "wellness" | "beauty" | "localFood" | "localService" | "realEstate" | "knowledge" | "publishing" | "finance" | "fashion" | "photography" | "literature" | "hospitality" | "digitalProduct" | "neutral";

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

type SessionMemory = {
  hooks: string[];
  ctas: string[];
  structures: string[];
  generation: number;
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
  isMarketingContext: boolean;
  concreteDetail: string;
  productPhrase: string;
  audiencePhrase: string;
  sectorWords: string[];
  sectorScenario: string;
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
  Instagram: "border-pink-200 bg-gradient-to-br from-white via-pink-50 to-orange-50 text-pink-950",
  TikTok: "border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white",
  Facebook: "border-blue-200 bg-blue-50 text-blue-950",
  "YouTube Shorts": "border-red-200 bg-red-50 text-red-950",
  LinkedIn: "border-sky-200 bg-sky-50 text-sky-950"
};

const resultMeta: Record<string, { label: string; description: string }> = {
  hooks: {
    label: "Hook",
    description: "Aperture brevi da usare per catturare attenzione nei primi secondi."
  },
  captions: {
    label: "Caption",
    description: "Testi completi con apertura, sviluppo, prospettiva e invito finale."
  },
  ctas: {
    label: "CTA",
    description: "Inviti all'azione diversi, pronti da adattare al tuo obiettivo."
  },
  reel: {
    label: "Reel",
    description: "Scaletta video con scene, testo a schermo, voce e suggerimento visual."
  },
  carousel: {
    label: "Carosello",
    description: "Struttura in 7 slide pensata per essere chiara e leggibile da mobile."
  },
  ideas: {
    label: "Idee",
    description: "Spunti extra per continuare il piano editoriale senza ripartire da zero."
  },
  angles: {
    label: "Angoli",
    description: "Prospettive diverse per parlare dello stesso tema senza ripetersi."
  },
  mistakes: {
    label: "Errori",
    description: "Cose da evitare per rendere la comunicazione piÃ¹ credibile."
  }
};

export function SocialContentGenerator() {
  const [form, setForm] = useState<GeneratorForm>(initialForm);
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedSection, setCopiedSection] = useState("");
  const [formError, setFormError] = useState("");
  const [sessionMemory, setSessionMemory] = useState<SessionMemory>({
    hooks: [],
    ctas: [],
    structures: [],
    generation: 0
  });

  const textInputs = [form.niche, form.offer, form.audience, form.problem, form.desiredResult];
  const canSubmit = Object.values(form).every((value) => value.trim().length > 0) && !isLoading;
  const inputSpecificity = textInputs.filter((value) => value.trim().split(/\s+/).length >= 4).length;
  const isTooVague = textInputs.join(" ").trim().split(/\s+/).filter(Boolean).length < 10 || inputSpecificity < 2;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    if (isTooVague) {
      setFormError("Per generare contenuti piÃ¹ precisi, aggiungi almeno un dettaglio su prodotto, target o problema principale.");
      setContent(null);
      return;
    }

    setFormError("");
    setContent(null);
    setIsLoading(true);

    window.setTimeout(() => {
      const generated = generateLocalContent(form, sessionMemory);
      setContent(generated);
      setSessionMemory((current) => updateSessionMemory(current, generated));
      setIsLoading(false);
    }, 1400);
  }

  async function handleCopy(section: string, text: string) {
    await navigator.clipboard.writeText(text);
    setCopiedSection(section);
    window.setTimeout(() => setCopiedSection(""), 1600);
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_26rem),linear-gradient(135deg,#f8fbff_0%,#eef6ff_48%,#f9fbff_100%)] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
        <section className="rounded-[2rem] border border-white/80 bg-white/95 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur sm:p-7 lg:sticky lg:top-6">
          <div className="mb-6">
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[0.7rem] font-black uppercase tracking-[0.14em] text-blue-700">
                <span className="h-2 w-2 rounded-full bg-blue-600" />
                AI Social Content Generator
              </span>
              <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600">
                Mobile-first
              </span>
              <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600">
                Instagram, TikTok e Facebook
              </span>
            </div>
            <h1 className="text-[2rem] font-black leading-[1.05] text-slate-950 sm:text-4xl">
              Generatore Contenuti Social PRO
            </h1>
            <p className="hidden">
              Inserisci contesto reale: il generatore userÃ  nicchia, offerta, pubblico, problema e risultato per creare una base completa e pronta da adattare.
            </p>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Inserisci pochi dettagli e ottieni hook, caption, reel, caroselli e CTA pronti da adattare.
            </p>
          </div>

          <form className="space-y-5 rounded-[1.7rem] border border-slate-100 bg-slate-50/70 p-3 sm:p-4" onSubmit={handleSubmit}>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Nicchia / settore" value={form.niche} placeholder="Es. prodotti digitali, estetica, fitness, consulenza..." onChange={(value) => setFormField(setForm, "niche", value)} />
              <Field label="Prodotto, servizio o idea" value={form.offer} placeholder="Es. generatore contenuti social, trattamento viso, corso online..." onChange={(value) => setFormField(setForm, "offer", value)} />
            </div>

            <Textarea
              label="Pubblico target"
              placeholder="Es. freelance e creator che vendono online ma non hanno un piano editoriale chiaro"
              value={form.audience}
              onChange={(event) => setFormField(setForm, "audience", event.target.value)}
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <Textarea
                label="Problema principale del pubblico"
                placeholder="Es. non sa cosa pubblicare e perde tempo ogni giorno davanti al calendario vuoto"
                value={form.problem}
                onChange={(event) => setFormField(setForm, "problem", event.target.value)}
              />
              <Textarea
                label="Risultato desiderato"
                placeholder="Es. creare contenuti velocemente, sentirsi piÃ¹ sicuro e pubblicare con costanza"
                value={form.desiredResult}
                onChange={(event) => setFormField(setForm, "desiredResult", event.target.value)}
              />
            </div>

            <fieldset>
              <legend className="mb-3 text-sm font-black text-slate-900">Piattaforma</legend>
              <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
                {platforms.map((platform) => {
                  const selected = form.platform === platform;

                  return (
                    <button
                      className={cn(
                        "relative min-h-20 rounded-2xl border p-3 text-left text-sm font-bold shadow-sm transition focus:outline-none focus:ring-4 focus:ring-blue-100",
                        platformStyles[platform],
                        selected ? "border-blue-500 bg-blue-50 text-blue-950 shadow-md ring-4 ring-blue-100" : "hover:-translate-y-0.5 hover:shadow-md"
                      )}
                      key={platform}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setFormField(setForm, "platform", platform)}
                    >
                      <span className="flex items-center gap-3">
                        <PlatformIcon platform={platform} />
                        <span>
                          <span className="block text-base">{platform}</span>
                          <span className="mt-1 block text-xs font-semibold opacity-70">{selected ? "Selezionata" : "Tocca per scegliere"}</span>
                        </span>
                      </span>
                      {selected ? (
                        <span className="absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-full bg-blue-600 text-xs font-black text-white">
                          âœ“
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="grid gap-3 sm:grid-cols-3">
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

            <Button className="min-h-14 w-full rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 text-base font-black shadow-[0_18px_36px_rgba(37,99,235,0.28)] hover:from-blue-800 hover:via-blue-700 hover:to-sky-600 sm:text-lg" disabled={!canSubmit} type="submit">
              {isLoading ? <Spinner /> : null}
              {isLoading ? "Sto creando i tuoi contenuti..." : "Genera i miei contenuti"}
            </Button>
            <p className="text-center text-xs font-semibold leading-5 text-slate-500">
              Output immediato â€¢ Nessun abbonamento â€¢ Da usare come base pronta
            </p>
            {inputSpecificity < 3 ? (
              <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold leading-6 text-amber-900">
                PiÃ¹ dettagli inserisci, piÃ¹ gli output saranno mirati. Se resti generico, il tool aggiunge ipotesi strategiche realistiche da personalizzare.
              </p>
            ) : (
              <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold leading-6 text-emerald-900">
                Buon livello di dettaglio: gli output saranno piÃ¹ facili da adattare al tuo brand e al tuo mercato.
              </p>
            )}
            {formError ? (
              <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-800">
                {formError}
              </p>
            ) : null}
          </form>

          <p className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-3 text-sm leading-6 text-slate-700">
            Questo tool genera una base strategica pronta da usare. Per ottenere il massimo risultato, personalizza sempre i testi con il tuo tono, la tua esperienza e il tuo modo di comunicare.
          </p>
        </section>

        <OutputPanel content={content} copiedSection={copiedSection} isLoading={isLoading} onCopy={handleCopy} />
      </div>
    </main>
  );
}

function PlatformIcon({ platform }: { platform: Platform }) {
  if (platform === "Instagram") {
    return (
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white shadow-sm">
        <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24" fill="none">
          <rect x="5" y="5" width="14" height="14" rx="4" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="2" />
          <circle cx="16.5" cy="7.5" r="1" fill="currentColor" />
        </svg>
      </span>
    );
  }

  if (platform === "TikTok") {
    return (
      <span className="relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-2xl bg-slate-950 shadow-sm">
        <span className="absolute -left-1 top-2 h-7 w-7 rounded-full bg-cyan-400/40" />
        <span className="absolute -right-1 bottom-2 h-7 w-7 rounded-full bg-pink-500/40" />
        <svg aria-hidden="true" className="relative h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14.4 4h2.2c.3 2 1.5 3.4 3.4 3.8V10c-1.5-.1-2.7-.6-3.6-1.4v6.1c0 3-2 5.2-5.1 5.2-2.6 0-4.5-1.7-4.5-4.1 0-2.5 2-4.2 4.7-4.2.3 0 .6 0 .9.1V14c-.3-.1-.6-.1-.9-.1-1.2 0-2 .7-2 1.7s.8 1.7 1.9 1.7c1.3 0 2.1-.8 2.1-2.4V4h.9Z" />
        </svg>
      </span>
    );
  }

  const iconClasses: Record<Exclude<Platform, "Instagram" | "TikTok">, string> = {
    Facebook: "bg-[#1877F2]",
    "YouTube Shorts": "bg-[#FF0000]",
    LinkedIn: "bg-[#0A66C2]"
  };
  const label: Record<Exclude<Platform, "Instagram" | "TikTok">, string> = {
    Facebook: "f",
    "YouTube Shorts": "â–¶",
    LinkedIn: "in"
  };

  return (
    <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-lg font-black text-white shadow-sm", iconClasses[platform])}>
      {label[platform]}
    </span>
  );
}

function Field({ label, onChange, placeholder, value }: { label: string; onChange: (value: string) => void; placeholder: string; value: string }) {
  return (
    <label className="block rounded-2xl border border-white bg-white p-3 shadow-sm">
      <span className="mb-2 block text-sm font-black text-slate-900">{label}</span>
      <input
        className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-base text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
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
      <section className="grid min-h-[22rem] place-items-center rounded-[2rem] border border-white/80 bg-white/90 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur">
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
      <div className="rounded-[2rem] border border-blue-900 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-5 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-300">Output generato</p>
            <h2 className="mt-1 text-2xl font-black">Piano contenuti pronto da adattare</h2>
          </div>
          <Button className="min-h-12 w-full rounded-2xl bg-white text-slate-950 shadow-lg hover:bg-blue-50 sm:w-auto" onClick={() => onCopy("all", copyText.all)}>
            {copiedSection === "all" ? "Copiato" : "Copia tutto l'output"}
          </Button>
        </div>
      </div>

      <ResultSection copied={copiedSection === "hooks"} meta={resultMeta.hooks} title="10 Hook specifici" onCopy={() => onCopy("hooks", copyText.hooks)}>
        <NumberedList items={content.hooks} />
      </ResultSection>

      <ResultSection copied={copiedSection === "captions"} meta={resultMeta.captions} title="5 Caption complete" onCopy={() => onCopy("captions", copyText.captions)}>
        <div className="space-y-4">
          {content.captions.map((caption, index) => (
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" key={caption.title}>
              <p className="text-sm font-black text-blue-700">Caption {index + 1}</p>
              <h3 className="mt-2 text-lg font-black leading-tight text-gray-950">{caption.title}</h3>
              <p className="mt-3 whitespace-pre-line text-base leading-8 text-gray-700">{caption.text}</p>
            </article>
          ))}
        </div>
      </ResultSection>

      <ResultSection copied={copiedSection === "ctas"} meta={resultMeta.ctas} title="5 CTA diverse" onCopy={() => onCopy("ctas", copyText.ctas)}>
        <NumberedList items={content.ctas} />
      </ResultSection>

      <ResultSection copied={copiedSection === "reel"} meta={resultMeta.reel} title="Struttura reel / video breve" onCopy={() => onCopy("reel", copyText.reel)}>
        <p className="mb-4 rounded-2xl bg-orange-50 p-4 text-base font-bold text-orange-900">Durata consigliata: {content.reel.duration}</p>
        <div className="space-y-3">
          {content.reel.scenes.map((scene) => (
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" key={scene.time}>
              <p className="text-sm font-black text-orange-700">{scene.time}</p>
              <h3 className="mt-2 text-base font-black text-gray-950">{scene.scene}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-700"><strong>Testo a schermo:</strong> {scene.screenText}</p>
              <p className="mt-2 text-sm leading-6 text-gray-700"><strong>Voce narrante:</strong> {scene.voiceover}</p>
              <p className="mt-2 text-sm leading-6 text-gray-700"><strong>Visual:</strong> {scene.visual}</p>
            </article>
          ))}
        </div>
      </ResultSection>

      <ResultSection copied={copiedSection === "carousel"} meta={resultMeta.carousel} title="Carosello da 7 slide" onCopy={() => onCopy("carousel", copyText.carousel)}>
        <div className="grid gap-3 sm:grid-cols-2">
          {content.carousel.map((slide) => (
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" key={slide.slide}>
              <p className="text-sm font-black text-gray-950">Slide {slide.slide}: {slide.role}</p>
              <h3 className="mt-2 text-base font-black text-gray-950">{slide.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-700">{slide.text}</p>
              <p className="mt-3 rounded-xl bg-gray-50 p-3 text-sm leading-6 text-gray-600"><strong>Visual:</strong> {slide.visual}</p>
            </article>
          ))}
        </div>
      </ResultSection>

      <ResultSection copied={copiedSection === "ideas"} meta={resultMeta.ideas} title="5 Idee contenuto aggiuntive" onCopy={() => onCopy("ideas", copyText.ideas)}>
        <NumberedList items={content.ideas} />
      </ResultSection>

      <ResultSection copied={copiedSection === "angles"} meta={resultMeta.angles} title="3 Angoli di comunicazione" onCopy={() => onCopy("angles", copyText.angles)}>
        <div className="space-y-3">
          {content.angles.map((angle) => (
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" key={angle.title}>
              <h3 className="text-base font-black text-gray-950">{angle.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-700">{angle.description}</p>
            </article>
          ))}
        </div>
      </ResultSection>

      <ResultSection copied={copiedSection === "mistakes"} meta={resultMeta.mistakes} title="3 Errori da evitare" onCopy={() => onCopy("mistakes", copyText.mistakes)}>
        <NumberedList items={content.mistakes} />
      </ResultSection>
    </section>
  );
}

function ResultSection({
  children,
  copied,
  meta,
  onCopy,
  title
}: {
  children: ReactNode;
  copied: boolean;
  meta: { label: string; description: string };
  onCopy: () => void;
  title: string;
}) {
  return (
    <div className="rounded-[2rem] border border-white/80 bg-white/95 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="mb-2 inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-blue-700">
            {meta.label}
          </span>
          <h2 className="text-2xl font-black leading-tight text-slate-950">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">{meta.description}</p>
        </div>
        <Button className="min-h-11 w-full shrink-0 rounded-2xl border-blue-100 bg-white shadow-sm sm:w-auto" variant="secondary" onClick={onCopy}>
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
        <p className="rounded-2xl border border-slate-200 bg-white p-5 text-base font-semibold leading-8 text-slate-900 shadow-sm" key={`${item}-${index}`}>
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

function generateLocalContent(form: GeneratorForm, memory?: SessionMemory): GeneratedContent {
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

  return enforceSectorCoverage(diversifyContent(applyQualityControl(content, data), data, memory), data);
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
  const analysis = analyzeBusinessInput(raw, category);
  const sectorWords = getSectorWords(category, raw);
  const base: StrategicInput = {
    ...raw,
    naturalNiche: makeNaturalNiche(raw.niche, category),
    naturalOffer: makeNaturalOffer(raw.offer, category),
    naturalAudience: makeNaturalAudience(raw.audience),
    naturalProblem: makeNaturalProblem(raw.problem, category),
    naturalResult: makeNaturalResult(raw.result, category),
    category,
    ...analysis,
    sectorWords,
    sectorScenario: buildSectorScenario(category, sectorWords),
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
  if (d.category === "literature") return buildLiteratureHooks(d);

  const s = d.strategy;
  const [w1, w2, w3, w4] = d.sectorWords;

  const hooks = [
    `PerchÃ© alcune scelte legate a ${w1} fanno fermare le persone e altre vengono ignorate?`,
    `${s.dailyScene}`,
    `Il problema non Ã¨ parlare di ${w2}: Ã¨ mostrare il dettaglio che fa dire "questo parla di me".`,
    `Prima di cercare altro, guarda cosa rende ${w3} davvero riconoscibile.`,
    `Un dettaglio concreto vale piÃ¹ di una promessa generica: parti da ${w4}.`,
    `Se tutto sembra uguale, forse manca il particolare che fa percepire la differenza.`,
    `Chi guarda non vuole solo informazioni: vuole immaginare l'esperienza prima di scegliere.`,
    `La differenza la fa il modo in cui racconti ${w1}, ${w2} e il risultato finale.`,
    `Prima di chiedere un'azione, fai vedere perchÃ© quel dettaglio merita attenzione.`,
    `${s.contrastHook}`
  ];

  return hooks.map((hook) => adaptHookForPlatform(polishSentence(hook), d));
}

function buildCaptions(d: ReturnType<typeof normalizeForm>) {
  if (d.category === "literature") return buildLiteratureCaptions(d);

  const s = d.strategy;
  const [w1, w2, w3, w4, w5] = d.sectorWords;
  const captions = [
    {
      title: "Storytelling breve",
      text: buildReadyCaption(d, `C'Ã¨ un momento preciso in cui ${s.audienceView} capisce che ${w1}, ${w2} e ${w3} non sono dettagli secondari: sono ciÃ² che fa percepire subito se una scelta Ã¨ banale o davvero interessante.`, `Immagina una persona che vede ${d.productPhrase}: non sta valutando solo una descrizione, ma cerca un motivo concreto per fermarsi, leggere, ricordare e pensare "questo fa per me".`, `Racconta il dettaglio piÃ¹ riconoscibile, poi collega ${w4} al desiderio finale: ${d.naturalResult}.`, 0)
    },
    {
      title: "Problema / soluzione",
      text: buildReadyCaption(d, `Il blocco non nasce perchÃ© mancano alternative. Nasce quando tutto sembra simile e ${s.audienceView} non capisce quale scelta abbia davvero carattere, utilitÃ  o senso.`, `Ãˆ qui che ${d.concreteDetail} diventa importante: permette di uscire dal generico e mostrare perchÃ© ${w1} o ${w2} possono essere piÃ¹ memorabili di una proposta qualunque.`, `La mini soluzione Ã¨ semplice: parti dal problema reale, mostra un esempio concreto e chiudi con una scelta facile da fare oggi.`, 1)
    },
    {
      title: "Educativa",
      text: buildReadyCaption(d, `C'Ã¨ una falsa credenza molto comune: pensare che basti dire "Ã¨ bello", "Ã¨ utile" o "Ã¨ diverso" per convincere qualcuno.`, `In realtÃ  le persone hanno bisogno di vedere la differenza. Nel tuo caso significa rendere concreti elementi come ${w1}, ${w2}, ${w3} e ${w4}, invece di restare su frasi che potrebbero andare bene per chiunque.`, `Spiega un errore frequente, fai un esempio pratico e mostra come ${d.naturalOffer} aiuta a ottenere ${d.naturalResult}.`, 2)
    },
    {
      title: "Vendita soft",
      text: buildReadyCaption(d, `Prima di acquistare, prenotare o chiedere informazioni, una persona deve riconoscere un desiderio preciso.`, `Non basta presentare ${d.productPhrase}. Serve far vedere cosa cambia: piÃ¹ ${w5}, piÃ¹ attenzione al dettaglio, meno sensazione di scegliere qualcosa di anonimo o poco adatto.`, `La vendita soft funziona quando non spingi, ma accompagni: fai vedere il problema, mostri ${d.concreteDetail} e rendi naturale il passo successivo.`, 3)
    },
    {
      title: "Diretta e persuasiva",
      text: buildReadyCaption(d, `Se una scelta non lascia il segno, il problema non Ã¨ sempre il prezzo. Spesso Ã¨ che manca un motivo forte per ricordarla.`, `Per questo devi portare in primo piano ${w1}, ${w2} e ${w3}: sono gli elementi che trasformano una descrizione generica in qualcosa che il cliente puÃ² immaginare, desiderare e valutare davvero.`, `Chiudi con una CTA semplice: invita a salvare, chiedere informazioni, prenotare o scegliere il dettaglio piÃ¹ vicino al proprio stile.`, 4)
    }
  ];

  return rotate(captions, seedFrom(d)).map((caption) => ({
    title: caption.title,
    text: polishSentence(caption.text)
  }));
}

function buildReadyCaption(d: ReturnType<typeof normalizeForm>, opening: string, example: string, solution: string, ctaIndex: number) {
  const [w1, w2, w3, w4, w5, w6] = d.sectorWords;

  return `${opening}

Il problema nasce quando ${d.audiencePhrase} incontra qualcosa che sembra giÃ  visto: una descrizione piatta, un dettaglio poco valorizzato, una promessa che non fa immaginare davvero il risultato. A quel punto l'attenzione cala, anche se alla base c'Ã¨ una proposta interessante.

${example}

Esempio pratico: invece di parlare in modo generico, porta la persona dentro una scena concreta. Mostra ${w1}, spiega perchÃ© ${w2} conta, collega ${w3} a un desiderio reale e usa ${w4} come dettaglio visivo o narrativo. CosÃ¬ il testo non sembra un consiglio astratto, ma un contenuto pronto da pubblicare.

${solution}

La mini soluzione Ã¨ questa: scegli un solo punto forte, raccontalo con parole del settore come ${w5} e ${w6}, poi chiudi con un invito facile da seguire. In questo modo ${d.productPhrase} non resta una semplice idea, ma diventa qualcosa che il cliente puÃ² capire, immaginare e ricordare.

${captionCta(d, ctaIndex)}`;
}

function buildCtas(d: ReturnType<typeof normalizeForm>) {
  const s = d.strategy;
  const ctas = [
    `Scrivimi "${keyword(d)}" se vuoi trasformare questa situazione in un percorso piÃ¹ chiaro e sostenibile.`,
    `Salva questo contenuto se ti serve una traccia meno generica per parlare a chi Ã¨ fermo tra dubbi, tentativi e troppe opzioni.`,
    `Commenta con l'ostacolo che vedi piÃ¹ spesso: ti rispondo con un'idea di contenuto da usare su ${d.platform}.`,
    `Se vuoi comunicare la tua proposta senza sembrare uguale a tutti, parti da questo cambio di prospettiva.`,
    `Condividilo con chi continua a provare soluzioni diverse ma non ha ancora trovato una direzione semplice da seguire.`,
    `Vuoi rendere piÃ¹ credibile la tua proposta? Parti da ${s.commonMistakeLower} e mostra un'alternativa concreta.`,
    `Mandami un messaggio se vuoi trasformare la tua proposta in un contenuto piÃ¹ ${d.tone}, utile e meno promozionale.`,
    `Salva questa traccia: ti aiuta a parlare del desiderio finale senza ripetere sempre le stesse parole.`,
    `Usala per il tuo prossimo ${d.contentType}: prima mostra il blocco, poi la nuova prospettiva, poi la CTA.`,
    `Se questa lettura ti sembra familiare, il prossimo passo Ã¨ rendere il messaggio piÃ¹ specifico per ${s.audienceView}.`
  ];

  return rotate(ctas, seedFrom(d)).slice(0, 5);
}

function buildReel(d: ReturnType<typeof normalizeForm>) {
  if (d.category === "literature") return buildLiteratureReel(d);

  const s = d.strategy;
  const [w1, w2, w3, w4] = d.sectorWords;

  return {
    duration: d.platform === "LinkedIn" ? "35-50 secondi" : "18-28 secondi",
    scenes: [
      {
        time: "0-2 secondi",
        scene: "Hook iniziale pronto",
        screenText: `Non basta mostrare ${w1}: serve far capire il perchÃ©.`,
        voiceover: `${d.opener} Il punto non Ã¨ mostrare qualcosa e sperare che piaccia. Il punto Ã¨ far capire subito perchÃ© ${w1}, ${w2} e un dettaglio concreto possono cambiare la percezione di chi guarda.`,
        visual: `Inquadra subito un dettaglio concreto: ${w1}, ${w2} o un elemento visivo legato a ${d.productPhrase}.`
      },
      {
        time: "2-5 secondi",
        scene: "Problema reale",
        screenText: `Quando tutto sembra uguale, nessuno si ferma.`,
        voiceover: `Chi guarda ha bisogno di riconoscere una differenza. Se vede solo una descrizione generica, passa oltre. Se invece vede ${w3}, ${w4} e un beneficio concreto, inizia a immaginare se stesso dentro quella scelta.`,
        visual: `Mostra confronto rapido: opzione anonima contro dettaglio specifico legato a ${d.concreteDetail}.`
      },
      {
        time: "5-8 secondi",
        scene: "Mini soluzione",
        screenText: `Fai vedere il dettaglio, poi racconta il perchÃ©.`,
        voiceover: `Parti da un elemento concreto, spiega perchÃ© conta e collega tutto al risultato desiderato: ${d.naturalResult}. Non serve dire tutto. Serve far percepire un motivo chiaro per scegliere.`,
        visual: `Tre tagli: dettaglio di ${w1}, esempio di ${w2}, risultato finale o scena d'uso.`
      },
      {
        time: "Finale",
        scene: "CTA coerente con l'obiettivo",
        screenText: `${capitalize(s.desire)}: parti da un dettaglio vero.`,
        voiceover: `${capitalize(d.naturalOffer)} serve proprio a questo: trasformare una scelta generica in qualcosa di piÃ¹ riconoscibile, concreto e facile da ricordare. Se vuoi capire quale dettaglio valorizzare, parti da qui.`,
        visual: `Schermata finale con ${d.productPhrase}, CTA grande e un dettaglio visivo coerente con ${d.naturalNiche}.`
      }
    ]
  };
}

function buildCarousel(d: ReturnType<typeof normalizeForm>) {
  if (d.category === "literature") return buildLiteratureCarousel(d);

  const s = d.strategy;
  const [w1, w2, w3, w4, w5] = d.sectorWords;

  return [
    {
      slide: 1,
      role: "titolo forte",
      title: `${capitalize(w1)} che si fa ricordare, non parole che si dimenticano`,
      text: `Se vuoi far fermare le persone, parti da ${w2} e da un dettaglio concreto che renda subito riconoscibile ciÃ² che offri.`,
      visual: `Titolo grande, contrasto forte, elemento visivo collegato a ${d.naturalNiche} ma senza testo troppo descrittivo.`
    },
    {
      slide: 2,
      role: "problema",
      title: "Il problema non Ã¨ la mancanza di alternative",
      text: `Il problema Ã¨ che troppe opzioni sembrano uguali. Senza ${w3}, chi guarda non capisce perchÃ© dovrebbe scegliere proprio te.`,
      visual: `Mostra due alternative: una anonima e una con ${d.concreteDetail}.`
    },
    {
      slide: 3,
      role: "errore comune",
      title: "L'errore piÃ¹ comune",
      text: `Raccontare solo cosa offri, senza far vedere perchÃ© ${w4} cambia l'esperienza o la percezione finale.`,
      visual: `Due colonne: descrizione generica vs dettaglio concreto con ${w4}.`
    },
    {
      slide: 4,
      role: "nuova prospettiva",
      title: "Cambia punto di partenza",
      text: `Non partire da frasi generiche. Parti da una scena: una persona vede ${w1}, nota ${w2} e capisce il beneficio.`,
      visual: `Freccia da "visto al volo" a "lo voglio capire meglio".`
    },
    {
      slide: 5,
      role: "soluzione pratica",
      title: "La soluzione semplice",
      text: `Usa questa sequenza: dettaglio concreto, problema riconoscibile, esempio reale, beneficio, invito all'azione.`,
      visual: `Mini schema in cinque step con parole chiave: ${w1}, ${w2}, ${w3}, ${w4}, ${w5}.`
    },
    {
      slide: 6,
      role: "beneficio finale",
      title: "Cosa cambia davvero",
      text: `${capitalize(s.emotionalBenefit)}. Il beneficio non resta astratto: diventa qualcosa che la persona puÃ² immaginare.`,
      visual: `Prima/dopo: scelta anonima vs scelta con personalitÃ , cura o valore percepibile.`
    },
    {
      slide: 7,
      role: "CTA",
      title: "Vuoi applicarlo al tuo caso?",
      text: `Salva il carosello e scegli oggi un dettaglio concreto da raccontare: puÃ² essere ${w1}, ${w2} o ${d.concreteDetail}.`,
      visual: "CTA grande, spazio bianco, freccia o pulsante grafico ben visibile."
    }
  ];
}

function buildIdeas(d: ReturnType<typeof normalizeForm>) {
  if (d.category === "literature") {
    return [
      "Riscrivi una frase piatta in tre versioni: piÃ¹ visiva, piÃ¹ tesa, piÃ¹ intima. Chiedi al pubblico quale continua a leggere.",
      "Mostra un prima/dopo narrativo: da tema astratto a scena concreta con oggetto, gesto e domanda aperta.",
      "Crea un post con tre incipit possibili per la stessa storia e invita i lettori a scegliere quello piÃ¹ magnetico.",
      "Racconta un personaggio attraverso una contraddizione: ciÃ² che mostra agli altri e ciÃ² che non vuole ammettere.",
      "Trasforma un blocco creativo in metodo: scena, conflitto, voce, chiusura con eco."
    ];
  }

  const s = d.strategy;

  return [
    `Mini caso pratico: racconta il passaggio da tentativi disordinati a una prima azione guidata, collegando solo alla fine la tua proposta.`,
    `Post confronto: metodo improvvisato contro metodo guidato, con esempi concreti adatti a ${d.platform}.`,
    "Storia cliente tipo: mostra il momento in cui la persona capisce che il problema non Ã¨ impegnarsi di piÃ¹, ma scegliere un percorso piÃ¹ sostenibile.",
    `Checklist rapida: 5 segnali che indicano che stai complicando troppo il percorso verso ${s.desire}.`,
    `Contenuto obiezioni: rispondi al dubbio "e se non facesse per me?" con prove logiche, passaggi semplici e un linguaggio coerente con il tuo stile.`
  ];
}

function buildAngles(d: ReturnType<typeof normalizeForm>) {
  if (d.category === "literature") {
    return [
      {
        title: "Errore che spegne il testo",
        description: "Mostra come una scena solo descrittiva perda forza quando non contiene desiderio, conflitto o una domanda aperta."
      },
      {
        title: "Mito da sfatare",
        description: "Ribalta l'idea che l'originalitÃ  nasca da parole difficili: spesso nasce da un dettaglio preciso raccontato con voce riconoscibile."
      },
      {
        title: "Prima riga come promessa",
        description: "Usa l'apertura per far capire subito al lettore che dentro il testo c'Ã¨ una tensione da seguire, non solo una bella frase."
      }
    ];
  }

  const s = d.strategy;

  return [
    {
      title: "Errore che blocca il risultato",
      description: `Mostra come ${s.commonMistakeLower} renda il percorso piÃ¹ faticoso. Poi presenta una scelta piÃ¹ semplice, concreta e collegata alla tua proposta.`
    },
    {
      title: "Mito da sfatare",
      description: `Parti dalla falsa credenza "${s.falseBeliefLower}" e ribaltala: il pubblico non ha bisogno di pressione extra, ma di un modo piÃ¹ chiaro per iniziare e continuare.`
    },
    {
      title: "Risultato visto dal lato emotivo",
      description: `Non parlare solo del traguardo pratico. Racconta ${s.emotionalBenefitLower}: Ã¨ spesso questo che rende il contenuto piÃ¹ memorabile e piÃ¹ umano.`
    }
  ];
}

function buildMistakes(d: ReturnType<typeof normalizeForm>) {
  if (d.category === "literature") {
    return [
      "Partire dal tema astratto invece che da una scena concreta: il lettore deve vedere qualcosa prima di interpretarlo.",
      "Confondere stile curato e originalitÃ : una frase elegante non basta se non apre tensione o curiositÃ .",
      "Spiegare troppo presto il significato: lascia spazio a voce, dettagli e sottotesto prima di chiudere il senso."
    ];
  }

  const s = d.strategy;

  return [
    `Ripetere alla lettera il problema dichiarato: suona meccanico. Meglio trasformarlo in una situazione concreta, come ${s.painPointLower}.`,
    `Promettere un risultato garantito: meglio usare una promessa realistica, cioÃ¨ ${s.realisticPromiseLower}.`,
    `Presentare l'offerta troppo presto: prima crea identificazione, poi mostra il cambio di prospettiva, infine proponi il passo successivo.`
  ];
}

function buildLiteratureHooks(d: ReturnType<typeof normalizeForm>) {
  const hooks = [
    "La prima riga non deve spiegare tutto: deve far venire voglia di restare.",
    "Un racconto diventa prevedibile quando manca una domanda che resta aperta.",
    "Se il lettore capisce giÃ  dove andrai a finire, lo hai perso prima del finale.",
    "Non serve una trama complicata: serve una voce che non sembri intercambiabile.",
    "Il vero problema dei testi piatti non Ã¨ lo stile. Ãˆ l'assenza di tensione.",
    "Prima di scrivere piÃ¹ veloce, scegli cosa deve far sentire la scena.",
    "Un personaggio resta impresso quando desidera qualcosa e rischia qualcosa.",
    "La frase bella da sola non basta se non spinge avanti la storia.",
    "Vuoi rendere un testo piÃ¹ originale? Parti dal conflitto, non dall'aggettivo.",
    "Il lettore non cerca solo parole curate. Cerca un motivo per voltare pagina."
  ];

  return rotate(hooks, seedFrom(d)).map((hook) => polishSentence(hook));
}

function buildLiteratureCaptions(d: ReturnType<typeof normalizeForm>) {
  const captions = [
    {
      title: "Storytelling breve",
      text: `Ci sono testi che sembrano corretti, puliti, perfino eleganti. Eppure dopo poche righe il lettore si stacca.

Succede quando la pagina non crea una piccola promessa narrativa. Non basta scrivere bene: serve far percepire subito una voce, un attrito, una domanda aperta. Chi ama la letteratura non vuole solo frasi ordinate; vuole sentire che dentro quelle righe c'Ã¨ qualcosa che vale la pena seguire.

Un modo semplice per partire Ã¨ questo: prima di costruire tutto il testo, scegli il punto di tensione. Che cosa manca al personaggio? Che cosa non viene detto? Quale dettaglio rende la scena meno prevedibile?

Da lÃ¬ puoi scrivere piÃ¹ velocemente senza cadere nel generico: hai una direzione, un ritmo e un motivo per cui il lettore dovrebbe continuare.

Se vuoi pubblicare un post letterario oggi, prova a partire da una sola scena: una porta chiusa, una frase non detta, un personaggio che finge di stare bene. Poi lascia che il testo giri intorno a quella crepa.

Salva questa traccia e usala quando vuoi trasformare un'idea in un contenuto narrativo piÃ¹ riconoscibile.`
    },
    {
      title: "Problema / soluzione",
      text: `Un testo non sembra originale solo perchÃ© usa parole insolite.

Molti contenuti letterari annoiano perchÃ© partono dal tema invece che dalla situazione. Parlano di nostalgia, amore, solitudine, cambiamento, ma non mostrano un momento preciso in cui quei temi diventano visibili.

La differenza nasce quando il lettore puÃ² entrare in una scena concreta. Non "una persona triste", ma qualcuno che rilegge lo stesso messaggio per la quinta volta. Non "un amore finito", ma due tazze ancora sul tavolo e nessuno che ha il coraggio di sparecchiare.

Questa Ã¨ la svolta: prima la scena, poi il significato. Prima un dettaglio vivo, poi l'interpretazione.

Per scrivere bozze narrative piÃ¹ velocemente, non cercare subito la frase perfetta. Crea una piccola lista di immagini narrative: un oggetto, un gesto, una contraddizione, una domanda. Da lÃ¬ il testo smette di sembrare costruito a freddo e comincia a muoversi.

Commenta con una scena o un tema: puÃ² diventare l'inizio di un contenuto letterario da sviluppare.`
    },
    {
      title: "Educativa",
      text: `La falsa credenza piÃ¹ comune nella scrittura creativa Ã¨ pensare che l'originalitÃ  arrivi aggiungendo complessitÃ .

In realtÃ  spesso accade il contrario. Un testo diventa piÃ¹ forte quando togli spiegazioni inutili e lasci parlare una scelta precisa: un dettaglio, una voce, un conflitto, una mancanza.

Se un post letterario sembra debole, controlla queste tre cose. La prima: la scena contiene una tensione o Ã¨ solo descrizione? La seconda: il personaggio vuole qualcosa o resta fermo dentro parole belle? La terza: il lettore ha una domanda a cui desidera risposta?

Quando questi elementi ci sono, anche un testo breve puÃ² sembrare piÃ¹ profondo e meno giÃ  visto. Non perchÃ© promette di essere geniale, ma perchÃ© guida l'attenzione.

Per lavorare piÃ¹ rapidamente, usa questa sequenza: immagine concreta, piccolo conflitto, frase che cambia prospettiva, chiusura che lascia eco.

Salva questo schema e provalo nel prossimo post: ti aiuta a scrivere con piÃ¹ direzione senza perdere voce narrativa.`
    },
    {
      title: "Vendita soft",
      text: `Chi legge contenuti letterari non cerca solo "bei testi".

Cerca una sensazione precisa: entrare in poche righe, riconoscere una voce, sentire che quella storia non Ã¨ la copia sbiadita di mille altre. Per questo un percorso creativo, una raccolta di racconti o un servizio di scrittura non dovrebbe essere presentato solo come "testi originali".

Deve far vedere come nasce quell'originalitÃ : dalla scelta della scena, dal ritmo, dai personaggi, dal modo in cui una frase apre una domanda invece di chiuderla subito.

La vendita soft funziona quando non spingi il lettore a fidarsi: gli fai assaggiare il metodo. Mostri un prima e dopo narrativo. Prendi una frase piatta e la trasformi in una scena. Prendi un'idea generica e le dai voce.

CosÃ¬ l'offerta diventa piÃ¹ concreta: non promette magia, mostra un modo piÃ¹ chiaro per creare testi riconoscibili e pubblicabili con meno dispersione.

Se vuoi capire quale angolo narrativo usare per il tuo prossimo contenuto, scrivimi una parola chiave e partiamo da lÃ¬.`
    },
    {
      title: "Diretta e persuasiva",
      text: `Se un testo sembra giÃ  letto, il problema non si risolve aggiungendo aggettivi.

Si risolve prendendo una decisione narrativa piÃ¹ netta. Chi parla? Che cosa vuole? Che cosa non osa dire? Quale dettaglio rende la scena diversa da una descrizione qualunque?

Il lettore si annoia quando sente che il testo non rischia nulla. Tutto Ã¨ corretto, tutto Ã¨ ordinato, ma niente crea attrito. Invece anche un contenuto breve puÃ² funzionare se contiene una piccola frizione: un desiderio trattenuto, una contraddizione, una promessa non mantenuta, un finale che sposta il significato.

Per creare piÃ¹ velocemente, parti da una struttura semplice: una scena riconoscibile, un elemento fuori posto, una frase che cambia il senso, una chiusura che invita a reagire.

Non devi scrivere di piÃ¹. Devi dare al lettore un motivo piÃ¹ forte per restare.

Salva questa traccia e usala come controllo prima di pubblicare il prossimo testo letterario.`
    }
  ];

  return rotate(captions, seedFrom(d)).map((caption) => ({
    title: caption.title,
    text: polishSentence(caption.text)
  }));
}

function buildLiteratureReel(d: ReturnType<typeof normalizeForm>) {
  return {
    duration: d.platform === "LinkedIn" ? "35-50 secondi" : "18-28 secondi",
    scenes: [
      {
        time: "0-2 secondi",
        scene: "Hook iniziale",
        screenText: "La prima riga decide se il lettore resta.",
        voiceover: "Un testo letterario non deve spiegare tutto all'inizio. Deve aprire una domanda, creare una piccola tensione e far sentire una voce riconoscibile.",
        visual: "Inquadra una pagina con una prima frase evidenziata, poi taglio rapido su una versione piÃ¹ forte della stessa apertura."
      },
      {
        time: "2-5 secondi",
        scene: "Problema reale",
        screenText: "Il testo Ã¨ corretto, ma non crea curiositÃ .",
        voiceover: "Quando una scena resta solo descrittiva, il lettore capisce le parole ma non sente il bisogno di continuare. Manca conflitto, ritmo o un dettaglio che sposti l'attenzione.",
        visual: "Mostra due colonne: 'descrizione piatta' e 'scena con tensione'."
      },
      {
        time: "5-8 secondi",
        scene: "Mini soluzione",
        screenText: "Parti da scena, conflitto, dettaglio.",
        voiceover: "Scegli un gesto concreto, aggiungi una domanda nascosta e chiudi con una frase che lasci eco. CosÃ¬ puoi scrivere una bozza narrativa piÃ¹ velocemente senza sembrare generico.",
        visual: "Tre overlay in sequenza: scena, conflitto, frase finale."
      },
      {
        time: "Finale",
        scene: "CTA",
        screenText: "Vuoi rendere il testo meno prevedibile?",
        voiceover: "Prendi il prossimo contenuto e chiediti: quale dettaglio farebbe restare un lettore una riga in piÃ¹? Parti da quello.",
        visual: "Schermata finale con CTA: salva lo schema o commenta con una prima frase da migliorare."
      }
    ]
  };
}

function buildLiteratureCarousel(d: ReturnType<typeof normalizeForm>) {
  void d;

  return [
    {
      slide: 1,
      role: "titolo forte",
      title: "Il tuo testo annoia? Parti dalla prima riga",
      text: "Una buona apertura non spiega tutto: crea una domanda che il lettore vuole seguire.",
      visual: "Titolo grande su sfondo pulito, dettaglio di una pagina con la prima riga evidenziata."
    },
    {
      slide: 2,
      role: "problema",
      title: "Il problema non Ã¨ scrivere bene",
      text: "Molti testi sono corretti, ma sembrano giÃ  letti perchÃ© non hanno tensione narrativa.",
      visual: "Due brevi esempi affiancati: frase piatta vs frase con una domanda implicita."
    },
    {
      slide: 3,
      role: "errore comune",
      title: "L'errore: partire dal tema",
      text: "Amore, nostalgia o solitudine restano astratti se non diventano scena, gesto o conflitto.",
      visual: "Tre parole astratte che si trasformano in immagini concrete."
    },
    {
      slide: 4,
      role: "nuova prospettiva",
      title: "Prima la scena, poi il significato",
      text: "Mostra un dettaglio preciso e lascia che il lettore capisca il tema senza spiegazione pesante.",
      visual: "Freccia da 'tema' a 'scena': oggetto, gesto, frase non detta."
    },
    {
      slide: 5,
      role: "soluzione pratica",
      title: "Usa questa sequenza",
      text: "Scena concreta, piccolo conflitto, voce riconoscibile, chiusura che lascia eco.",
      visual: "Schema in quattro step con icone semplici: occhio, scintilla, voce, eco."
    },
    {
      slide: 6,
      role: "beneficio finale",
      title: "Cosa cambia",
      text: "Il testo diventa piÃ¹ leggibile, piÃ¹ rapido da creare e meno simile a ciÃ² che il lettore ha giÃ  visto.",
      visual: "Prima/dopo: bozza confusa vs testo con struttura narrativa."
    },
    {
      slide: 7,
      role: "CTA",
      title: "Provalo sul prossimo post",
      text: "Scegli una scena e riscrivila partendo da una tensione. Poi guarda se invita a leggere la riga dopo.",
      visual: "CTA grande: salva il carosello o commenta con una frase da trasformare."
    }
  ];
}

function applyQualityControl(content: GeneratedContent, d: ReturnType<typeof normalizeForm>): GeneratedContent {
  return {
    hooks: content.hooks.map((text, index) => avoidMechanicalPhrasing(text, d, index)),
    captions: content.captions.map((caption, index) => ({
      title: polishSentence(caption.title),
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
      title: polishSentence(slide.title),
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

function diversifyContent(content: GeneratedContent, d: ReturnType<typeof normalizeForm>, memory?: SessionMemory): GeneratedContent {
  if (!memory) return content;

  const generationSeed = seedFrom(d) + memory.generation * 17;
  const usedHooks = [...memory.hooks];
  const usedCtas = [...memory.ctas];
  const hooks = content.hooks.map((hook, index) => {
    const replacement = getDiverseText(hook, usedHooks, expandedHookLibrary(d), generationSeed + index);
    usedHooks.push(replacement);
    return replacement;
  });
  const ctas = content.ctas.map((cta, index) => {
    const replacement = getDiverseText(cta, usedCtas, expandedCtaLibrary(d), generationSeed + index * 3);
    usedCtas.push(replacement);
    return replacement;
  });
  const captions = content.captions.map((caption, index) => ({
    ...caption,
    title: getDiverseText(caption.title, memory.structures, expandedCaptionAngles(), generationSeed + index)
  }));

  return { ...content, hooks, ctas, captions };
}

function enforceSectorCoverage(content: GeneratedContent, d: ReturnType<typeof normalizeForm>): GeneratedContent {
  void d;

  return content;
}

function updateSessionMemory(memory: SessionMemory, content: GeneratedContent): SessionMemory {
  return {
    hooks: [...memory.hooks, ...content.hooks].slice(-80),
    ctas: [...memory.ctas, ...content.ctas].slice(-80),
    structures: [...memory.structures, ...content.captions.map((caption) => caption.title)].slice(-50),
    generation: memory.generation + 1
  };
}

function getDiverseText(current: string, used: string[], library: string[], seed: number) {
  const candidates = rotate(library, seed);
  const tooSimilar = (text: string) => used.some((old) => textSimilarity(text, old) > 0.62);

  if (!tooSimilar(current)) return current;

  return candidates.find((candidate) => !tooSimilar(candidate)) || candidates[0] || current;
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
  const intro = [
    "Generatore Contenuti Social PRO",
    "Output operativo da personalizzare in base al brand, al pubblico e al canale.",
    "Nota: usa questi contenuti come traccia strategica. I risultati dipendono da costanza, qualitÃ  della pubblicazione e mercato."
  ].join("\n");
  const all = [intro, hooks, captions, ctas, reel, carousel, ideas, angles, mistakes].join("\n\n---\n\n");

  return { all, hooks, captions, ctas, reel, carousel, ideas, angles, mistakes };
}

function captionCta(d: ReturnType<typeof normalizeForm>, index: number) {
  const ctas = [
    `Scrivimi "${keyword(d)}" se vuoi capire qual Ã¨ il primo passo piÃ¹ semplice da fare.`,
    `Salva questo post: puÃ² tornarti utile quando senti di complicare troppo il percorso.`,
    `Commenta con l'ostacolo che ti blocca piÃ¹ spesso: potrei trasformarlo in un esempio pratico.`,
    `Se vuoi piÃ¹ chiarezza, inizia da una scelta piccola ma fatta bene.`,
    `Condividilo con una persona che continua a ripartire da capo.`,
    `Mandami il tuo caso e ti aiuto a renderlo piÃ¹ chiaro e comunicabile.`,
    `Prova questa struttura nel tuo prossimo ${d.contentType} e osserva quali risposte ricevi.`,
    `Scrivi quale parte ti pesa di piÃ¹: iniziare, scegliere o restare costante.`,
    `Salva la caption se vuoi costruire contenuti piÃ¹ utili e meno improvvisati.`,
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
  const storyOpening = `C'Ã¨ un momento preciso in cui ${audienceView} capisce che ${lowerFirst(painPoint)} non Ã¨ piÃ¹ solo un fastidio, ma qualcosa che sta rallentando il percorso verso ${desire}.`;

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
    localService: ["lavanderia", "self service", "bucato", "lavatrici", "asciugatrici", "detersivo", "piumoni", "lavaggio"],
    realEstate: ["immob", "affitto", "vendita casa", "vendere casa", "appartamento", "villa", "agenzia immobiliare"],
    knowledge: ["corso", "digitale", "online", "consul", "coaching", "formazione", "mentor", "business"],
    publishing: ["kdp", "amazon kdp", "libri da colorare", "ebook da colorare", "coloring book", "pubblicare libri", "pagine da colorare"],
    finance: ["finanzi", "budget", "risparmi", "investimenti", "protezione", "denaro", "patrimonio", "pianificazione familiare"],
    fashion: ["abbigliamento", "moda", "capi", "giacca", "camicia", "jeans", "vestiti", "stile", "armadio", "personalizzati"],
    photography: ["fotograf", "matrimonio", "reportage", "scatti", "foto", "shooting", "ritratto"],
    literature: ["letteratura", "letterari", "romanzo", "racconto", "trama", "personaggi", "scrittura", "autore", "lettori", "libri"],
    hospitality: ["b&b", "bed and breakfast", "casa vacanze", "soggiorno", "ospiti", "prenotazioni", "recensioni", "camera", "alloggio"],
    digitalProduct: ["ebook", "funnel", "lead magnet", "prodotti digitali", "vendita online", "template", "creator", "freelance"],
    neutral: []
  };

  const priority: NicheCategory[] = [
    "publishing",
    "finance",
    "localService",
    "literature",
    "digitalProduct",
    "hospitality",
    "photography",
    "realEstate",
    "localFood",
    "beauty",
    "wellness",
    "knowledge",
    "fashion"
  ];

  return priority.find((category) =>
    groups[category].some((word) => matchesDomainTerm(text, word))
  ) || "neutral";
}

function analyzeBusinessInput(raw: { niche: string; offer: string; audience: string; problem: string; result: string }, category: NicheCategory) {
  const text = Object.values(raw).join(" ").toLowerCase();
  const marketingTerms = [
    "marketing",
    "social media",
    "content creation",
    "creator",
    "caption",
    "hook",
    "reel",
    "contenuti",
    "pubblicare",
    "instagram",
    "tiktok",
    "tool ai",
    "agenzia",
    "copywriting"
  ];
  const isMarketingContext = category !== "literature" && marketingTerms.some((word) => matchesDomainTerm(text, word));
  const concreteDetail = extractConcreteDetail(raw, category);

  return {
    isMarketingContext,
    concreteDetail,
    productPhrase: makeProductPhrase(raw.offer || raw.niche, category, concreteDetail),
    audiencePhrase: makeSafeAudience(raw.audience)
  };
}

function extractConcreteDetail(raw: { niche: string; offer: string; audience: string; problem: string; result: string }, category: NicheCategory) {
  const detailSource = [raw.offer, raw.result, raw.niche, raw.problem].join(". ");
  const details = detailSource
    .split(/[,.]/)
    .map((part) => cleanInput(part))
    .filter((part) => part.length > 8 && part.split(" ").length <= 12);

  const fallback: Record<NicheCategory, string[]> = {
    wellness: ["costanza, energia e metodo sostenibile"],
    beauty: ["cura, luminositÃ  e risultato visibile"],
    localFood: ["sapori, atmosfera e ingredienti riconoscibili"],
    localService: ["tempo risparmiato, bucato curato e servizio pratico"],
    realEstate: ["valore dell'immobile e chiarezza dell'offerta"],
    knowledge: ["fiducia, chiarezza e percorso guidato"],
    publishing: ["nicchia, pagine coerenti e file pronto per KDP"],
    finance: ["budget familiare, risparmio e decisioni piÃ¹ serene"],
    fashion: ["stile personale, dettagli unici e capi non anonimi"],
    photography: ["ricordi naturali, emozioni spontanee e stile elegante"],
    literature: ["romanzo, racconto, trama e lettori"],
    hospitality: ["ospiti, soggiorno, prenotazioni e recensioni"],
    digitalProduct: ["creator, lead, funnel e vendita online"],
    neutral: ["valore concreto, scelta piÃ¹ chiara e beneficio reale"]
  };

  if (category !== "neutral") return chooseVariant(fallback[category], detailSource);
  if (details.length > 0) return chooseVariant(details, `${raw.offer}${raw.result}${category}`);

  return chooseVariant(fallback[category], detailSource);
}

function makeProductPhrase(value: string, category: NicheCategory, detail: string) {
  if (!isShortInput(value)) return softenSentence(value);

  const fallback: Record<NicheCategory, string[]> = {
    wellness: ["un percorso semplice e sostenibile"],
    beauty: ["un trattamento pensato per valorizzare la cura personale"],
    localFood: ["un'esperienza di gusto da vivere dal vivo"],
    localService: ["un servizio pratico che fa risparmiare tempo nelle incombenze quotidiane"],
    realEstate: ["una proposta immobiliare da raccontare con piÃ¹ chiarezza"],
    knowledge: ["un percorso guidato che rende piÃ¹ chiaro il valore"],
    publishing: ["un percorso pratico per trasformare un'idea creativa in un file pubblicabile"],
    finance: ["una consulenza che aiuta a mettere ordine tra budget, risparmio e scelte familiari"],
    fashion: ["capi personalizzati che raccontano stile e personalitÃ "],
    photography: ["un reportage naturale che conserva emozioni autentiche"],
    literature: ["contenuti letterari con trama, stile narrativo e personaggi riconoscibili"],
    hospitality: ["un soggiorno pensato per far sentire gli ospiti accolti"],
    digitalProduct: ["un prodotto digitale pensato per semplificare lavoro, lead o vendita online"],
    neutral: ["una proposta concreta legata a un bisogno reale"]
  };

  return chooseVariant(fallback[category], detail);
}

function makeSafeAudience(audience: string) {
  if (isShortInput(audience)) return "chi cerca una soluzione piÃ¹ adatta al proprio modo di vivere";

  return "chi ha questo bisogno concreto";
}

function getSectorWords(category: NicheCategory, raw: { niche: string; offer: string; audience: string; problem: string; result: string }) {
  const base: Record<NicheCategory, string[]> = {
    wellness: ["allenamento", "costanza", "dimagrimento", "energia", "metabolismo", "abitudini"],
    beauty: ["pelle", "trattamento", "luminositÃ ", "routine", "rughe", "viso"],
    localFood: ["piatto", "sapori", "ingredienti", "prenotazione", "tavolo", "tradizione"],
    localService: ["bucato", "lavaggio", "asciugatura", "piumoni", "lavatrici", "tempo risparmiato"],
    realEstate: ["appartamento", "valutazione", "acquirenti", "immobile", "mutuo", "investimento"],
    knowledge: ["percorso", "competenza", "metodo", "fiducia", "risultato", "consulenza"],
    publishing: ["nicchia", "pagine", "copertina", "file KDP", "libro da colorare", "pubblicazione"],
    finance: ["budget", "risparmio", "protezione", "investimenti", "famiglia", "piano finanziario"],
    fashion: ["capo", "stile", "giacca", "camicia", "dettaglio", "personalitÃ "],
    photography: ["reportage", "scatti", "emozioni", "ricordi", "matrimonio", "spontaneitÃ "],
    literature: ["romanzo", "racconto", "trama", "personaggi", "lettori", "stile narrativo"],
    hospitality: ["ospiti", "soggiorno", "prenotazioni", "recensioni", "camera", "accoglienza"],
    digitalProduct: ["creator", "ebook", "lead", "funnel", "vendita online", "asset digitale"],
    neutral: ["dettaglio", "scelta", "beneficio", "esperienza", "risultato", "prova concreta"]
  };
  const inputWords = Object.values(raw)
    .join(" ")
    .split(/[\s,.;:!?]+/)
    .map((word) => cleanInput(word).toLowerCase())
    .filter((word) => word.length > 4 && !["vogliono", "problema", "risultato", "pubblico", "persone", "contenuti", "letterari"].includes(word));

  return Array.from(new Set([...base[category], ...inputWords.slice(0, 4)])).slice(0, 8);
}

function buildSectorScenario(category: NicheCategory, words: string[]) {
  const [w1, w2, w3] = words;
  const scenarios: Record<NicheCategory, string> = {
    wellness: `una persona prova a restare costante tra ${w1}, ${w2} e risultati sostenibili`,
    beauty: `una persona cerca una routine in cui ${w1}, ${w2} e cura del viso si vedano davvero`,
    localFood: `un cliente immagina ${w1}, ${w2} e il momento al tavolo prima di prenotare`,
    localService: `una persona valuta ${w1}, ${w2} e comoditÃ  prima di scegliere un servizio vicino`,
    realEstate: `un proprietario o acquirente valuta ${w1}, ${w2} e fiducia nella scelta`,
    knowledge: `un potenziale cliente deve capire metodo, competenza e prossimo passo`,
    publishing: `un principiante passa da idea creativa a ${w1}, ${w2} e file pronto da pubblicare`,
    finance: `una famiglia valuta ${w1}, ${w2} e serenitÃ  prima di prendere decisioni importanti`,
    fashion: `una persona guarda ${w1}, ${w2} e dettagli che raccontano stile personale`,
    photography: `una coppia immagina ${w1}, ${w2} e ricordi autentici del momento`,
    literature: `un lettore incontra ${w1}, ${w2} e ${w3} e decide se restare nella storia`,
    hospitality: `un ospite valuta ${w1}, ${w2} e sensazione di accoglienza prima di prenotare`,
    digitalProduct: `un creator collega ${w1}, ${w2} e ${w3} a un risultato operativo`,
    neutral: `una persona valuta ${w1}, ${w2} e un beneficio concreto prima di scegliere`
  };

  return scenarios[category];
}

function makeNaturalNiche(niche: string, category: NicheCategory) {
  const variants: Record<NicheCategory, string[]> = {
    wellness: ["benessere e forma fisica", "abitudini piÃ¹ sostenibili", "percorso di cambiamento personale"],
    beauty: ["cura personale", "immagine e routine di bellezza", "risultati visibili e curati"],
    localFood: ["esperienza nel locale", "ospitalitÃ  e gusto", "momenti da vivere e condividere"],
    localService: ["servizio locale pratico e veloce", "comoditÃ  quotidiana e tempo risparmiato", "soluzione semplice per un bisogno concreto"],
    realEstate: ["valorizzazione dell'immobile", "scelta della casa giusta", "presentazione chiara dell'offerta"],
    knowledge: ["competenze trasformate in valore", "fiducia prima della vendita", "percorso guidato di apprendimento"],
    publishing: ["creazione e pubblicazione KDP", "libri da colorare e prodotti editoriali semplici", "percorso creativo verso la pubblicazione"],
    finance: ["pianificazione finanziaria familiare", "budget, risparmio e protezione", "scelte economiche piÃ¹ consapevoli"],
    fashion: ["stile personale e capi unici", "moda che racconta personalitÃ ", "abbigliamento non anonimo"],
    photography: ["ricordi naturali e spontanei", "emozioni raccontate con eleganza", "momenti autentici da conservare"],
    literature: ["racconti, romanzi e stile narrativo", "lettori, personaggi e trame originali", "scrittura creativa non prevedibile"],
    hospitality: ["ospitalitÃ , soggiorno e recensioni", "ospiti, camere e accoglienza", "esperienza di viaggio e prenotazioni"],
    digitalProduct: ["creator, ebook e funnel", "lead magnet e vendita online", "workflow digitale e risultato pratico"],
    neutral: ["valore comunicato meglio", "problema reale trasformato in contenuto utile", "offerta piÃ¹ chiara e comprensibile"]
  };

  return chooseVariant(variants[category], niche);
}

function makeNaturalAudience(audience: string) {
  if (isShortInput(audience)) {
    return "chi vuole fare una scelta migliore ma non ha ancora una strada chiara";
  }

  return "chi si riconosce in questa esigenza concreta";
}

function makeNaturalProblem(problem: string, category: NicheCategory) {
  const variants: Record<NicheCategory, string[]> = {
    wellness: ["iniziare con entusiasmo e poi perdere costanza dopo pochi giorni", "sentirsi confusi tra regole, rinunce e consigli opposti"],
    beauty: ["non vedere un risultato curato e uniforme nonostante tentativi diversi", "sentire che la routine non valorizza davvero la propria immagine"],
    localFood: ["avere qualcosa di valido da offrire ma non riuscire a far venire voglia di provarlo", "pubblicare contenuti che mostrano il prodotto ma non raccontano l'esperienza"],
    localService: ["perdere tempo con un problema pratico che potrebbe essere risolto in modo piÃ¹ semplice", "non sapere dove gestire un bisogno quotidiano senza complicazioni"],
    realEstate: ["presentare un immobile senza far percepire davvero il suo valore", "attirare curiosi invece di persone realmente interessate"],
    knowledge: ["avere competenze utili ma non riuscire a spiegarle in modo semplice", "creare contenuti che informano ma non costruiscono fiducia"],
    publishing: ["avere un'idea creativa ma non sapere come trasformarla in pagine coerenti e pubblicabili", "perdersi tra nicchia, file e pubblicazione senza una sequenza chiara"],
    finance: ["rimandare decisioni importanti perchÃ© entrate, spese e prioritÃ  non sono abbastanza chiare", "sentire che ogni scelta economica pesa di piÃ¹ quando manca un piano familiare"],
    fashion: ["trovare capi belli ma troppo anonimi per raccontare davvero la propria personalitÃ ", "volere qualcosa di unico senza finire nel solito capo uguale a tanti altri"],
    photography: ["avere paura di ritrovarsi con foto rigide, finte o poco spontanee", "voler conservare un momento importante senza pose forzate"],
    literature: ["annoiarsi davanti a testi prevedibili, trame piatte e personaggi senza voce", "cercare racconti o contenuti letterari che catturino dalla prima riga"],
    hospitality: ["scegliere un alloggio senza capire se il soggiorno sarÃ  davvero curato e accogliente", "temere una casa vacanze anonima, fredda o diversa dalle aspettative"],
    digitalProduct: ["avere troppe idee digitali ma non un percorso chiaro per trasformarle in lead o vendite", "perdere tempo tra tool, template e funnel senza un sistema semplice"],
    neutral: ["avere un'offerta valida ma raccontarla in modo troppo generico", "non riuscire a trasformare un problema reale in una scelta comprensibile"]
  };

  return chooseVariant(variants[category], problem);
}

function makeNaturalOffer(offer: string, category: NicheCategory) {
  const base = isShortInput(offer) ? "" : softenSentence(offer);
  const variants: Record<NicheCategory, string[]> = {
    wellness: ["un percorso pensato per creare abitudini piÃ¹ sostenibili", "una guida semplice per ritrovare costanza senza estremismi"],
    beauty: ["un percorso pensato per ottenere un risultato piÃ¹ curato, visibile e armonioso", "un servizio che valorizza la routine e l'immagine personale"],
    localFood: ["un'esperienza che fa venire voglia di prenotare e provare dal vivo", "un modo per trasformare prodotto, atmosfera e gusto in desiderio"],
    localService: ["un servizio pensato per risolvere un bisogno pratico con meno attese e piÃ¹ comoditÃ ", "una soluzione locale che rende piÃ¹ semplice una routine quotidiana"],
    realEstate: ["una presentazione piÃ¹ chiara per valorizzare l'immobile e attirare persone interessate", "un supporto per rendere piÃ¹ comprensibile il valore della casa"],
    knowledge: ["un percorso guidato per trasformare competenze in risultati comprensibili", "una proposta che aiuta a capire il valore prima della vendita"],
    publishing: ["un percorso pratico per scegliere nicchia, creare pagine coerenti e preparare il file KDP", "una guida operativa per passare da idea creativa a pubblicazione piÃ¹ ordinata"],
    finance: ["un percorso di consulenza per mettere ordine tra budget, protezione e decisioni familiari", "un supporto professionale per trasformare dubbi economici in scelte piÃ¹ consapevoli"],
    fashion: ["capi personalizzati che trasformano un capo base in qualcosa di riconoscibile", "un capo unico pensato per raccontare stile e personalitÃ "],
    photography: ["un reportage naturale, spontaneo ed elegante", "un servizio fotografico pensato per conservare emozioni reali"],
    literature: ["contenuti letterari con stile narrativo, personaggi e trame meno prevedibili", "un percorso creativo per trasformare idee, romanzi e racconti in testi piÃ¹ originali"],
    hospitality: ["un'esperienza di soggiorno piÃ¹ accogliente, curata e facile da scegliere", "una casa vacanze raccontata attraverso dettagli, atmosfera e recensioni"],
    digitalProduct: ["un prodotto digitale che aiuta creator e freelance a passare da idea a vendita online", "un sistema pratico per creare lead, asset digitali e funnel piÃ¹ ordinati"],
    neutral: ["una soluzione piÃ¹ chiara per rendere l'offerta comprensibile", "un percorso che aiuta a passare dalla confusione a una scelta piÃ¹ concreta"]
  };

  if (base.length > 22) {
    return chooseVariant(variants[category], offer);
  }

  return chooseVariant(variants[category], offer);
}

function makeNaturalResult(result: string, category: NicheCategory) {
  const variants: Record<NicheCategory, string[]> = {
    wellness: ["sentirsi meglio nel proprio corpo e ritrovare costanza", "rimettersi in forma con un approccio piÃ¹ sostenibile"],
    beauty: ["sentirsi piÃ¹ curati e valorizzati", "vedere un risultato piÃ¹ ordinato, luminoso e naturale"],
    localFood: ["far venire voglia di prenotare", "portare piÃ¹ persone interessate a vivere l'esperienza"],
    localService: ["risolvere un bisogno pratico senza perdere tempo", "uscire con una cosa concreta fatta bene e senza complicazioni"],
    realEstate: ["attirare persone realmente interessate", "far percepire meglio il valore dell'immobile"],
    knowledge: ["far capire il valore della proposta prima della vendita", "creare fiducia e rendere piÃ¹ chiaro il prossimo passo"],
    publishing: ["pubblicare un primo prodotto editoriale con una procedura piÃ¹ chiara", "passare da idea creativa a file pronto con meno confusione"],
    finance: ["prendere decisioni finanziarie piÃ¹ consapevoli e serene", "sentire piÃ¹ controllo su budget, protezione e futuro familiare"],
    fashion: ["indossare un capo che non sembri scelto per caso", "sentirsi rappresentati da dettagli unici e personali"],
    photography: ["rivivere emozioni autentiche senza pose forzate", "conservare il giorno speciale con immagini naturali ed eleganti"],
    literature: ["creare testi piÃ¹ originali, coinvolgenti e riconoscibili", "far restare il lettore dentro la storia fino all'ultima riga"],
    hospitality: ["aumentare prenotazioni da ospiti realmente interessati", "far immaginare un soggiorno curato prima ancora della richiesta"],
    digitalProduct: ["trasformare competenze in asset digitali piÃ¹ vendibili", "creare un percorso piÃ¹ chiaro da lead a vendita online"],
    neutral: ["comunicare il valore in modo piÃ¹ chiaro", "parlare al pubblico giusto con un messaggio piÃ¹ concreto"]
  };

  return chooseVariant(variants[category], result);
}

function buildFalseBelief(category: NicheCategory, result: string) {
  const variants: Record<NicheCategory, string[]> = {
    wellness: ["fare tutto perfettamente o rinunciare a tutto per vedere un cambiamento"],
    beauty: ["cambiare continuamente trattamento o prodotto per vedere risultati visibili"],
    localFood: ["pubblicare solo foto belle e aspettare che le persone prenotino"],
    localService: ["pensare che un servizio pratico non abbia bisogno di spiegare comoditÃ , tempi e vantaggi concreti"],
    realEstate: ["mostrare tante informazioni tecniche e pensare che bastino a convincere"],
    knowledge: ["spiegare tutto subito per dimostrare competenza"],
    publishing: ["pensare che basti caricare un file qualsiasi senza una nicchia, pagine coerenti e una struttura controllata"],
    finance: ["pensare che serva avere giÃ  tutto in ordine prima di chiedere una guida"],
    fashion: ["pensare che basti un capo diverso per esprimere davvero personalitÃ "],
    photography: ["pensare che le foto migliori siano sempre quelle piÃ¹ costruite"],
    literature: ["pensare che basti una bella idea se trama, stile e personaggi restano prevedibili"],
    hospitality: ["pensare che bastino foto belle senza far immaginare davvero il soggiorno"],
    digitalProduct: ["pensare che basti creare un file digitale senza un percorso verso lead e vendita"],
    neutral: ["dire tutto in un unico contenuto per convincere piÃ¹ persone possibile"]
  };

  return chooseVariant(variants[category], result);
}

function buildCommonMistake(category: NicheCategory, offer: string) {
  const variants: Record<NicheCategory, string[]> = {
    wellness: ["cambiare piano ogni volta che cala la motivazione"],
    beauty: ["puntare solo sul prima e dopo senza spiegare il percorso"],
    localFood: ["mostrare il prodotto senza far immaginare il momento in cui viverlo"],
    localService: ["dire solo cosa fai senza mostrare il tempo, la comoditÃ  e il problema pratico che risolvi"],
    realEstate: ["descrivere l'immobile senza raccontare perchÃ© Ã¨ una scelta sensata"],
    knowledge: ["parlare della soluzione prima di far riconoscere il problema"],
    publishing: ["saltare dalla promessa di pubblicare al risultato senza spiegare passaggi, file e scelte editoriali"],
    finance: ["parlare subito di prodotti o investimenti prima di chiarire bisogni, obiettivi e protezione"],
    fashion: ["mostrare il capo senza raccontare il dettaglio che lo rende personale"],
    photography: ["parlare solo di tecnica senza far sentire l'emozione del momento"],
    literature: ["presentare il testo senza far sentire subito voce, conflitto o curiositÃ  narrativa"],
    hospitality: ["mostrare la stanza senza raccontare accoglienza, posizione, dettagli e atmosfera"],
    digitalProduct: ["parlare del tool prima di mostrare il problema operativo che risolve"],
    neutral: ["presentare l'offerta prima di creare identificazione"]
  };

  return chooseVariant(variants[category], offer);
}

function buildEmotionalBenefit(category: NicheCategory, result: string) {
  const variants: Record<NicheCategory, string[]> = {
    wellness: ["sentirsi piÃ¹ leggeri, costanti e meno in lotta con ogni scelta"],
    beauty: ["sentirsi piÃ¹ curati, sicuri e a proprio agio quando ci si guarda"],
    localFood: ["sentire che vale la pena uscire, prenotare e vivere quel momento"],
    localService: ["sentire di aver risolto un problema pratico senza stress e senza perdere mezza giornata"],
    realEstate: ["avere piÃ¹ chiarezza e meno dubbi davanti a una decisione importante"],
    knowledge: ["sentirsi guidati, compresi e piÃ¹ sicuri nel fare il passo successivo"],
    publishing: ["sentire che l'idea creativa puÃ² diventare un progetto concreto invece di restare confusa"],
    finance: ["sentirsi piÃ¹ tranquilli perchÃ© le decisioni familiari hanno una direzione comprensibile"],
    fashion: ["sentirsi riconoscibili, curati e meno uguali a tutti"],
    photography: ["sapere che i ricordi importanti saranno raccontati con naturalezza"],
    literature: ["sentire che una storia ha voce, ritmo e personaggi che restano impressi"],
    hospitality: ["immaginare un soggiorno accogliente, semplice da scegliere e da ricordare"],
    digitalProduct: ["sentire che il percorso da idea a risultato digitale Ã¨ piÃ¹ ordinato e gestibile"],
    neutral: ["sentirsi meno confusi e piÃ¹ sicuri nel scegliere cosa fare dopo"]
  };

  return chooseVariant(variants[category], result);
}

function buildRealisticPromise(offer: string, desire: string) {
  return `${offer} non promette magie: aiuta a rendere piÃ¹ chiaro il prossimo passo verso ${desire}`;
}

function buildNarrativeAngle(audienceView: string, painPoint: string, desire: string) {
  return `raccontare il passaggio da "${painPoint}" a una situazione in cui ${audienceView} riesce a ${desire}`;
}

function adaptHookForPlatform(hook: string, d: ReturnType<typeof normalizeForm>) {
  const variants: Record<Platform, string[]> = {
    Instagram: [hook, `${hook} Salvalo prima di improvvisare.`],
    TikTok: [hook, `${hook} Guardalo prima di ripartire da zero.`],
    Facebook: [hook, `${hook} Parliamone con onestÃ .`],
    "YouTube Shorts": [hook, `${hook} In pochi secondi si capisce il perchÃ©.`],
    LinkedIn: [hook, `${hook} Ãˆ una questione di metodo, non di rumore.`]
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
    .replace(/^[-â€“â€”:;,.!?]+|[-â€“â€”:;,.!?]+$/g, "");
}

function matchesDomainTerm(text: string, term: string) {
  const normalizedTerm = term.toLowerCase().trim();
  if (!normalizedTerm) return false;

  if (normalizedTerm.includes(" ") || normalizedTerm.includes("&")) {
    return text.includes(normalizedTerm);
  }

  if (normalizedTerm.length <= 4) {
    return new RegExp(`(^|\\W)${escapeRegExp(normalizedTerm)}($|\\W)`, "iu").test(text);
  }

  return new RegExp(`(^|\\W)${escapeRegExp(normalizedTerm)}`, "iu").test(text);
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function chooseVariant(options: string[], seed: string | number) {
  const numericSeed = typeof seed === "number"
    ? seed
    : seed.split("").reduce((total, char) => total + char.charCodeAt(0), 0);

  return options[Math.abs(numericSeed) % options.length];
}

function buildDailyScene(category: NicheCategory, platform: Platform) {
  const variants: Record<NicheCategory, string[]> = {
    wellness: ["Ogni lunedÃ¬ riparti convinto, poi bastano tre giorni complicati per perdere il filo."],
    beauty: ["Ti guardi allo specchio e capisci che non vuoi stravolgere tutto: vuoi solo vederti piÃ¹ curato."],
    localFood: ["Qualcuno vede una foto, ma non sente ancora il profumo, l'atmosfera o il motivo per prenotare."],
    localService: ["Hai un bisogno pratico da risolvere, ma vuoi farlo senza perdere tempo tra attese e complicazioni."],
    realEstate: ["Una casa puÃ² essere valida, ma se viene raccontata male sembra solo un annuncio come tanti."],
    knowledge: ["Apri il foglio delle idee, sai di avere valore da condividere, ma non sai da quale messaggio partire."],
    publishing: ["Hai un'idea creativa, ma tra nicchia, pagine e file finale rischi di bloccarti prima della pubblicazione."],
    finance: ["Sai che dovresti mettere ordine nei conti, ma ogni decisione sembra piÃ¹ grande quando non esiste un piano."],
    fashion: ["Apri l'armadio e trovi tanti capi, ma pochi raccontano davvero qualcosa di tuo."],
    photography: ["Il giorno passa in fretta: quello che resta deve sembrare vero, non costruito."],
    literature: ["Leggi la prima riga e capisci subito se il racconto ti porterÃ  dentro la storia o ti lascerÃ  fuori."],
    hospitality: ["Scorri le foto di una casa vacanze e in pochi secondi decidi se riesci giÃ  a immaginare il soggiorno."],
    digitalProduct: ["Hai un'idea digitale, ma senza un percorso chiaro resta un file fermo invece di diventare un asset vendibile."],
    neutral: ["Sai che la proposta Ã¨ valida, ma quando devi raccontarla diventa tutto piÃ¹ freddo e meno chiaro."]
  };

  const scene = chooseVariant(variants[category], platform);
  return platform === "LinkedIn" ? `${scene} Questo Ã¨ il punto in cui serve piÃ¹ metodo.` : scene;
}

function buildContrastHook(category: NicheCategory) {
  const variants: Record<NicheCategory, string[]> = {
    wellness: ["Piccoli passi fatti bene battono mille partenze drastiche lasciate a metÃ ."],
    beauty: ["Non serve inseguire il cambiamento piÃ¹ evidente: spesso vince il risultato piÃ¹ armonioso."],
    localFood: ["Un buon prodotto fa assaggiare. Un buon contenuto fa venire voglia di esserci."],
    localService: ["Non vince chi promette tutto. Vince chi rende semplice risolvere un problema concreto."],
    realEstate: ["Non vince l'annuncio con piÃ¹ dettagli. Vince quello che rende la scelta piÃ¹ chiara."],
    knowledge: ["Non conquista chi spiega di piÃ¹. Conquista chi rende semplice capire il valore."],
    publishing: ["Non vince l'idea piÃ¹ creativa. Vince quella trasformata in un file chiaro, coerente e pubblicabile."],
    finance: ["Non serve parlare difficile. Serve rendere comprensibile la prossima decisione familiare."],
    fashion: ["Non vince il capo piÃ¹ strano. Vince quello che sembra davvero tuo."],
    photography: ["Non vince la posa perfetta. Vince il ricordo che sembra ancora vivo."],
    literature: ["Non vince la frase piÃ¹ elegante. Vince quella che fa restare il lettore nella storia."],
    hospitality: ["Non vince l'alloggio con piÃ¹ foto. Vince quello che fa immaginare il soggiorno migliore."],
    digitalProduct: ["Non vince il file piÃ¹ pieno. Vince il prodotto digitale che porta a un passo concreto."],
    neutral: ["Non serve dire tutto. Serve dire la cosa giusta nel momento giusto."]
  };

  return chooseVariant(variants[category], category);
}

function avoidMechanicalPhrasing(text: string, d: ReturnType<typeof normalizeForm>, index: number) {
  const domainText = replaceVagueProductLanguage(d.isMarketingContext ? text : sanitizeNonMarketingTerms(text, d), d);
  const fallback = [
    "Il punto non Ã¨ aggiungere altro rumore. Ãˆ rendere piÃ¹ chiaro il prossimo passo.",
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
    "puÃ² diventare",
    "capisce meglio",
    "non percepisce",
    "nel tuo caso il pubblico",
    "con tono",
    "se l'obiettivo"
  ];
  const lower = domainText.toLowerCase();
  const repeatsRawInput = rawInputs.some((input) => countOccurrences(lower, input.toLowerCase()) > 2);
  const hasMechanicalPattern = mechanicalPatterns.some((pattern) => lower.includes(pattern));
  const tooLongSentence = domainText.split(/[.!?]/).some((sentence) => sentence.trim().split(" ").length > 58);
  const cleaned = polishSentence(domainText);

  if (hasMechanicalPattern || repeatsRawInput || tooLongSentence) {
    return ensureSpecificToBusiness(chooseVariant(fallback, seedFrom(d) + index), d, index);
  }

  return ensureSpecificToBusiness(cleaned, d, index);
}

function replaceVagueProductLanguage(text: string, d: ReturnType<typeof normalizeForm>) {
  return text
    .replace(/la tua proposta/gi, d.productPhrase)
    .replace(/il tuo messaggio/gi, `il modo in cui racconti ${d.sectorWords[0]} e ${d.sectorWords[1]}`)
    .replace(/la tua soluzione/gi, d.naturalOffer)
    .replace(/il tuo contenuto/gi, `il testo su ${d.sectorWords[0]} e ${d.sectorWords[1]}`)
    .replace(/il tuo pubblico/gi, d.audiencePhrase)
    .replace(/valore reale/gi, `valore concreto di ${d.sectorWords[0]} e ${d.sectorWords[1]}`);
}

function ensureSpecificToBusiness(text: string, d: ReturnType<typeof normalizeForm>, index: number) {
  void d;
  void index;

  return text;
}

function sanitizeNonMarketingTerms(text: string, d: ReturnType<typeof normalizeForm>) {
  const replacements: Array<[RegExp, string]> = [
    [/ti mancano idee/gi, "non trovi ancora la soluzione giusta"],
    [/non sai cosa pubblicare/gi, "non sai come raccontare il valore reale"],
    [/contenuti improvvisati/gi, "scelte raccontate in modo poco convincente"],
    [/struttura dei contenuti/gi, "percorso di scelta piÃ¹ chiaro"],
    [/messaggio chiaro/gi, "valore percepibile"],
    [/algoritmo/gi, "attenzione delle persone"],
    [/content creation/gi, "comunicazione del valore"],
    [/pubblicare di piÃ¹/gi, "mostrare meglio ciÃ² che rende speciale la proposta"],
    [/\breel\b/gi, "video breve"],
    [/\bcaption\b/gi, "testo di accompagnamento"],
    [/\bformato\b/gi, "modo di presentarlo"]
  ];

  return replacements.reduce((current, [pattern, replacement]) => current.replace(pattern, replacement), text)
    .replace(/creare contenuti/gi, `raccontare ${d.productPhrase}`)
    .replace(/struttura dei post/gi, `presentazione di ${d.concreteDetail}`);
}

function polishSentence(value: string) {
  return value
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").replace(/\s+([,.!?;:])/g, "$1").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\s+([,.!?;:])/g, "$1")
    .replace(/([.!?])(\p{Lu})/gu, "$1 $2")
    .trim();
}

function countOccurrences(text: string, search: string) {
  if (!search) return 0;
  return text.split(search).length - 1;
}

function expandedHookLibrary(d: ReturnType<typeof normalizeForm>) {
  const openers = [
    "Il problema non Ã¨ il tempo: Ã¨ decidere cosa fare quando tutto sembra urgente.",
    "Prima di cercare una soluzione nuova, guarda il passaggio che continui a saltare.",
    "Se riparti sempre da capo, forse il piano Ã¨ troppo fragile.",
    "La chiarezza arriva quando smetti di voler dire tutto insieme.",
    "Le persone non si fidano perchÃ© capiscono tutto: si fidano quando capiscono il prossimo passo.",
    "Un piccolo errore ripetuto ogni giorno puÃ² pesare piÃ¹ di una grande decisione sbagliata.",
    "Non serve aggiungere pressione. Serve togliere attrito.",
    "La domanda giusta non Ã¨ cosa pubblicare, ma cosa deve capire chi ti ascolta.",
    "Il primo segnale di confusione Ã¨ voler cambiare tutto subito.",
    "Quello che sembra mancanza di motivazione spesso Ã¨ mancanza di struttura."
  ];
  const contexts = [
    d.strategy.dailyScene,
    d.strategy.contrastHook,
    "Prima viene l'identificazione. Poi arriva la proposta.",
    "Un contenuto forte non spinge: rende evidente una scelta.",
    "La parte piÃ¹ importante Ã¨ il momento in cui la persona si riconosce."
  ];

  return Array.from({ length: 150 }, (_, index) => {
    const opener = openers[index % openers.length];
    const context = contexts[Math.floor(index / openers.length) % contexts.length];
    return index % 3 === 0 ? opener : `${opener} ${context}`;
  });
}

function expandedCtaLibrary(d: ReturnType<typeof normalizeForm>) {
  const verbs = [
    "Salva questa traccia",
    "Scrivimi una parola chiave",
    "Prova questa struttura",
    "Commenta con il dubbio principale",
    "Usala come base per il prossimo contenuto",
    "Condividila con chi deve fare chiarezza",
    "Parti da questo schema",
    "Adattala al tuo brand",
    "Trasformala in un reel breve",
    "Rileggila prima di pubblicare"
  ];
  const endings = [
    "e rendi piÃ¹ semplice il prossimo passo.",
    "per evitare di ripartire sempre da zero.",
    "se vuoi una comunicazione piÃ¹ chiara e meno improvvisata.",
    "prima di presentare la tua proposta.",
    "e personalizzala con esempi reali.",
    "quando vuoi creare contenuti piÃ¹ ordinati.",
    "senza promettere risultati automatici.",
    "per costruire fiducia prima della vendita.",
    `con un linguaggio adatto a ${d.platform}.`,
    "e scegli una sola azione finale."
  ];

  return Array.from({ length: 150 }, (_, index) => `${verbs[index % verbs.length]} ${endings[Math.floor(index / verbs.length) % endings.length]}`);
}

function expandedCaptionAngles() {
  const base = [
    "Storytelling pratico",
    "Problema nascosto",
    "Errore comune",
    "Mito da sfatare",
    "Vendita soft",
    "Educativa operativa",
    "Prima e dopo mentale",
    "Obiezione frequente",
    "Metodo guidato",
    "Confronto tra approcci"
  ];

  return Array.from({ length: 120 }, (_, index) => `${base[index % base.length]} ${Math.floor(index / base.length) + 1}`);
}

function textSimilarity(a: string, b: string) {
  const left = tokenSet(a);
  const right = tokenSet(b);
  const intersection = [...left].filter((token) => right.has(token)).length;
  const union = new Set([...left, ...right]).size || 1;
  return intersection / union;
}

function tokenSet(value: string) {
  return new Set(
    value
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .split(/\s+/)
      .filter((token) => token.length > 3)
  );
}

function lowerFirst(value: string) {
  if (!value) return value;
  return value.charAt(0).toLowerCase() + value.slice(1);
}

function keyword(d: ReturnType<typeof normalizeForm>) {
  const firstWord = d.niche.split(" ")[0] || "contenuti";
  return firstWord.toUpperCase().replace(/[^\p{Lu}]/gu, "");
}

function toneOpener(tone: Tone) {
  const map: Record<Tone, string> = {
    diretto: "Te lo dico in modo diretto.",
    educativo: "Partiamo da un concetto semplice.",
    persuasivo: "Ecco perchÃ© questo conta davvero.",
    amichevole: "Facciamola semplice.",
    professionale: "Guardiamo il punto con metodo.",
    motivazionale: "Se vuoi sbloccare la situazione, parti da qui."
  };

  return map[tone];
}

function capitalize(value: string) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

