export const APP_NAME = "DecisionTrace";

export const APP_TAGLINE = "Understand WHY code exists.";

export const LOADING_STEPS = [
  "Reading repository...",
  "Reading commits...",
  "Analyzing architecture...",
  "Building decision context...",
  "Generating analysis..."
] as const;

export const CONFIDENCE_LOW_THRESHOLD = 40;

export const GITHUB_API_BASE = "https://api.github.com";
