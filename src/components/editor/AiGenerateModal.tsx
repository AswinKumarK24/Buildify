"use client";

import { useMemo, useState } from "react";
import type { StylePreset } from "@/lib/buildify/types";

const ALL_STYLES: StylePreset[] = ["Portfolio", "Business", "Landing Page", "Blog", "Restaurant", "Agency"];

export function AiGenerateModal({
  open,
  initialStyle,
  onClose,
  onGenerate,
}: {
  open: boolean;
  initialStyle: StylePreset;
  onClose: () => void;
  onGenerate: (prompt: string, style: StylePreset) => Promise<void>;
}) {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState<StylePreset>(initialStyle);
  const [loading, setLoading] = useState(false);

  const styleLabel = useMemo(() => style, [style]);

  if (!open) return null;

  const submit = async () => {
    if (loading) return;
    setLoading(true);
    try {
      // UX polish: make generation feel intentional.
      await new Promise((r) => setTimeout(r, 1500));
      setLoading(false);
      await onGenerate(prompt, style);
    } catch {
      setLoading(false);
      throw new Error("AI generation failed");
    }
  };

  return (
    <div className="overlay show" role="dialog" aria-modal="true" aria-label="AI Generate" onMouseDown={(e) => (e.target === e.currentTarget ? onClose() : null)}>
      <div className="modalCard">
        <div className="modalTop">
          <h2 className="modalTitle">Generate with AI</h2>
          <p className="modalSub">Describe your website and we&apos;ll build the layout for you</p>
        </div>

        <div className="modalBody">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. A portfolio website for a photographer with a dark theme, gallery section, and contact form"
          />

          <div className="field" style={{ background: "rgba(18,18,26,0.45)", borderColor: "rgba(255,255,255,0.08)" }}>
            <label>
              Style preset <span className="value">{styleLabel}</span>
            </label>
            <div className="chipRow">
              {ALL_STYLES.map((s) => (
                <button
                  key={s}
                  className={`chip ${s === style ? "active" : ""}`}
                  type="button"
                  onClick={() => setStyle(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            className="modalGenerate"
            id="aiGenerateBtn"
            type="button"
            disabled={loading}
            onClick={async () => {
              await submit();
              onClose();
            }}
          >
            {loading ? <span className="spinner" aria-hidden="true" /> : <span>Generate Layout</span>}
            {!loading ? null : <span style={{ marginLeft: 8, fontWeight: 800 }}>Generating...</span>}
          </button>

          <div className="modalActions">
            <button className="modalBtn" type="button" onClick={onClose} disabled={loading}>
              Close
            </button>
            <div className="modalBtnRow" />
          </div>
        </div>
      </div>
    </div>
  );
}

