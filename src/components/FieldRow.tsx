/**
 * FieldRow + renderValue — shared value renderers for intelligence sections.
 * Handles url | video | rating | list | paragraph, plus auto pill detection
 * on ";" and "," separated values. Nullish values collapse to a
 * "Not Available" pill.
 */

import { ExternalLink, PlayCircle, Star } from "lucide-react";
import { asString, isNullish, splitItems } from "@/lib/companyData";
import { cn } from "@/lib/utils";

function NotAvailablePill() {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-0.5 text-[11px] font-medium italic text-muted-foreground">
      Not Available
    </span>
  );
}

function PillList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item, i) => (
        <span
          key={`${item}-${i}`}
          className="inline-flex items-center rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function UrlValue({ href, label }: { href: string; label?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 break-all text-sm font-medium text-dream hover:underline"
    >
      {label ?? href.replace(/^https?:\/\//, "")}
      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
    </a>
  );
}

function RatingValue({ value }: { value: string }) {
  const match = value.match(/([\d.]+)\s*\/\s*(\d+)/);
  const score = match ? Number(match[1]) : null;
  const max = match ? Number(match[2]) : null;
  const pct = score != null && max ? Math.min(score / max, 1) : null;
  return (
    <span className="inline-flex items-center gap-2">
      <Star className="h-4 w-4 fill-bloom-as text-bloom-as" />
      <span className="text-sm font-medium text-foreground">{value}</span>
      {pct != null && (
        <span className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
          <span
            className="block h-full rounded-full bg-bloom-as"
            style={{ width: `${pct * 100}%` }}
          />
        </span>
      )}
    </span>
  );
}

export function renderValue(value: unknown, type?: string) {
  if (isNullish(value)) return <NotAvailablePill />;
  const str = asString(value);
  if (!str) return <NotAvailablePill />;

  switch (type) {
    case "url":
      return str.startsWith("http") ? (
        <UrlValue href={str} />
      ) : (
        <span className="text-sm text-foreground">{str}</span>
      );
    case "video":
      return str.startsWith("http") ? (
        <a
          href={str}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-dream hover:underline"
        >
          <PlayCircle className="h-4 w-4" />
          Watch video
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      ) : (
        <span className="text-sm text-foreground">{str}</span>
      );
    case "rating":
      return <RatingValue value={str} />;
    case "list": {
      const items = splitItems(str);
      return items.length > 1 ? (
        <PillList items={items} />
      ) : (
        <span className="text-sm text-foreground">{str}</span>
      );
    }
    case "paragraph":
      return <p className="text-sm leading-relaxed text-foreground">{str}</p>;
    default: {
      // Auto-detect: delimited values render as pills.
      if (str.includes(";")) {
        const items = splitItems(str);
        if (items.length > 1) return <PillList items={items} />;
      }
      if (str.startsWith("http")) return <UrlValue href={str} />;
      return <span className="text-sm text-foreground">{str}</span>;
    }
  }
}

interface FieldRowProps {
  label: string;
  value: unknown;
  type?: string | undefined;
}

export function FieldRow({ label, value, type }: FieldRowProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 border-b border-border/60 py-3 last:border-b-0 sm:flex-row sm:gap-4",
      )}
    >
      <dt className="shrink-0 text-xs font-medium uppercase tracking-wide text-muted-foreground sm:w-1/3 sm:pt-0.5">
        {label}
      </dt>
      <dd className="sm:w-2/3">{renderValue(value, type)}</dd>
    </div>
  );
}
