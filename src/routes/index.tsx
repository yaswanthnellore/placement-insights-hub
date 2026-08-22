import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, SearchX, X } from "lucide-react";
import { CompanyCard } from "@/components/CompanyCard";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { SEED_COMPANIES } from "@/data/seedCompanies";
import {
  COMPANY_TYPES,
  normalizeCompanySummary,
  type CompanyType,
} from "@/lib/companyData";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SVCE Companies Research & Placement Analytics Portal" },
      {
        name: "description",
        content:
          "SRI VENKATESWARA COLLEGE OF ENGINEERING placement intelligence hub — research recruiting companies, hiring skills and preparation roadmaps.",
      },
      { property: "og:title", content: "SVCE Companies Research & Placement Analytics Portal" },
      {
        property: "og:description",
        content:
          "Research recruiting companies, hiring skills and preparation roadmaps — your strategic edge for campus placements at SVCE.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Filter = "All" | CompanyType;

const PILL_STYLES: Record<Filter, string> = {
  All: "border-primary/30 bg-primary text-primary-foreground",
  "Super Dream": "border-super-dream/40 bg-super-dream text-white",
  Dream: "border-dream/40 bg-dream text-white",
  Standard: "border-standard/40 bg-standard text-white",
  Regular: "border-regular/40 bg-regular text-white",
};

const PILL_DOT: Record<Filter, string> = {
  All: "bg-primary",
  "Super Dream": "bg-super-dream",
  Dream: "bg-dream",
  Standard: "bg-standard",
  Regular: "bg-regular",
};

function Index() {
  const companies = useMemo(
    () => SEED_COMPANIES.map((c) => normalizeCompanySummary(c.short_json, c.company_id)),
    [],
  );

  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  // 200ms search debounce
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim().toLowerCase()), 200);
    return () => clearTimeout(t);
  }, [query]);

  const counts = useMemo(() => {
    const result: Record<Filter, number> = {
      All: companies.length,
      "Super Dream": 0,
      Dream: 0,
      Standard: 0,
      Regular: 0,
    };
    for (const c of companies) result[c.companyType] += 1;
    return result;
  }, [companies]);

  const visible = useMemo(
    () =>
      companies.filter((c) => {
        if (filter !== "All" && c.companyType !== filter) return false;
        if (!debouncedQuery) return true;
        const haystack = [c.name, c.shortName, c.category, c.headquartersAddress ?? ""]
          .join(" ")
          .toLowerCase();
        return haystack.includes(debouncedQuery);
      }),
    [companies, filter, debouncedQuery],
  );

  const reset = () => {
    setQuery("");
    setDebouncedQuery("");
    setFilter("All");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero — white, bottom border, text only (no college logo asset) */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-14 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full border border-dream/30 bg-dream/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-dream">
                SVCE · Intelligence Platform
              </span>
              <span className="inline-flex items-center rounded-full bg-destructive px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-destructive-foreground animate-glow">
                New
              </span>
            </div>
            <h1 className="mt-4 font-heading text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              SRI VENKATESWARA COLLEGE OF ENGINEERING Companies Research &amp; Placement
              Analytics Portal
            </h1>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              Your strategic edge for campus placements
            </p>

            {/* Search */}
            <div className="relative mt-6 max-w-xl">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search companies, industries, locations…"
                className="h-11 rounded-xl pl-10 pr-10 shadow-sm"
                aria-label="Search companies"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Filter pills with live counts */}
        <div className="flex flex-wrap items-center gap-2">
          {(["All", ...COMPANY_TYPES] as Filter[]).map((f) => {
            const active = filter === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold transition-all",
                  active
                    ? PILL_STYLES[f]
                    : "border-border bg-card text-muted-foreground hover:border-foreground/20 hover:text-foreground",
                )}
              >
                {!active && <span className={cn("h-2 w-2 rounded-full", PILL_DOT[f])} />}
                {f}
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                    active ? "bg-white/20" : "bg-muted",
                  )}
                >
                  {counts[f]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-start justify-between">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="mt-4 h-4 w-3/4" />
                <Skeleton className="mt-2 h-3 w-1/3" />
                <Skeleton className="mt-4 h-3 w-full" />
                <Skeleton className="mt-2 h-3 w-2/3" />
              </div>
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="mt-16 flex flex-col items-center justify-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <SearchX className="h-6 w-6 text-muted-foreground" />
            </div>
            <h2 className="mt-4 font-heading text-lg font-semibold text-foreground">
              No companies match your search
            </h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Try a different keyword or reset the filters to see every recruiting company.
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-5 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {visible.map((company, i) => (
              <CompanyCard key={company.companyId} company={company} index={i} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
