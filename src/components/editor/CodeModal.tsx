"use client";

import { useState } from "react";
import { Copy, Download, CodeXml } from "lucide-react";

export function CodeModal({
  open,
  onClose,
  html,
  css,
  js,
  pageName
}: {
  open: boolean;
  onClose: () => void;
  html: string;
  css: string;
  js: string;
  pageName: string;
}) {
  const [tab, setTab] = useState<"html" | "css" | "js">("html");

  if (!open) return null;

  const content = tab === "html" ? html : tab === "css" ? css : js;
  const ext = tab === "html" ? "html" : tab === "css" ? "css" : "js";

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
  };

  const handleDownload = () => {
    const filename = tab === "html" ? "index.html" : tab === "css" ? "styles.css" : "script.js";
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="previewOverlay show" role="dialog" aria-modal="true" aria-label="Code Export" onMouseDown={(e) => (e.currentTarget === e.target ? onClose() : null)}>
      <div className="codeModalCard">
        <div className="codeModalTop">
          <div className="title">
            <span className="c-dot" aria-hidden="true" />
            <span>{pageName} (View Code)</span>
          </div>
          <div className="codeTabs">
            <button className={tab === "html" ? "active" : ""} onClick={() => setTab("html")}>index.html</button>
            <button className={tab === "css" ? "active" : ""} onClick={() => setTab("css")}>styles.css</button>
            <button className={tab === "js" ? "active" : ""} onClick={() => setTab("js")}>script.js</button>
          </div>
          <div className="topActions">
            <button className="codeActionBtn" onClick={handleCopy} title="Copy to clipboard">
              <Copy size={14} />
            </button>
            <button className="codeActionBtn" onClick={handleDownload} title="Download file">
              <Download size={14} />
            </button>
            <button className="closeBtn" onClick={onClose}>Close</button>
          </div>
        </div>
        <div className="codeModalBody">
          <pre className="codeView">
            <code>{content}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
