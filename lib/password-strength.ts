import type { ZXCVBNResult } from "zxcvbn";

export interface StrengthResult {
  score: number;
  label: string;
  color: string;
  barFill: number;
  feedback: {
    warning: string;
    suggestions: string[];
  };
}

const SCORE_CONFIG = [
  { label: "Very Weak", color: "bg-destructive" },
  { label: "Weak", color: "bg-destructive" },
  { label: "Fair", color: "bg-orange-500" },
  { label: "Good", color: "bg-yellow-500" },
  { label: "Strong", color: "bg-success" },
];

const MIN_REQUIRED_SCORE = 3;

export function getPasswordStrength(result: ZXCVBNResult): StrengthResult {
  const score = result.score;
  const cfg = SCORE_CONFIG[score] ?? SCORE_CONFIG[0];
  return {
    score,
    label: cfg.label,
    color: cfg.color,
    barFill: Math.min(score + 1, 4),
    feedback: {
      warning: result.feedback.warning,
      suggestions: result.feedback.suggestions,
    },
  };
}

export function isStrongEnough(score: number): boolean {
  return score >= MIN_REQUIRED_SCORE;
}
