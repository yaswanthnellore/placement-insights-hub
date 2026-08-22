import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Lock, LockOpen } from "lucide-react";
import { CompanyLogo } from "@/components/CompanyLogo";
import { Skeleton } from "@/components/ui/skeleton";
import { SKILL_TOPICS } from "@/data/skillTopics";
import { useCompanyGuard } from "@/hooks/use-company-guard";
import {
  asString,
  BLOOM_LABELS,
  normalizeCompanyProfile,
  normalizeDashboardSkills,
  type BloomLevel,
  type Criticality,
  type DashboardSkill,
} from "@/lib/companyData";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/company/skills")({
  head: () => ({
    meta: [
      { title: "Skill Intelligence — SVCE Placement Intelligence Hub" },
      {
        name: "description",
        content:
          "Skill requirements, Bloom taxonomy levels and 10-step preparation roadmaps for companies recruiting at SVCE.",
      },
      { property: "og:title", content: "Skill Intelligence — SVCE Placement Intelligence Hub" },
      {
        property: "og:description",
        content:
          "Skill requirements, Bloom taxonomy levels and 10-step preparation roadmaps for companies recruiting at SVCE.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SkillIntelligence,
});

const BLOOM_ORDER: BloomLevel[] = ["CU", "AP", "AS", "EV", "CR"];

const BLOOM_BADGE: Record<BloomLevel, string> = {
  CU: "bg-bloom-cu/10 text-bloom-cu border-bloom-cu/30",
  AP: "bg-bloom-ap/10 text-bloom-ap border-bloom-ap/30",
  AS: "bg-bloom-as/10 text-bloom-as border-bloom-as/30",
  EV: "bg-bloom-ev/10 text-bloom-ev border-bloom-ev/30",
  CR: "bg-bloom-cr/10 text-bloom-cr border-bloom-cr/30",
};

const BLOOM_BAR: Record<BloomLevel, string> = {
  CU: "bg-bloom-cu",
  AP: "bg-bloom-ap",
  AS: "bg-bloom-as",
  EV: "bg-bloom-ev",
  CR: "bg-bloom-cr",
};

const CRITICALITY_STYLE: Record<Criticality, string> = {
  Critical: "bg-destructive/10 text-destructive border-destructive/30",
  Important: "bg-regular/10 text-regular border-regular/30",
  Baseline: "bg-standard/10 text-standard border-standard/30",
};

function SkillCard({ skill, index }: { skill: DashboardSkill; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const roadmap = SKILL_TOPICS[skill.skillSetId] ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.4) }}
      className="rounded-xl border border-border bg-card"
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="flex w-full flex-col gap-3 p-5 text-left"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-heading text-sm font-semibold text-foreground">
              {skill.name}
            </h3>
            <span
              className={cn(
                "mt-1.5 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                CRITICALITY_STYLE[skill.criticality],
              )}
            >
              {skill.criticality}
            </span>
          </div>
          <span
            className={cn(
              "inline-flex shrink-0 items-center rounded-md border px-2 py-1 text-xs font-bold",
              BLOOM_BADGE[skill.bloom],
            )}
          >
            {skill.bloom}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className={cn("h-full rounded-full transition-all", BLOOM_BAR[skill.bloom])}
              style={{ width: `${skill.score * 10}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-foreground">{skill.score}/10</span>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {skill.requiredProficiency} · {roadmap.length}-level roadmap
          </span>
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")}
          />
        </div>
      </button>

      {expanded && (
        <ol className="border-t border-border px-5 py-3">
          {roadmap.map((level) => {
            const locked = level.level_number > skill.score;
            return (
              <li
                key={level.level_number}
                className={cn(
                  "flex items-start gap-3 border-b border-border/50 py-2.5 last:border-b-0",
                  locked && "opacity-60",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                    locked
                      ? "bg-muted text-muted-foreground"
                      : cn("text-white", BLOOM_BAR[skill.bloom]),
                  )}
                >
                  {level.level_number}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-foreground">{level.topic}</p>
                  {locked && (
                    <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Lock className="h-3 w-3" /> Beyond scope
                    </p>
                  )}
                </div>
                {!locked && <LockOpen className="mt-1 h-3.5 w-3.5 shrink-0 text-standard" />}
              </li>
            );
          })}
        </ol>
      )}
    </motion.div>
  );
}

function SkillIntelligence() {
  const { seed, ready } = useCompanyGuard();

  const profile = useMemo(
    () => (seed ? normalizeCompanyProfile(seed.full_json, seed.short_json) : undefined),
    [seed],
  );
  const skills = useMemo(
    () => (seed ? normalizeDashboardSkills(seed.skill_levels) : []),
    [seed],
  );

  if (!ready || !profile) {
    return (
      <div className="mx-auto max-w-6xl space-y-4 px-4 py-6 sm:px-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  const companyName = asString(profile.short_name) ?? asString(profile.name) ?? "Company";

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <CompanyLogo
          name={companyName}
          logoUrl={asString(profile.logo_url)}
          websiteUrl={asString(profile.website_url)}
          className="h-11 w-11 text-base"
        />
        <div>
          <h1 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
            {companyName} Skill Intelligence
          </h1>
          <p className="text-xs text-muted-foreground sm:text-sm">
            What to prepare, to what depth — mapped to Bloom's taxonomy
          </p>
        </div>
      </div>

      {/* Bloom legend */}
      <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-5">
        {BLOOM_ORDER.map((level) => (
          <div
            key={level}
            className={cn("rounded-lg border px-3 py-2.5", BLOOM_BADGE[level])}
          >
            <p className="text-sm font-bold">{level}</p>
            <p className="mt-0.5 text-[10px] font-medium leading-tight opacity-80">
              {BLOOM_LABELS[level]}
            </p>
          </div>
        ))}
      </div>

      {/* Criticality legend */}
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {(
          [
            ["Critical", "Score ≥ 7 — make-or-break for the offer"],
            ["Important", "Score 5–6 — strong differentiator"],
            ["Baseline", "Score < 5 — expected foundations"],
          ] as Array<[Criticality, string]>
        ).map(([label, hint]) => (
          <div
            key={label}
            className={cn("rounded-lg border px-3 py-2.5", CRITICALITY_STYLE[label])}
          >
            <p className="text-sm font-bold">{label}</p>
            <p className="mt-0.5 text-[10px] font-medium opacity-80">{hint}</p>
          </div>
        ))}
      </div>

      {/* Skill cards (sorted by required level, desc) */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {skills.map((skill, i) => (
          <SkillCard key={skill.skillSetId} skill={skill} index={i} />
        ))}
      </div>
    </div>
  );
}
