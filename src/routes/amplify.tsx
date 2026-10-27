import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, CalendarClock, ChartNoAxesCombined, Check, Compass, Handshake, LockKeyhole, ShieldCheck, Sparkles, UsersRound } from "lucide-react";
import { toast } from "sonner";
import { HouseChrome } from "@/components/site/chrome";
import { submitBrief } from "@/lib/house/shop";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/amplify")({ component: AmplifyPage });

type Interest = {
  name: string;
  platform: string;
  publicUrl: string;
  goal: string;
};

const KEY = "fleshsesh-amplify-interest";
const CHANNELS = ["OnlyFans", "Fansly", "Fanvue", "LoyalFans", "Other creator platform", "Agency / manager"];
const GOALS = ["Get discovered", "Schedule marketing", "Buy or sell promotions", "Collaborate with creators", "Manage a roster"];

const CAPABILITIES = [
  { icon: Compass, n: "01", title: "Discover", description: "Opt-in, reviewed creator listings and clean public links. Creators choose what appears, and can pause or withdraw their profile." },
  { icon: CalendarClock, n: "02", title: "Publish", description: "A shared campaign calendar, approved content library and channel-specific workflows. No unsupported auto-posting." },
  { icon: Handshake, n: "03", title: "Collaborate", description: "Structured shout-outs, paid promo bookings and reciprocal campaigns with scope, deadlines and delivery evidence." },
  { icon: ChartNoAxesCombined, n: "04", title: "Measure", description: "Campaign links, aggregate clicks, manual source reconciliation and honest reporting without invented subscriber counts." },
];

const PLANS = [
  { name: "Discover", price: "Free", interval: "", detail: "An intentional starting point.", features: ["One opt-in creator profile", "Listing review and profile controls", "Discover relevant collaborators", "Basic link tracking"], featured: false },
  { name: "Creator", price: "$39", interval: "/month", detail: "A repeatable growth workflow.", features: ["Everything in Discover", "Campaign planning calendar", "Promo and collaboration requests", "Campaign-level reporting"], featured: true },
  { name: "Studio", price: "$89", interval: "/month", detail: "For creators operating at scale.", features: ["Everything in Creator", "Up to three creator profiles", "Team review and approvals", "Exportable performance reports"], featured: false },
  { name: "Agency", price: "$249", interval: "/month", detail: "For authorised management teams.", features: ["Up to ten creator profiles", "Role-based assignments and audit log", "Multi-creator campaign board", "Onboarding and offboarding controls"], featured: false },
];

