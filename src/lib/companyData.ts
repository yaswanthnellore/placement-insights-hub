/**
 * Data layer — pure normalizers.
 *
 * Phase 1: inputs come from src/data/seedCompanies.ts.
 * Phase 2: pipe Supabase rows (short_json / full_json / skill_levels) into
 * the exact same functions — no other file needs to change.
 */

import type { SeedSkillLevel } from "@/data/seedCompanies";

// ---------------------------------------------------------------------------
// Low-level helpers
// ---------------------------------------------------------------------------

export type JsonRecord = Record<string, unknown>;

export function asRecord(value: unknown): JsonRecord {
  return value != null && typeof value === "object" && !Array.isArray(value)
    ? (value as JsonRecord)
    : {};
}

export function asString(value: unknown): string | null {
  if (value == null) return null;
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed === "" ? null : trimmed;
  }
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return null;
}

/** True for every "no data" spelling we want to collapse. */
export function isNullish(value: unknown): boolean {
  if (value == null) return true;
  if (typeof value !== "string") return false;
  const v = value.trim().toLowerCase();
  return (
    v === "" ||
    v === "na" ||
    v === "n/a" ||
    v === "none" ||
    v === "null" ||
    v === "undefined" ||
    v === "-" ||
    v === "not available" ||
    v === "not applicable"
  );
}

/** Split a delimited blob into clean items (newlines, semicolons, bullets, periods). */
export function splitItems(value: unknown): string[] {
  const str = asString(value);
  if (!str || isNullish(str)) return [];
  return str
    .split(/[\n;•|]+/)
    .flatMap((part) => part.split(/\.\s+(?=[A-Z0-9])/))
    .map((s) => s.replace(/^[-–—*]\s*/, "").trim())
    .filter((s) => s.length > 0);
}

