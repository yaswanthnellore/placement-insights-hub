/**
 * CompanyLogo — recruiting-company logos only (never a college logo).
 * Priority: Logo.dev (when VITE_LOGO_DEV_PUBLISHABLE_KEY is set) →
 * seed/DB logo_url → initial-letter circle.
 */

import { useState } from "react";
import { cn } from "@/lib/utils";

interface CompanyLogoProps {
  name: string;
  logoUrl?: string | null;
  websiteUrl?: string | null;
  className?: string;
  imgClassName?: string;
}

function domainFrom(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

export function CompanyLogo({
  name,
  logoUrl,
  websiteUrl,
  className,
  imgClassName,
}: CompanyLogoProps) {
  const [failed, setFailed] = useState(false);

  const token = import.meta.env["VITE_LOGO_DEV_PUBLISHABLE_KEY"] as string | undefined;
  const domain = domainFrom(websiteUrl);
  const src =
    token && domain
      ? `https://img.logo.dev/${domain}?token=${token}&size=128&format=png`
      : logoUrl && !/^na$/i.test(logoUrl)
        ? logoUrl
        : null;

  if (!src || failed) {
    return (
      <div
        aria-label={`${name} logo`}
        className={cn(
          "flex items-center justify-center rounded-lg bg-primary font-heading font-semibold text-primary-foreground",
          className,
        )}
      >
        {name.trim().charAt(0).toUpperCase() || "?"}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center overflow-hidden rounded-lg border border-border bg-card p-1.5", className)}>
      <img
        src={src}
        alt={`${name} logo`}
        loading="lazy"
        onError={() => setFailed(true)}
        className={cn("h-full w-full object-contain", imgClassName)}
      />
    </div>
  );
}
