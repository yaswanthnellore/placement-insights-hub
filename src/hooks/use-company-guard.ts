/**
 * Route guard for /company/* pages (no auth involved — this portal is public).
 *
 * Restores the selected company from localStorage + SEED_COMPANIES via
 * CompanyContext, so both pages survive a browser refresh. If no company is
 * selected at all, the visitor is sent back to "/" to pick one.
 */

import { useEffect, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useCompany } from "@/context/CompanyContext";
import { SEED_COMPANIES, type SeedCompany } from "@/data/seedCompanies";

export function useCompanyGuard(): {
  seed: SeedCompany | undefined;
  ready: boolean;
} {
  const { company, hydrated } = useCompany();
  const navigate = useNavigate();

  const seed = useMemo(
    () =>
      company
        ? SEED_COMPANIES.find((c) => c.company_id === company.companyId)
        : undefined,
    [company],
  );

  useEffect(() => {
    if (hydrated && !seed) {
      void navigate({ to: "/" });
    }
  }, [hydrated, seed, navigate]);

  return { seed, ready: hydrated && Boolean(seed) };
}
