"use client";

import { useState } from "react";
import { Info, Languages, Sprout } from "lucide-react";
import type { Advisory } from "@/lib/api";

const CLASS_STYLES: Record<string, { text: string; bg: string; border: string }> = {
  "No Rain": {
    text: "text-rain-none", bg: "bg-rain-none-bg", border: "border-rain-none-border",
  },
  "Moderate Rain": {
    text: "text-rain-moderate", bg: "bg-rain-moderate-bg", border: "border-rain-moderate-border",
  },
  "Heavy Rain": {
    text: "text-rain-heavy", bg: "bg-rain-heavy-bg", border: "border-rain-heavy-border",
  },
};

const LANG_LABELS = { en: "English", lg: "Luganda" } as const;

export default function AdvisoryPanel({
  advisory,
  predictedLabel,
}: {
  advisory: Advisory;
  predictedLabel: string;
}) {
  const [lang, setLang] = useState<"en" | "lg">("en");
  const content = advisory[lang];
  const style = CLASS_STYLES[predictedLabel];

  return (
    <div className="card flex h-full flex-col p-4">
      <div className="flex items-center justify-between pb-3">
        <div className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
          Agro-Advisory (Based on Forecast)
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-line bg-page p-0.5">
          <Languages size={14} className="ml-1.5 text-ink-muted" />
          {(Object.keys(LANG_LABELS) as Array<"en" | "lg">).map((code) => (
            <button
              key={code}
              onClick={() => setLang(code)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                lang === code
                  ? "bg-brand-500 text-white"
                  : "text-ink-secondary hover:bg-line"
              }`}
            >
              {LANG_LABELS[code]}
            </button>
          ))}
        </div>
      </div>

      <div className={`rounded-lg border p-3 ${style.bg} ${style.border}`}>
        <div className={`text-base font-bold ${style.text}`}>
          {content.headline}
        </div>
        <div className="pt-1 text-sm leading-relaxed text-ink-secondary">
          {content.explanation}
        </div>
      </div>

      <ul className="flex-1 space-y-2 pt-3">
        {content.actions.map((action) => (
          <li key={action} className="flex items-start gap-2 text-sm text-ink-secondary">
            <Sprout size={16} className="mt-0.5 shrink-0 text-rain-none-accent" />
            {action}
          </li>
        ))}
      </ul>

      <div className="flex items-start gap-1.5 pt-3 text-xs text-ink-muted">
        <Info size={13} className="mt-0.5 shrink-0" />
        <span>
          Advisories are generated automatically from model explanations
          using SHAP.
          {lang === "lg" &&
            " Luganda text is a draft pending native-speaker review."}
        </span>
      </div>
    </div>
  );
}
