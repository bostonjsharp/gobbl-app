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

export type SurveyQuestion = SingleChoiceQuestion | ShortTextQuestion;

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
];

export function isAnswerValid(question: SurveyQuestion, answer: string | undefined): boolean {
  if (!answer) return false;
  if (question.type === "single-choice") {
    return question.options.some((opt) => opt.value === answer);
  }
  return answer.length > 0 && answer.length <= question.maxLength;
}
