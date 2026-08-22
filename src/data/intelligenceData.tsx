/**
 * Schema for the 22 Company Intelligence sections.
 * buildIntelligenceSections(profile?) returns the section/field schema with
 * profile values merged in when a profile is passed.
 */

import {
  Building2,
  Compass,
  Crown,
  Landmark,
  Globe2,
  Package,
  Cpu,
  Handshake,
  Swords,
  Target,
  Leaf,
  HeartPulse,
  Newspaper,
  BarChart3,
  ShieldAlert,
  MapPin,
  ShieldCheck,
  TrendingUp,
  Award,
  Wallet,
  Wifi,
  Contact,
  type LucideIcon,
} from "lucide-react";
import type { CompanyProfile } from "@/lib/companyData";

export type FieldType = "auto" | "url" | "video" | "rating" | "list" | "paragraph";

export interface IntelligenceField {
  label: string;
  key: string;
  type?: FieldType;
  value?: unknown;
}

export interface IntelligenceSection {
  id: string;
  title: string;
  icon: LucideIcon;
  fields: IntelligenceField[];
}

interface SectionDef {
  id: string;
  title: string;
  icon: LucideIcon;
  fields: Array<{ label: string; key: string; type?: FieldType }>;
}

const SECTION_DEFS: SectionDef[] = [
  {
    id: "company-identity",
    title: "Company Identity",
    icon: Building2,
    fields: [
      { label: "Legal Name", key: "name" },
      { label: "Short Name", key: "short_name" },
      { label: "Category", key: "category" },
      { label: "Nature of Company", key: "nature_of_company" },
      { label: "Incorporation Year", key: "incorporation_year" },
      { label: "Headquarters", key: "headquarters_address" },
      { label: "Website", key: "website_url", type: "url" },
      { label: "LinkedIn", key: "linkedin_url", type: "url" },
    ],
  },
  {
    id: "overview-vision",
    title: "Overview & Vision",
    icon: Compass,
    fields: [
      { label: "Company Overview", key: "overview_text", type: "paragraph" },
      { label: "Vision Statement", key: "vision_statement", type: "paragraph" },
      { label: "Mission Statement", key: "mission_statement", type: "paragraph" },
      { label: "Core Values", key: "core_values", type: "list" },
      { label: "History & Milestones", key: "history_timeline", type: "list" },
    ],
  },
  {
    id: "leadership",
    title: "Leadership",
    icon: Crown,
    fields: [
      { label: "CEO", key: "ceo_name" },
      { label: "CEO LinkedIn", key: "ceo_linkedin_url", type: "url" },
      { label: "Key Leaders", key: "key_leaders", type: "list" },
      { label: "Board Members", key: "board_members", type: "list" },
      { label: "Contact Person", key: "contact_person_name" },
      { label: "Contact Title", key: "contact_person_title" },
      { label: "Warm Intro Pathways", key: "warm_intro_pathways", type: "list" },
      { label: "Decision Maker Access", key: "decision_maker_access" },
    ],
  },
  {
    id: "funding-financials",
    title: "Funding & Financials",
    icon: Landmark,
    fields: [
      { label: "Annual Revenue", key: "annual_revenue" },
      { label: "Annual Profit", key: "annual_profit" },
      { label: "Revenue Mix", key: "revenue_mix", type: "list" },
      { label: "Valuation", key: "valuation" },
      { label: "YoY Growth Rate", key: "yoy_growth_rate" },
      { label: "Profitability Status", key: "profitability_status" },
      { label: "Key Investors", key: "key_investors", type: "list" },
      { label: "Recent Funding Rounds", key: "recent_funding_rounds" },
      { label: "Total Capital Raised", key: "total_capital_raised" },
      { label: "Customer Acquisition Cost", key: "customer_acquisition_cost" },
      { label: "Customer Lifetime Value", key: "customer_lifetime_value" },
      { label: "CAC : LTV Ratio", key: "cac_ltv_ratio" },
      { label: "Churn Rate", key: "churn_rate" },
      { label: "Net Promoter Score", key: "net_promoter_score", type: "rating" },
      { label: "Burn Rate", key: "burn_rate" },
      { label: "Runway", key: "runway_months" },
      { label: "Burn Multiplier", key: "burn_multiplier" },
    ],
  },
  {
    id: "global-presence",
    title: "Global Presence",
    icon: Globe2,
    fields: [
      { label: "Headquarters", key: "headquarters_address" },
      { label: "Operating Countries", key: "operating_countries", type: "list" },
      { label: "Office Count", key: "office_count" },
      { label: "Key Office Locations", key: "office_locations", type: "list" },
      { label: "Employee Size", key: "employee_size" },
      { label: "Global Exposure", key: "global_exposure", type: "list" },
    ],
  },
  {
    id: "products-services",
    title: "Products & Services",
    icon: Package,
    fields: [
      { label: "Offerings", key: "offerings_description", type: "list" },
      { label: "Focus Sectors", key: "focus_sectors", type: "list" },
      { label: "Pain Points Addressed", key: "pain_points_addressed", type: "list" },
      { label: "Top Customers", key: "top_customers", type: "list" },
      { label: "Case Studies", key: "case_studies", type: "list" },
      { label: "Product Pipeline", key: "product_pipeline", type: "list" },
      { label: "Innovation Roadmap", key: "innovation_roadmap", type: "list" },
    ],
  },
  {
    id: "technology-stack",
    title: "Technology Stack",
    icon: Cpu,
    fields: [
      { label: "Tech Stack", key: "tech_stack", type: "list" },
      { label: "Technology Partners", key: "technology_partners", type: "list" },
      { label: "AI/ML Adoption Level", key: "ai_ml_adoption_level" },
      { label: "R&D Investment", key: "r_and_d_investment" },
      { label: "Intellectual Property", key: "intellectual_property", type: "list" },
      { label: "Cybersecurity Posture", key: "cybersecurity_posture", type: "list" },
      { label: "Tech Adoption Rating", key: "tech_adoption_rating" },
    ],
  },
  {
    id: "partnerships-ecosystem",
    title: "Partnerships & Ecosystem",
    icon: Handshake,
    fields: [
      { label: "Partnership Ecosystem", key: "partnership_ecosystem", type: "list" },
      { label: "Technology Partners", key: "technology_partners", type: "list" },
      { label: "Industry Associations", key: "industry_associations", type: "list" },
      { label: "Event Participation", key: "event_participation", type: "list" },
    ],
  },
  {
    id: "competitive-landscape",
    title: "Competitive Landscape",
    icon: Swords,
    fields: [
      { label: "Key Competitors", key: "key_competitors", type: "list" },
      { label: "Market Share", key: "market_share_percentage" },
      { label: "Benchmark vs Peers", key: "benchmark_vs_peers", type: "list" },
      { label: "Competitive Advantages", key: "competitive_advantages", type: "list" },
      { label: "Unique Differentiators", key: "unique_differentiators", type: "list" },
      { label: "Weaknesses & Gaps", key: "weaknesses_gaps", type: "list" },
      { label: "Key Challenges & Needs", key: "key_challenges_needs", type: "list" },
    ],
  },
  {
    id: "market-opportunity",
    title: "Market Opportunity",
    icon: Target,
    fields: [
      { label: "Total Addressable Market (TAM)", key: "tam" },
      { label: "Serviceable Addressable Market (SAM)", key: "sam" },
      { label: "Serviceable Obtainable Market (SOM)", key: "som" },
      { label: "Future Projections", key: "future_projections" },
      { label: "Strategic Priorities", key: "strategic_priorities", type: "list" },
      { label: "Hiring Velocity", key: "hiring_velocity", type: "list" },
    ],
  },
  {
    id: "value-proposition-esg",
    title: "Core Value Proposition & ESG",
    icon: Leaf,
    fields: [
      { label: "Core Value Proposition", key: "core_value_proposition", type: "list" },
      { label: "Unique Differentiators", key: "unique_differentiators", type: "list" },
      { label: "ESG Ratings & Commitments", key: "esg_ratings", type: "list" },
      { label: "Sustainability & CSR", key: "sustainability_csr", type: "list" },
      { label: "Ethical Sourcing", key: "ethical_sourcing", type: "list" },
      { label: "Carbon Footprint", key: "carbon_footprint" },
    ],
  },
  {
    id: "culture-work-life",
    title: "Culture & Work Life",
    icon: HeartPulse,
    fields: [
      { label: "Work Culture", key: "work_culture_summary", type: "list" },
      { label: "Manager Quality", key: "manager_quality" },
      { label: "Psychological Safety", key: "psychological_safety" },
      { label: "Feedback Culture", key: "feedback_culture", type: "list" },
      { label: "Diversity & Inclusion", key: "diversity_inclusion_score", type: "list" },
      { label: "Diversity Metrics", key: "diversity_metrics", type: "list" },
      { label: "Ethical Standards", key: "ethical_standards" },
      { label: "Burnout Risk", key: "burnout_risk" },
      { label: "Layoff History", key: "layoff_history" },
      { label: "Mission Clarity", key: "mission_clarity" },
      { label: "Crisis Behavior", key: "crisis_behavior" },
      { label: "Employee Turnover", key: "employee_turnover" },
      { label: "Average Retention Tenure", key: "avg_retention_tenure" },
    ],
  },
  {
    id: "recent-news",
    title: "Recent News & Milestones",
    icon: Newspaper,
    fields: [
      { label: "Recent News", key: "recent_news", type: "list" },
      { label: "History & Milestones", key: "history_timeline", type: "list" },
      { label: "Awards & Recognitions", key: "awards_recognitions", type: "list" },
      { label: "Event Participation", key: "event_participation", type: "list" },
    ],
  },
  {
    id: "sales-customer-metrics",
    title: "Sales & Customer Metrics",
    icon: BarChart3,
    fields: [
      { label: "Sales Motion", key: "sales_motion" },
      { label: "Go-To-Market Strategy", key: "go_to_market_strategy", type: "list" },
      { label: "Customer Concentration Risk", key: "customer_concentration_risk" },
      { label: "Top Customers", key: "top_customers", type: "list" },
      { label: "Customer Testimonials", key: "customer_testimonials", type: "list" },
      { label: "Customer Acquisition Cost", key: "customer_acquisition_cost" },
      { label: "Customer Lifetime Value", key: "customer_lifetime_value" },
      { label: "Churn Rate", key: "churn_rate" },
      { label: "Net Promoter Score", key: "net_promoter_score", type: "rating" },
    ],
  },
  {
    id: "risk-compliance",
    title: "Risk & Compliance",
    icon: ShieldAlert,
    fields: [
      { label: "Regulatory Status", key: "regulatory_status", type: "list" },
      { label: "Legal Issues", key: "legal_issues" },
      { label: "Supply Chain Dependencies", key: "supply_chain_dependencies", type: "list" },
      { label: "Geopolitical Risks", key: "geopolitical_risks", type: "list" },
      { label: "Macro Risks", key: "macro_risks", type: "list" },
      { label: "Ethical Sourcing", key: "ethical_sourcing", type: "list" },
      { label: "Cybersecurity Posture", key: "cybersecurity_posture", type: "list" },
    ],
  },
  {
    id: "work-location-commute",
    title: "Work Location & Commute",
    icon: MapPin,
    fields: [
      { label: "Remote Policy", key: "remote_policy_details" },
      { label: "Flexibility Level", key: "flexibility_level", type: "list" },
      { label: "Typical Hours", key: "typical_hours" },
      { label: "Overtime Expectations", key: "overtime_expectations" },
      { label: "Weekend Work", key: "weekend_work" },
      { label: "Location Centrality", key: "location_centrality" },
      { label: "Public Transport Access", key: "public_transport_access", type: "list" },
      { label: "Cab Policy", key: "cab_policy", type: "list" },
      { label: "Airport Commute Time", key: "airport_commute_time" },
      { label: "Office Zone Type", key: "office_zone_type" },
    ],
  },
  {
    id: "safety-wellbeing",
    title: "Safety & Wellbeing",
    icon: ShieldCheck,
    fields: [
      { label: "Area Safety", key: "area_safety", type: "list" },
      { label: "Safety Policies", key: "safety_policies", type: "list" },
      { label: "Infrastructure Safety", key: "infrastructure_safety", type: "list" },
      { label: "Emergency Preparedness", key: "emergency_preparedness", type: "list" },
      { label: "Health Support", key: "health_support", type: "list" },
      { label: "Burnout Risk", key: "burnout_risk" },
    ],
  },
  {
    id: "career-growth-learning",
    title: "Career Growth & Learning",
    icon: TrendingUp,
    fields: [
      { label: "Training Spend", key: "training_spend" },
      { label: "Onboarding Quality", key: "onboarding_quality" },
      { label: "Learning Culture", key: "learning_culture", type: "list" },
      { label: "Exposure Quality", key: "exposure_quality" },
      { label: "Mentorship Availability", key: "mentorship_availability", type: "list" },
      { label: "Internal Mobility", key: "internal_mobility" },
      { label: "Promotion Clarity", key: "promotion_clarity", type: "list" },
      { label: "Tools Access", key: "tools_access", type: "list" },
      { label: "Role Clarity", key: "role_clarity" },
      { label: "Early Ownership", key: "early_ownership" },
      { label: "Work Impact", key: "work_impact", type: "list" },
      { label: "Execution–Thinking Balance", key: "execution_thinking_balance" },
      { label: "Automation Level", key: "automation_level" },
      { label: "Cross-Functional Exposure", key: "cross_functional_exposure", type: "list" },
      { label: "Company Maturity", key: "company_maturity" },
      { label: "Skill Relevance", key: "skill_relevance" },
      { label: "Exit Opportunities", key: "exit_opportunities", type: "list" },
    ],
  },
  {
    id: "brand-reputation",
    title: "Brand & Reputation",
    icon: Award,
    fields: [
      { label: "Brand Value", key: "brand_value" },
      { label: "Brand Sentiment", key: "brand_sentiment_score" },
      { label: "Awards & Recognitions", key: "awards_recognitions", type: "list" },
      { label: "External Recognition", key: "external_recognition" },
      { label: "Client Quality", key: "client_quality", type: "list" },
      { label: "Network Strength", key: "network_strength", type: "list" },
      { label: "Customer Testimonials", key: "customer_testimonials", type: "list" },
      { label: "Glassdoor Rating", key: "glassdoor_rating", type: "rating" },
      { label: "Indeed Rating", key: "indeed_rating", type: "rating" },
      { label: "Google Rating", key: "google_rating", type: "rating" },
    ],
  },
  {
    id: "compensation-benefits",
    title: "Compensation & Benefits",
    icon: Wallet,
    fields: [
      { label: "Fixed vs Variable Pay", key: "fixed_vs_variable_pay" },
      { label: "Bonus Predictability", key: "bonus_predictability" },
      { label: "ESOPs & Incentives", key: "esops_incentives", type: "list" },
      { label: "Family Health Insurance", key: "family_health_insurance", type: "list" },
      { label: "Health Support", key: "health_support", type: "list" },
      { label: "Leave Policy", key: "leave_policy", type: "list" },
      { label: "Relocation Support", key: "relocation_support", type: "list" },
      { label: "Lifestyle Benefits", key: "lifestyle_benefits", type: "list" },
    ],
  },
  {
    id: "digital-presence-ratings",
    title: "Digital Presence & Ratings",
    icon: Wifi,
    fields: [
      { label: "Website", key: "website_url", type: "url" },
      { label: "Website Quality", key: "website_quality" },
      { label: "Website Rating", key: "website_rating", type: "rating" },
      { label: "Website Traffic Rank", key: "website_traffic_rank", type: "list" },
      { label: "Social Media Followers", key: "social_media_followers" },
      { label: "Glassdoor", key: "glassdoor_rating", type: "rating" },
      { label: "Indeed", key: "indeed_rating", type: "rating" },
      { label: "Google", key: "google_rating", type: "rating" },
      { label: "LinkedIn", key: "linkedin_url", type: "url" },
      { label: "Twitter / X", key: "twitter_handle" },
      { label: "Facebook", key: "facebook_url", type: "url" },
      { label: "Instagram", key: "instagram_url", type: "url" },
      { label: "Marketing Video", key: "marketing_video_url", type: "video" },
    ],
  },
  {
    id: "contact-information",
    title: "Contact Information",
    icon: Contact,
    fields: [
      { label: "Primary Email", key: "primary_contact_email" },
      { label: "Primary Phone", key: "primary_phone_number" },
      { label: "Contact Person", key: "contact_person_name" },
      { label: "Contact Title", key: "contact_person_title" },
      { label: "Contact Email", key: "contact_person_email" },
      { label: "Contact Phone", key: "contact_person_phone" },
      { label: "Headquarters", key: "headquarters_address" },
      { label: "Website", key: "website_url", type: "url" },
    ],
  },
];

export function buildIntelligenceSections(profile?: CompanyProfile): IntelligenceSection[] {
  return SECTION_DEFS.map((section) => ({
    id: section.id,
    title: section.title,
    icon: section.icon,
    fields: section.fields.map((field) => ({
      ...field,
      value: profile ? profile[field.key] : undefined,
    })),
  }));
}

export const INTELLIGENCE_SECTION_COUNT = SECTION_DEFS.length;