function AmplifyPage() {
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const [interest, setInterest] = useState<Interest>({ name: "", platform: CHANNELS[0], publicUrl: "", goal: GOALS[0] });
  const [agreed, setAgreed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(KEY);
      if (!stored) return;
      const parsed = JSON.parse(stored) as Partial<Interest>;
      setInterest((prev) => ({
        name: typeof parsed.name === "string" ? parsed.name : prev.name,
        platform: CHANNELS.includes(parsed.platform ?? "") ? parsed.platform! : prev.platform,
        publicUrl: typeof parsed.publicUrl === "string" ? parsed.publicUrl : prev.publicUrl,
        goal: GOALS.includes(parsed.goal ?? "") ? parsed.goal! : prev.goal,
      }));
    } catch {
      /* Optional device-only draft. */
    }
  }, []);

  function patch(field: keyof Interest, value: string) {
    setInterest((prev) => ({ ...prev, [field]: value }));
    setError("");
  }

  async function requestInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (interest.name.trim().length < 2 || !agreed) {
      setError("Please provide a contact name and confirm you are authorised to make this enquiry.");
      return;
    }
    if (interest.publicUrl.trim()) {
      try {
        const url = new URL(interest.publicUrl.trim());
        if (url.protocol !== "https:") throw new Error("HTTPS required");
      } catch {
        setError("Use a full public https:// profile URL, or leave that field empty.");
        return;
      }
    }
    if (!user) {
      sessionStorage.setItem(KEY, JSON.stringify(interest));
      navigate({ to: "/login", search: { redirect: "/amplify" } });
      return;
    }
    setBusy(true);
    setError("");
    try {
      await submitBrief({
        data: {
          kind: "service",
          company: "fleshsesh | amplify - beta enquiry",
          contactName: interest.name.trim(),
          details: [
            "AMPLIFY PRIVATE BETA EXPRESSION OF INTEREST",
            "Platform: " + interest.platform,
            "Goal: " + interest.goal,
            "Public creator URL: " + (interest.publicUrl.trim() || "Not supplied"),
            "Submitter confirms adulthood and account representation authority.",
            "No public listing, paid order or external posting authorised by this enquiry.",
          ].join("\n"),
          payFee: false,
        },
      });
      sessionStorage.removeItem(KEY);
      setSubmitted(true);
      toast.success("Beta enquiry received. No payment collected.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "The enquiry could not be submitted. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <HouseChrome>
      <section className="relative isolate overflow-hidden border-b border-line px-5 pb-20 pt-36 md:px-10 md:pb-28 md:pt-44">
        <div className="pointer-events-none absolute -right-16 -top-24 -z-10 size-[520px] rounded-full bg-heat/10 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-48 -left-20 -z-10 size-[420px] rounded-full bg-[#6348a5]/25 blur-3xl" aria-hidden="true" />
        <div className="mx-auto max-w-7xl">
          <p className="font-display text-xs uppercase tracking-[0.3em] text-heat">fleshsesh / growth services / private beta</p>
          <div className="mt-9 grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(300px,0.6fr)] lg:items-end">
            <div>
              <h1 className="font-display text-[clamp(4rem,12vw,10rem)] uppercase leading-[0.86] tracking-tight">Go further.<br /><span className="text-heat">Stay yours.</span></h1>
              <p className="mt-10 max-w-2xl text-base leading-relaxed text-ivory/80 md:text-lg">Introducing <strong className="text-ivory">amplify</strong>. A new growth desk for independent adult creators and authorised agencies. Be discovered, plan campaigns, find collaborators and see what your promotion actually delivered.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#beta" className="inline-flex min-h-12 items-center gap-3 bg-heat px-6 py-3 font-display text-xs uppercase tracking-widest text-navy transition-colors hover:bg-ivory">Request a beta invite <ArrowRight size={17} aria-hidden="true" /></a>
                <a href="#platform" className="inline-flex min-h-12 items-center gap-3 border border-line px-6 py-3 font-display text-xs uppercase tracking-widest hover:border-heat hover:text-heat">Explore the concept</a>
              </div>
            </div>
            <aside className="border border-line bg-navy/70 p-7 backdrop-blur-md">
              <p className="font-display text-xs uppercase tracking-widest text-heat">Build status</p>
              <p className="mt-4 font-display text-3xl uppercase tracking-wide">Invitation-only pilot</p>
              <p className="mt-4 text-sm leading-relaxed text-muted">The beta enquiry is operational through the existing fleshsesh member desk. Directory publication, social connections, subscriptions and payments are <strong className="text-ivory">not yet enabled</strong>.</p>
              <div className="mt-7 flex items-center gap-3 border-t border-line pt-5 text-xs text-ivory/80"><ShieldCheck size={20} className="shrink-0 text-heat" /><span>No public profile without review and creator permission.</span></div>
            </aside>
          </div>
        </div>
      </section>

      <section id="platform" className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
        <div className="grid gap-5 md:grid-cols-[0.8fr_1.2fr] md:items-end">
          <div><p className="font-display text-xs uppercase tracking-[0.3em] text-heat">The platform</p><h2 className="mt-3 font-display text-5xl uppercase tracking-tight md:text-7xl">Four moving parts.<br />One desk.</h2></div>
          <p className="max-w-xl text-sm leading-relaxed text-muted md:justify-self-end md:text-base">Growth tools are usually scattered across directories, scheduling apps, private groups and spreadsheets. Amplify is being designed to make the business of promotion simpler, safer and measurable.</p>
        </div>
        <div className="mt-12 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2 xl:grid-cols-4">
          {CAPABILITIES.map((item) => { const Icon = item.icon; return <article key={item.title} className="bg-void p-7 md:p-8"><div className="flex items-center justify-between text-heat"><Icon size={29} strokeWidth={1.4} aria-hidden="true" /><span className="font-display text-xs tracking-widest">{item.n}</span></div><h3 className="mt-10 font-display text-3xl uppercase tracking-wide">{item.title}</h3><p className="mt-4 text-sm leading-relaxed text-muted">{item.description}</p></article>; })}
        </div>
      </section>

      <section className="border-y border-line bg-navy/45 px-5 py-20 md:px-10 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div><p className="font-display text-xs uppercase tracking-[0.3em] text-heat">Built for actual working creators</p><h2 className="mt-4 font-display text-5xl uppercase tracking-tight md:text-6xl">Your accounts.<br />Your rules.</h2></div>
          <div className="grid gap-7 sm:grid-cols-2">
            {[
              { icon: LockKeyhole, label: "Delegation, not passwords", detail: "Staff permissions remain scoped, revocable and logged wherever an official connection permits." },
              { icon: UsersRound, label: "Creators decide", detail: "Creators explicitly approve listings, collaboration partners, public assets and any publication." },
              { icon: ShieldCheck, label: "No manufactured results", detail: "Verified delivery evidence and traceable clicks, never fabricated followers or guaranteed income." },
              { icon: Sparkles, label: "No platform-rule shortcuts", detail: "Drafts and reminders when publishing APIs are unavailable; no scraping or stealth automation." },
            ].map((item) => { const Icon = item.icon; return <div key={item.label} className="border-t border-line pt-5"><Icon size={23} className="text-heat" aria-hidden="true" /><h3 className="mt-4 font-display text-xl uppercase tracking-wide">{item.label}</h3><p className="mt-3 text-sm leading-relaxed text-muted">{item.detail}</p></div>; })}
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6"><div><p className="font-display text-xs uppercase tracking-[0.3em] text-heat">Pricing concept</p><h2 className="mt-3 font-display text-5xl uppercase tracking-tight md:text-7xl">Room to grow.</h2></div><p className="max-w-md text-sm leading-relaxed text-muted">Indicative introductory prices in AUD. These plans are proposals, not live subscriptions or promises of feature availability. Placement spend and payment fees are separate.</p></div>
        <div className="mt-12 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {PLANS.map((plan) => <article key={plan.name} className={"flex flex-col border p-6 md:p-7 " + (plan.featured ? "border-heat bg-navy" : "border-line bg-void")}><div className="flex min-h-6 items-center justify-between gap-2"><h3 className="font-display text-2xl uppercase tracking-wide">{plan.name}</h3>{plan.featured ? <span className="font-display text-[10px] uppercase tracking-widest text-heat">Suggested</span> : null}</div><p className="mt-7 font-display text-5xl tabular-nums">{plan.price}<span className="ml-1 font-sans text-xs text-muted">{plan.interval}</span></p><p className="mt-4 min-h-12 text-sm text-muted">{plan.detail}</p><ul className="mt-7 grow space-y-4 border-t border-line pt-6">{plan.features.map((feature) => <li key={feature} className="flex gap-3 text-sm leading-relaxed"><Check size={17} className="mt-0.5 shrink-0 text-heat" aria-hidden="true" /><span>{feature}</span></li>)}</ul><a href="#beta" className={"mt-8 flex min-h-12 items-center justify-center font-display text-xs uppercase tracking-widest " + (plan.featured ? "bg-heat text-navy hover:bg-ivory" : "border border-line hover:border-heat hover:text-heat")}>Join the beta list</a></article>)}
        </div>
        <p className="mt-5 text-xs leading-relaxed text-muted">Later-stage commercial proposal: 10% marketplace service fee on completed paid promotions, subject to adult-sector payment processing, legal review, dispute handling and transparent seller terms. No checkout is active.</p>
      </section>

      <section id="beta" className="border-t border-line bg-navy/70 px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div><p className="font-display text-xs uppercase tracking-[0.3em] text-heat">Private beta / expression of interest</p><h2 className="mt-4 font-display text-5xl uppercase tracking-tight md:text-7xl">Put your name<br />on the list.</h2><p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">We are testing demand with creators and agencies before activating external integrations or publishing listings. Sending this request does not enrol you in a paid service, authorise a public listing, or grant any agency representation rights.</p><Link to="/os" className="mt-7 inline-flex items-center gap-2 text-sm text-heat hover:text-ivory">Explore the existing Creator OS <ArrowRight size={16} aria-hidden="true" /></Link></div>
          <div className="border border-line bg-void p-6 md:p-9">
            {submitted ? <div role="status" className="py-10"><ShieldCheck size={35} className="text-heat" aria-hidden="true" /><h3 className="mt-5 font-display text-3xl uppercase">Request received.</h3><p className="mt-4 text-sm leading-relaxed text-muted">Your enquiry is in your member desk. No charge was made, and no listing was published.</p><Link to="/desk" className="mt-6 inline-flex min-h-12 items-center gap-2 border border-heat px-6 font-display text-xs uppercase tracking-widest text-heat">Open your desk <ArrowRight size={15} /></Link></div> : <form onSubmit={requestInvite} className="space-y-5"><h3 className="font-display text-2xl uppercase tracking-wide">Request beta access</h3><label className="block text-sm text-ivory/85">Contact name<input autoComplete="name" maxLength={80} required minLength={2} value={interest.name} onChange={(e) => patch("name", e.target.value)} className="mt-2 min-h-12 w-full border border-line bg-navy px-3 focus:border-heat focus:outline-none" /></label><label className="block text-sm text-ivory/85">Primary platform<select value={interest.platform} onChange={(e) => patch("platform", e.target.value)} className="mt-2 min-h-12 w-full border border-line bg-navy px-3 focus:border-heat focus:outline-none">{CHANNELS.map((x) => <option key={x} value={x}>{x}</option>)}</select></label><label className="block text-sm text-ivory/85">Public creator profile (optional)<input type="url" placeholder="https://..." value={interest.publicUrl} onChange={(e) => patch("publicUrl", e.target.value)} maxLength={300} className="mt-2 min-h-12 w-full border border-line bg-navy px-3 focus:border-heat focus:outline-none" /><span className="mt-1 block text-xs text-muted">Public URL only. Do not send private media, passwords or identity documents.</span></label><label className="block text-sm text-ivory/85">Most important goal<select value={interest.goal} onChange={(e) => patch("goal", e.target.value)} className="mt-2 min-h-12 w-full border border-line bg-navy px-3 focus:border-heat focus:outline-none">{GOALS.map((x) => <option key={x} value={x}>{x}</option>)}</select></label><label className="flex items-start gap-3 text-xs leading-relaxed text-muted"><input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1 size-4 shrink-0 accent-heat" required /><span>I am 18 or older and am the creator or an authorised representative. I understand this is an enquiry only, with no automatic publication or payment.</span></label>{error ? <p role="alert" className="border-l-2 border-heat pl-3 text-sm text-ivory">{error}</p> : null}<button type="submit" disabled={busy || isPending} className="flex min-h-12 w-full items-center justify-center gap-2 bg-heat px-6 font-display text-xs uppercase tracking-widest text-navy hover:bg-ivory disabled:cursor-not-allowed disabled:opacity-50">{busy ? "Sending enquiry..." : user ? "Submit free enquiry" : "Sign in and continue"} <ArrowRight size={15} aria-hidden="true" /></button><p className="text-xs leading-relaxed text-muted">Secure account sign-in is required to file a request; a draft is temporarily kept on this device while you sign in.</p></form>}
          </div>
        </div>
      </section>
    </HouseChrome>
  );
}
