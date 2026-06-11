export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  source: string;
  seniority: string;
  remote: boolean;
  salary: string | null;
  skills: string[];
  posted_at: string;
  match_score?: number;
  why_matched?: string;
  skill_gaps?: string[];
}

export interface RankedJob extends Job {
  match_score: number;
  why_matched: string;
  skill_gaps: string[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  jobs?: RankedJob[];
  suggestions?: string[];
  timestamp: string;
}

export interface ChatRequest {
  message: string;
  session_id: string;
  skill_gaps?: string[];
}

export interface ChatResponse {
  market_insight: string;
  ranked_jobs: RankedJob[];
  follow_up_suggestions: string[];
  profile_missing: boolean;
}

export interface UserProfile {
  user_id: string;
  skills: string[];
  seniority: string;
  years_experience: number;
  preferred_roles: string[];
  preferred_locations: string[];
  background: string;
  current_goal: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user_id?: string;
}

export interface DashboardStats {
  total_jobs: number;
  last_scrape_time: string | null;
  profile_completion: number;
  top_skills: string[];
}

export interface ScrapeResult {
  status: string;
  results: Record<string, number>;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
}

export interface ApplicationRecord {
  id: string;
  user_id: string;
  job_id: string;
  job_title: string;
  company: string;
  job_url: string;
  match_score: number;
  status: "applied" | "interview_invited" | "rejected" | "offer" | "withdrawn";
  applied_date: string;
  last_updated: string;
  original_cv: string;
  optimized_cv: string;
  interview_date: string | null;
  notes: string;
  feedback: string;
}

export interface ApplicationsResponse {
  total_applied: number;
  interviews_invited: number;
  offers: number;
  rejected: number;
  applications: ApplicationRecord[];
}

export interface ApplyRequest {
  session_id: string;
  selected_job_ids: string[];
  min_score?: number;
  limit?: number;
}

export interface EmailDraft {
  to: string;
  subject: string;
  body: string;
  cv_attachment: string;
}

export interface ApplyPendingItem {
  job_id: string;
  application_id: string;
  job_title?: string;
  company?: string;
  job_url?: string;
  status: string;
}

export interface ApplyResult {
  job_id: string;
  application_id: string;
  job_title?: string;
  company?: string;
  job_url?: string;
  applied: boolean;
  status: string;
  method?: string;
  message?: string;
  requires_manual: boolean;
  cv_optimized: boolean;
  optimized_cv_text?: string;
  email_draft?: EmailDraft;
  pdf_path?: string;
}

export interface ApplyResponse {
  total: number;
  pending: ApplyPendingItem[];
  message?: string;
  /** @deprecated Use pending instead */
  results?: ApplyResult[];
  applied?: number;
  email_drafts?: number;
  manual_required?: number;
}

export interface StatusUpdatePayload {
  appId: string;
  status: string;
  feedback: string;
}
