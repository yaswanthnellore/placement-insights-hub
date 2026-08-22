/**
 * CompanyCard — memoized, hoisted outside any page component.
 * Click: persists "selected-company" to localStorage, updates CompanyContext,
 * and navigates to /company/intelligence (survives refresh).
 */

import { memo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, MapPin, TrendingDown, TrendingUp, Users } from "lucide-react";
import { motion } from "framer-motion";
import { CompanyLogo } from "@/components/CompanyLogo";
import { useCompany } from "@/context/CompanyContext";
import { isNullish, type CompanySummary, type CompanyType } from "@/lib/companyData";
import { cn } from "@/lib/utils";

export const COMPANY_TYPE_STYLES: Record<CompanyType, string> = {
  "Super Dream": "bg-super-dream/10 text-super-dream border-super-dream/25",
  Dream: "bg-dream/10 text-dream border-dream/25",
  Standard: "bg-standard/10 text-standard border-standard/25",
  Regular: "bg-regular/10 text-regular border-regular/25",
};

function OrNA({ value, italic = true }: { value: string | null; italic?: boolean }) {
  if (isNullish(value)) {
    return <span className={cn("text-muted-foreground/80", italic && "italic")}>not publicly available</span>;
  }
  return <>{value}</>;
}

interface CompanyCardProps {
  company: CompanySummary;
  index?: number;
}

export const CompanyCard = memo(function CompanyCard({ company, index = 0 }: CompanyCardProps) {
  const navigate = useNavigate();
  const { selectCompany } = useCompany();

  const negativeGrowth = (company.yoyGrowthRate ?? "").trim().startsWith("-");

  const handleClick = () => {
    selectCompany({
      companyId: company.companyId,
      companyName: company.name,
      logoUrl: company.logoUrl,
    });
    navigate({ to: "/company/intelligence" });
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.4) }}
      className="group relative flex w-full flex-col rounded-xl border border-border bg-card p-5 text-left transition-all hover:-translate-y-0.5 hover:border-dream/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex items-start justify-between gap-3">
        <CompanyLogo
          name={company.shortName}
          logoUrl={company.logoUrl}
          websiteUrl={company.websiteUrl}
          className="h-12 w-12 text-lg"
        />
        <span
          className={cn(
            "rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
            COMPANY_TYPE_STYLES[company.companyType],
          )}
        >
          {company.companyType}
        </span>
      </div>

      <div className="mt-4">
        <h3 className="font-heading text-base font-semibold leading-tight text-foreground group-hover:text-dream">
          {company.name}
        </h3>
        <p className="mt-0.5 text-xs text-muted-foreground">{company.shortName}</p>
      </div>

      <div className="mt-4 flex flex-col gap-1.5 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <OrNA value={company.headquartersAddress} />
        </span>
        <span className="flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5 shrink-0" />
          <OrNA value={company.employeeSize} />
        </span>
        <span
          className={cn(
            "flex items-center gap-1.5",
            !isNullish(company.yoyGrowthRate) &&
              (negativeGrowth ? "text-destructive" : "text-standard"),
          )}
        >
          {negativeGrowth ? (
            <TrendingDown className="h-3.5 w-3.5 shrink-0" />
          ) : (
            <TrendingUp className="h-3.5 w-3.5 shrink-0" />
          )}
          <OrNA value={company.yoyGrowthRate} italic={false} />
        </span>
      </div>

      <ArrowRight className="absolute bottom-4 right-4 h-4 w-4 text-muted-foreground/50 transition-all group-hover:translate-x-0.5 group-hover:text-dream" />
    </motion.button>
  );
});
