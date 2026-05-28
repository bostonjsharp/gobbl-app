export type SingleChoiceQuestion = {
  key: string;
  type: "single-choice";
  prompt: string;
  options: { value: string; label: string }[];
};

export type ShortTextQuestion = {
  key: string;
  type: "short-text";
  prompt: string;
  maxLength: number;
};

export type RankedChoiceQuestion = {
  key: string;
  type: "ranked-choice";
  prompt: string;
  items: { value: string; label: string; sublabel?: string }[];
};

export type SurveyQuestion = SingleChoiceQuestion | ShortTextQuestion | RankedChoiceQuestion;

export const POLITICIAN_RANKING_ITEMS: RankedChoiceQuestion["items"] = [
  { value: "aoc",     label: "AOC",     sublabel: "Alexandria Ocasio-Cortez" },
  { value: "bush",    label: "Bush",    sublabel: "George W. Bush" },
  { value: "hillary", label: "Hillary", sublabel: "Hillary Clinton" },
  { value: "trump",   label: "Trump",   sublabel: "Donald Trump" },
  { value: "biden",   label: "Biden",   sublabel: "Joe Biden" },
  { value: "harris",  label: "Harris",  sublabel: "Kamala Harris" },
  { value: "vance",   label: "Vance",   sublabel: "J.D. Vance" },
  { value: "schumer", label: "Schumer", sublabel: "Chuck Schumer" },
  { value: "bernie",  label: "Bernie",  sublabel: "Bernie Sanders" },
];

export const SURVEY_QUESTIONS: SurveyQuestion[] = [
  {
    key: "political_affiliation",
    type: "single-choice",
    prompt: "Where do you see yourself politically?",
    options: [
      { value: "strong_left",  label: "Strongly left" },
      { value: "lean_left",    label: "Lean left" },
      { value: "center",       label: "Center" },
      { value: "lean_right",   label: "Lean right" },
      { value: "strong_right", label: "Strongly right" },
      { value: "prefer_not",   label: "Prefer not to say" },
    ],
  },
  {
    key: "discuss_frequency",
    type: "single-choice",
    prompt: "How often do you discuss politics with people who disagree with you?",
    options: [
      { value: "never",     label: "Never" },
      { value: "rarely",    label: "Rarely" },
      { value: "sometimes", label: "Sometimes" },
      { value: "often",     label: "Often" },
    ],
  },
  {
    key: "top_issue",
    type: "single-choice",
    prompt: "What issue matters most to you right now?",
    options: [
      { value: "civil_rights",        label: "Civil rights" },
      { value: "climate_environment", label: "Climate & environment" },
      { value: "crime_safety",        label: "Crime & public safety" },
      { value: "economy_jobs",        label: "Economy & jobs" },
      { value: "education",           label: "Education" },
      { value: "foreign_policy",      label: "Foreign policy" },
      { value: "healthcare",          label: "Healthcare" },
      { value: "immigration",         label: "Immigration" },
    ],
  },
  {
    key: "politician_ranking",
    type: "ranked-choice",
    prompt: "Rank these individuals by how much you'd like to talk to them.",
    items: POLITICIAN_RANKING_ITEMS,
  },
];

export function isAnswerValid(question: SurveyQuestion, answer: string | undefined): boolean {
  if (!answer) return false;
  if (question.type === "single-choice") {
    return question.options.some((opt) => opt.value === answer);
  }
  if (question.type === "ranked-choice") {
    try {
      const ranked: unknown = JSON.parse(answer);
      if (!Array.isArray(ranked)) return false;
      const expected = new Set(question.items.map((i) => i.value));
      return ranked.length === expected.size && ranked.every((v) => typeof v === "string" && expected.has(v));
    } catch {
      return false;
    }
  }
  return answer.length > 0 && answer.length <= question.maxLength;
}
