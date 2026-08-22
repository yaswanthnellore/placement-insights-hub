import { createFileRoute } from "@tanstack/react-router";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { ExternalLink, Linkedin } from "lucide-react";
import { CompanyLogo } from "@/components/CompanyLogo";
import { FieldRow } from "@/components/FieldRow";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { buildIntelligenceSections, type IntelligenceSection } from "@/data/intelligenceData";
import { useCompanyGuard } from "@/hooks/use-company-guard";
import { asString, isNullish, normalizeCompanyProfile } from "@/lib/companyData";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/company/intelligence")({
  head: () => ({
    meta: [
      { title: "Company Intelligence — SVCE Placement Intelligence Hub" },
      {
        name: "description",
        content:
          "Deep company intelligence for SVCE placements: leadership, financials, culture, tech stack, risks and contact details across 22 research sections.",
      },
      { property: "og:title", content: "Company Intelligence — SVCE Placement Intelligence Hub" },
      {
        property: "og:description",
        content:
          "Deep company intelligence for SVCE placements across 22 research sections.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CompanyIntelligence,
});

const SectionCard = memo(function SectionCard({
  section,
  registerRef,
}: {
  section: IntelligenceSection;
  registerRef: (el: HTMLElement | null) => void;
}) {
  const Icon = section.icon;
  const available = section.fields.filter((f) => !isNullish(f.value)).length;

  return (
    <section
      ref={registerRef}
      id={section.id}
      aria-label={section.title}
      className="scroll-mt-40 rounded-xl border border-border bg-card"
    >
      <div className="flex items-center gap-3 border-b border-border px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-dream/10 text-dream">
          <Icon className="h-4.5 w-4.5" />
        </div>
        <h2 className="font-heading text-base font-semibold text-foreground">
          {section.title}
        </h2>
        <Badge variant="secondary" className="ml-auto text-[11px]">
          {available}/{section.fields.length}
        </Badge>
      </div>
      <dl className="px-5 py-2">
        {section.fields.map((field, i) => (
          <FieldRow key={`${field.key}-${i}`} label={field.label} value={field.value} type={field.type} />
        ))}
      </dl>
    </section>
  );
});

function PageSkeleton() {
  return (
    <div className="mx-auto max-w-5xl space-y-4 px-4 py-6 sm:px-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border bg-card p-5">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="mt-4 h-3 w-full" />
          <Skeleton className="mt-2 h-3 w-2/3" />
        </div>
      ))}
    </div>
  );
}

function CompanyIntelligence() {
  const { seed, ready } = useCompanyGuard();

  const profile = useMemo(
    () => (seed ? normalizeCompanyProfile(seed.full_json, seed.short_json) : undefined),
    [seed],
  );
  const sections = useMemo(() => buildIntelligenceSections(profile), [profile]);

  const [activeIdx, setActiveIdx] = useState(0);
  const isScrollingRef = useRef(false);
  const sectionRefs = useRef<Array<HTMLElement | null>>([]);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // Scroll-spy: highlight the tab of the section currently in view.
  useEffect(() => {
    const onScroll = () => {
      if (isScrollingRef.current) return;
      const offset = 180;
      let current = 0;
      sectionRefs.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top - offset <= 0) current = i;
      });
      setActiveIdx(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [ready]);

  // Auto-center the active tab in the horizontal tab bar.
  useEffect(() => {
    tabRefs.current[activeIdx]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeIdx]);

  const scrollToSection = (idx: number) => {
    isScrollingRef.current = true;
    setActiveIdx(idx);
    sectionRefs.current[idx]?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => {
      isScrollingRef.current = false;
    }, 900);
  };

  if (!ready || !profile) return <PageSkeleton />;

  const websiteUrl = asString(profile.website_url);
  const linkedinUrl = asString(profile.linkedin_url);

  return (
    <div>
      {/* Sticky information bar + tab bar (no hero, no gradients) */}
      <div className="sticky top-14 z-30 border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3 sm:px-6">
          <CompanyLogo
            name={asString(profile.short_name) ?? "Company"}
            logoUrl={asString(profile.logo_url)}
            websiteUrl={websiteUrl}
            className="h-10 w-10 text-base"
          />
          <div className="min-w-0">
            <h1 className="truncate font-heading text-lg font-semibold leading-tight text-foreground">
              {asString(profile.name) ?? "Company"}
            </h1>
            <Badge variant="secondary" className="mt-0.5 text-[11px]">
              {asString(profile.category) ?? "General"}
            </Badge>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {websiteUrl && !isNullish(websiteUrl) && (
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Website</span>
              </a>
            )}
            {linkedinUrl && !isNullish(linkedinUrl) && (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
              >
                <Linkedin className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">LinkedIn</span>
              </a>
            )}
          </div>
        </div>

        {/* 22-tab sticky tab bar */}
        <div className="border-t border-border/60">
          <div
            className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-2 py-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-4"
            role="tablist"
            aria-label="Intelligence sections"
          >
            {sections.map((section, idx) => (
              <button
                key={section.id}
                ref={(el) => {
                  tabRefs.current[idx] = el;
                }}
                type="button"
                role="tab"
                aria-selected={activeIdx === idx}
                onClick={() => scrollToSection(idx)}
                className={cn(
                  "whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                  activeIdx === idx
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="mx-auto max-w-5xl space-y-4 px-4 py-6 sm:px-6">
        {sections.map((section, idx) => (
          <SectionCard
            key={section.id}
            section={section}
            registerRef={(el) => {
              sectionRefs.current[idx] = el;
            }}
          />
        ))}
      </div>
    </div>
  );
}
