import { describe, expect, it } from "vitest";
import { SEED_COMPANIES } from "../data/seedCompanies";
import { SKILL_TOPICS } from "../data/skillTopics";
import {
  isNullish,
  normalizeCompanyProfile,
  normalizeCompanySummary,
  normalizeDashboardSkills,
  proficiencyToBloom,
  scoreToCriticality,
  splitItems,
} from "./companyData";

const seed = SEED_COMPANIES[0]!;

describe("company data layer (Phase 1 seed)", () => {
  it("normalizes the company summary", () => {
    const summary = normalizeCompanySummary(seed.short_json, seed.company_id);
    expect(summary.name).toBe("Accenture plc");
    expect(summary.shortName).toBe("Accenture");
    expect(summary.companyType).toBe("Dream");
    expect(summary.headquartersAddress).toBe("Dublin, Ireland");
  });

  it("normalizes the full profile with full_json taking precedence", () => {
    const profile = normalizeCompanyProfile(seed.full_json, seed.short_json);
    expect(profile.ceo_name).toBe("Julie Sweet");
    expect(profile.website_url).toBe("https://www.accenture.com");
    expect(profile.incorporation_year).toBe(1989);
  });

  it("normalizes dashboard skills sorted by required level desc", () => {
    const skills = normalizeDashboardSkills(seed.skill_levels);
    expect(skills).toHaveLength(12);
    expect(skills[0]?.score).toBe(8);
    expect(skills[0]?.bloom).toBe("EV");
    expect(skills[0]?.criticality).toBe("Critical");
    for (const s of skills) {
      expect(SKILL_TOPICS[s.skillSetId]).toHaveLength(10);
    }
  });

  it("maps proficiency levels to Bloom codes", () => {
    expect(proficiencyToBloom(1)).toBe("CU");
    expect(proficiencyToBloom(4)).toBe("AP");
    expect(proficiencyToBloom(6)).toBe("AS");
    expect(proficiencyToBloom(8)).toBe("EV");
    expect(proficiencyToBloom(10)).toBe("CR");
  });

  it("maps scores to criticality", () => {
    expect(scoreToCriticality(7)).toBe("Critical");
    expect(scoreToCriticality(5)).toBe("Important");
    expect(scoreToCriticality(4)).toBe("Baseline");
  });

  it("collapses nullish spellings and splits delimited items", () => {
    expect(isNullish("NA")).toBe(true);
    expect(isNullish("n/a")).toBe(true);
    expect(isNullish("-")).toBe(true);
    expect(isNullish("Real value")).toBe(false);
    expect(splitItems("One; Two; Three")).toEqual(["One", "Two", "Three"]);
  });
});
