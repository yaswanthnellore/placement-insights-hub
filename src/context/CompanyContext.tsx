/**
 * CompanyContext — holds the visitor's selected company.
 *
 * Persisted to localStorage under "selected-company" as:
 *   { companyId, companyName, logoUrl }
 * On startup the provider reads that key, matches it against SEED_COMPANIES,
 * and restores the selection — so /company/* routes survive a refresh.
 * No authentication anywhere in this portal.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { SEED_COMPANIES } from "@/data/seedCompanies";

export const SELECTED_COMPANY_KEY = "selected-company";

export interface SelectedCompany {
  companyId: number;
  companyName: string;
  logoUrl: string | null;
}

interface CompanyContextValue {
  company: SelectedCompany | null;
  /** False until the localStorage restore has run (client mount). */
  hydrated: boolean;
  selectCompany: (company: SelectedCompany) => void;
  clearCompany: () => void;
}

const CompanyContext = createContext<CompanyContextValue | null>(null);

function readStoredCompany(): SelectedCompany | null {
  try {
    const raw = window.localStorage.getItem(SELECTED_COMPANY_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SelectedCompany>;
    if (typeof parsed.companyId !== "number" || !parsed.companyName) return null;
    // Only restore if the company still exists in the data source.
    const match = SEED_COMPANIES.find((c) => c.company_id === parsed.companyId);
    if (!match) return null;
    return {
      companyId: parsed.companyId,
      companyName: parsed.companyName,
      logoUrl: typeof parsed.logoUrl === "string" ? parsed.logoUrl : null,
    };
  } catch {
    return null;
  }
}

export function CompanyProvider({ children }: { children: ReactNode }) {
  const [company, setCompany] = useState<SelectedCompany | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCompany(readStoredCompany());
    setHydrated(true);
  }, []);

  const selectCompany = useCallback((next: SelectedCompany) => {
    setCompany(next);
    try {
      window.localStorage.setItem(SELECTED_COMPANY_KEY, JSON.stringify(next));
    } catch {
      // storage unavailable — context state still works for the session
    }
  }, []);

  const clearCompany = useCallback(() => {
    setCompany(null);
    try {
      window.localStorage.removeItem(SELECTED_COMPANY_KEY);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo(
    () => ({ company, hydrated, selectCompany, clearCompany }),
    [company, hydrated, selectCompany, clearCompany],
  );

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
}

export function useCompany(): CompanyContextValue {
  const ctx = useContext(CompanyContext);
  if (!ctx) throw new Error("useCompany must be used inside <CompanyProvider>");
  return ctx;
}