/** "super_dream" | "SUPER-DREAM" → "Super Dream". */
export function titleCaseFromCode(code: unknown): string {
  const str = asString(code);
  if (!str) return "";
  return str
    .replace(/[_-]+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export type Difficulty = "EXPERT" | "ADVANCED" | "PRO" | "BEGINNER";

export function scoreToDifficulty(score: number): Difficulty {
  if (score >= 8) return "EXPERT";
  if (score >= 6) return "ADVANCED";
  if (score >= 4) return "PRO";
  return "BEGINNER";
}

export type BloomLevel = "CU" | "AP" | "AS" | "EV" | "CR";

export const BLOOM_LABELS: Record<BloomLevel, string> = {
  CU: "Remember / Understand",
  AP: "Apply",
  AS: "Analyze",
  EV: "Evaluate",
  CR: "Create",
};

export function proficiencyToBloom(level: number): BloomLevel {
  if (level <= 2) return "CU";
  if (level <= 4) return "AP";
  if (level <= 6) return "AS";
  if (level <= 8) return "EV";
  return "CR";
}

export type Criticality = "Critical" | "Important" | "Baseline";

export function scoreToCriticality(score: number): Criticality {
  if (score >= 7) return "Critical";
  if (score >= 5) return "Important";
  return "Baseline";
}

export type CompanyType = "Super Dream" | "Dream" | "Standard" | "Regular";

export const COMPANY_TYPES: CompanyType[] = ["Super Dream", "Dream", "Standard", "Regular"];

export function normalizeCompanyType(value: unknown): CompanyType {
  const v = titleCaseFromCode(value);
  if (v === "Super Dream" || v === "Dream" || v === "Standard" || v === "Regular") return v;
  return "Regular";
}

// ---------------------------------------------------------------------------
// CompanySummary (card grid)
// ---------------------------------------------------------------------------

export interface CompanySummary {
  companyId: number;
  name: string;
  shortName: string;
  logoUrl: string | null;
  category: string;
  companyType: CompanyType;
  incorporationYear: number | null;
  employeeSize: string | null;
  headquartersAddress: string | null;
  operatingCountries: string | null;
  officeLocations: string | null;
  yoyGrowthRate: string | null;
  websiteUrl: string | null;
}

export function normalizeCompanySummary(
  short_json: unknown,
  companyId = 0,
): CompanySummary {
  const j = asRecord(short_json);
  const year = j.incorporation_year;
  return {
    companyId,
    name: asString(j.name) ?? "Unknown Company",
    shortName: asString(j.short_name) ?? asString(j.name) ?? "Unknown",
    logoUrl: asString(j.logo_url),
    category: asString(j.category) ?? "General",
    companyType: normalizeCompanyType(j.company_type),
    incorporationYear: typeof year === "number" ? year : null,
    employeeSize: asString(j.employee_size),
    headquartersAddress: asString(j.headquarters_address),
    operatingCountries: asString(j.operating_countries),
    officeLocations: asString(j.office_locations),
    yoyGrowthRate: asString(j.yoy_growth_rate),
    websiteUrl: asString(j.website_url),
  };
}

// ---------------------------------------------------------------------------
// CompanyProfile (full intelligence profile — every seed field, forward-
// compatible with the future JSONB columns via the index signature).
// ---------------------------------------------------------------------------

export interface CompanyProfile {
  // Identity
  name?: string;
  short_name?: string;
  category?: string;
  nature_of_company?: string;
  incorporation_year?: number;
  logo_url?: string;
  company_type?: string;
  overview_text?: string;
  headquarters_address?: string;
  operating_countries?: string;
  office_count?: string;
  office_locations?: string;
  employee_size?: string;
  vision_statement?: string;
  mission_statement?: string;
  core_values?: string;
  history_timeline?: string;
  recent_news?: string;
  // Digital presence
  website_url?: string;
  linkedin_url?: string;
  twitter_handle?: string;
  facebook_url?: string;
  instagram_url?: string;
  primary_contact_email?: string;
  primary_phone_number?: string;
  // Risk & compliance
  regulatory_status?: string;
  legal_issues?: string;
  esg_ratings?: string;
  supply_chain_dependencies?: string;
  geopolitical_risks?: string;
  macro_risks?: string;
  carbon_footprint?: string;
  ethical_sourcing?: string;
  // Brand & ratings
  marketing_video_url?: string;
  customer_testimonials?: string;
  website_quality?: string;
  website_rating?: string;
  website_traffic_rank?: string;
  social_media_followers?: string;
  glassdoor_rating?: string;
  indeed_rating?: string;
  google_rating?: string;
  awards_recognitions?: string;
  brand_sentiment_score?: string;
  event_participation?: string;
  // Products & services
  pain_points_addressed?: string;
  focus_sectors?: string;
  offerings_description?: string;
  top_customers?: string;
  core_value_proposition?: string;
  unique_differentiators?: string;
  competitive_advantages?: string;
  weaknesses_gaps?: string;
  key_challenges_needs?: string;
  key_competitors?: string;
  market_share_percentage?: string;
  sales_motion?: string;
  customer_concentration_risk?: string;
  exit_strategy_history?: string;
  benchmark_vs_peers?: string;
  future_projections?: string;
  strategic_priorities?: string;
  industry_associations?: string;
  case_studies?: string;
  go_to_market_strategy?: string;
  innovation_roadmap?: string;
  product_pipeline?: string;
  tam?: string;
  sam?: string;
  som?: string;
  // Culture & benefits
  leave_policy?: string;
  health_support?: string;
  fixed_vs_variable_pay?: string;
  bonus_predictability?: string;
  esops_incentives?: string;
  family_health_insurance?: string;
  relocation_support?: string;
  lifestyle_benefits?: string;
  hiring_velocity?: string;
  employee_turnover?: string;
  avg_retention_tenure?: string;
  diversity_metrics?: string;
  work_culture_summary?: string;
  manager_quality?: string;
  psychological_safety?: string;
  feedback_culture?: string;
  diversity_inclusion_score?: string;
  ethical_standards?: string;
  burnout_risk?: string;
  layoff_history?: string;
  mission_clarity?: string;
  sustainability_csr?: string;
  crisis_behavior?: string;
  // Funding & financials
  annual_revenue?: string;
  annual_profit?: string;
  revenue_mix?: string;
  valuation?: string;
  yoy_growth_rate?: string;
  profitability_status?: string;
  key_investors?: string;
  recent_funding_rounds?: string;
  total_capital_raised?: string;
  customer_acquisition_cost?: string;
  customer_lifetime_value?: string;
  cac_ltv_ratio?: string;
  churn_rate?: string;
  net_promoter_score?: string;
  burn_rate?: string;
  runway_months?: string;
  burn_multiplier?: string;
  // Work location
  remote_policy_details?: string;
  typical_hours?: string;
  overtime_expectations?: string;
  weekend_work?: string;
  flexibility_level?: string;
  location_centrality?: string;
  public_transport_access?: string;
  cab_policy?: string;
  airport_commute_time?: string;
  office_zone_type?: string;
  area_safety?: string;
  safety_policies?: string;
  infrastructure_safety?: string;
  emergency_preparedness?: string;
  // Leadership
  ceo_name?: string;
  ceo_linkedin_url?: string;
  key_leaders?: string;
  warm_intro_pathways?: string;
  decision_maker_access?: string;
  contact_person_name?: string;
  contact_person_title?: string;
  contact_person_email?: string;
  contact_person_phone?: string;
  board_members?: string;
  // Career growth
  training_spend?: string;
  onboarding_quality?: string;
  learning_culture?: string;
  exposure_quality?: string;
  mentorship_availability?: string;
  internal_mobility?: string;
  promotion_clarity?: string;
  tools_access?: string;
  role_clarity?: string;
  early_ownership?: string;
  work_impact?: string;
  execution_thinking_balance?: string;
  automation_level?: string;
  cross_functional_exposure?: string;
  company_maturity?: string;
  brand_value?: string;
  client_quality?: string;
  exit_opportunities?: string;
  skill_relevance?: string;
  external_recognition?: string;
  network_strength?: string;
  global_exposure?: string;
  // Tech
  technology_partners?: string;
  intellectual_property?: string;
  r_and_d_investment?: string;
  ai_ml_adoption_level?: string;
  tech_stack?: string;
  cybersecurity_posture?: string;
  partnership_ecosystem?: string;
  tech_adoption_rating?: string;
  // Forward compatibility with future JSONB columns
  [key: string]: unknown;
}

export function normalizeCompanyProfile(
  full_json: unknown,
  short_json?: unknown,
): CompanyProfile {
  const full = asRecord(full_json);
  const short = asRecord(short_json);
  const merged: JsonRecord = { ...short, ...full };
  const profile: CompanyProfile = {};
  for (const [key, value] of Object.entries(merged)) {
    if (value == null) continue;
    if (typeof value === "number" || typeof value === "boolean") {
      profile[key] = value;
    } else {
      profile[key] = asString(value);
    }
  }
  return profile;
}

// ---------------------------------------------------------------------------
// DashboardSkill (skill intelligence)
// ---------------------------------------------------------------------------

export interface DashboardSkill {
  skillSetId: number;
  name: string;
  /** Required level on the 1-10 ladder. */
  score: number;
  requiredProficiency: string;
  bloom: BloomLevel;
  criticality: Criticality;
  difficulty: Difficulty;
}

export function normalizeDashboardSkills(
  skillLevels: SeedSkillLevel[] | unknown,
): DashboardSkill[] {
  if (!Array.isArray(skillLevels)) return [];
  return skillLevels
    .map((raw) => {
      const r = asRecord(raw);
      const score =
        typeof r.required_level === "number"
          ? r.required_level
          : Number(asString(r.required_level) ?? 0);
      return {
        skillSetId:
          typeof r.skill_set_id === "number" ? r.skill_set_id : Number(r.skill_set_id ?? 0),
        name: asString(r.skill_set_name) ?? "Unnamed Skill",
        score,
        requiredProficiency: asString(r.required_proficiency) ?? "",
        bloom: proficiencyToBloom(score),
        criticality: scoreToCriticality(score),
        difficulty: scoreToDifficulty(score),
      } satisfies DashboardSkill;
    })
    .sort((a, b) => b.score - a.score);
}
