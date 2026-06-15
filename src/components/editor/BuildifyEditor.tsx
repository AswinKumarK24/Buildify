"use client";

import React, { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { DndContext, DragOverlay, PointerSensor, closestCenter, useSensor } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Eye, Sparkles, Download, Layout, PanelTop, Type, PanelsTopLeft, MessageSquareQuote, Image as ImageIcon, Mail, SquareMousePointer, Monitor, Tablet, Smartphone, HelpCircle, Video, Tag, Images, Sliders, CodeXml, Rocket, User, Save, Loader2, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { useBuilderStore } from "@/store/useBuilderStore";
import type { Block, BlockType, StylePreset } from "@/lib/buildify/types";
import { buildExportHTML, buildExportCode } from "@/lib/buildify/exporter";
import { createBlock } from "@/lib/buildify/templates";
import { AiGenerateModal } from "./AiGenerateModal";
import { Canvas } from "./Canvas";
import { PropertiesPanel } from "./PropertiesPanel";
import { LibraryCard } from "./LibraryCard";
import { CodeModal } from "./CodeModal";
import { DeployModal } from "./DeployModal";
import type { Device } from "@/lib/buildify/types";

const LIB_DEFS: Array<{
  group: "Layout" | "Content" | "Media" | "Forms";
  type: BlockType;
  icon: ReactNode;
  title: string;
  subtitle: string;
}> = [
  { group: "Layout", type: "navbar", icon: <PanelTop size={14} />, title: "Navbar", subtitle: "Top navigation" },
  { group: "Layout", type: "footer", icon: <Layout size={14} />, title: "Footer", subtitle: "Copyright + socials" },
  { group: "Content", type: "hero", icon: <PanelsTopLeft size={14} />, title: "Hero Section", subtitle: "Headline + CTA" },
  { group: "Content", type: "heading", icon: <Type size={14} />, title: "Heading", subtitle: "Large section title" },
  { group: "Content", type: "text", icon: <Type size={14} />, title: "Text Block", subtitle: "Readable paragraphs" },
  { group: "Content", type: "featureCards", icon: <Layout size={14} />, title: "Feature Cards (3-grid)", subtitle: "Highlights + benefits" },
  { group: "Content", type: "testimonial", icon: <MessageSquareQuote size={14} />, title: "Testimonial", subtitle: "Quote + author" },
  { group: "Content", type: "faq", icon: <HelpCircle size={14} />, title: "FAQ Section", subtitle: "Questions & answers" },
  { group: "Content", type: "pricing", icon: <Tag size={14} />, title: "Pricing", subtitle: "Plans & pricing table" },
  { group: "Content", type: "stats", icon: <Sparkles size={14} />, title: "Statistics", subtitle: "Row of metrics" },
  { group: "Layout", type: "split", icon: <PanelsTopLeft size={14} />, title: "Split Layout", subtitle: "50/50 image and text" },
  { group: "Media", type: "gallery", icon: <Images size={14} />, title: "Image Gallery", subtitle: "Grid of images" },
  { group: "Media", type: "image", icon: <ImageIcon size={14} />, title: "Image Block", subtitle: "Responsive placeholder" },
  { group: "Media", type: "video", icon: <Video size={14} />, title: "Video Embed", subtitle: "YouTube/Vimeo embed" },
  { group: "Media", type: "logos", icon: <Layout size={14} />, title: "Logo Banner", subtitle: "Trusted by logos" },
  { group: "Forms", type: "contactForm", icon: <Mail size={14} />, title: "Contact Form", subtitle: "Name, email, message" },
  { group: "Forms", type: "newsletter", icon: <Mail size={14} />, title: "Newsletter", subtitle: "Quick subscribe form" },
  { group: "Forms", type: "button", icon: <SquareMousePointer size={14} />, title: "Button", subtitle: "Link / CTA button" },
  { group: "Forms", type: "buttonGroup", icon: <SquareMousePointer size={14} />, title: "Button Group", subtitle: "Primary + secondary" },
];

type DragState =
  | { activeType: BlockType; source: "library" }
  | { activeId: string; source: "canvas" }
  | null;

function toastEscape(s: string) {
  return s;
}

function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export const BuildifyEditor = React.memo(function BuildifyEditor({ projectId }: { projectId: string }) {
  const blocks = useBuilderStore((s) => s.blocks);
  const selectedBlockId = useBuilderStore((s) => s.selectedBlockId);
  const pageName = useBuilderStore((s) => s.pageName);
  const device = useBuilderStore((s) => s.device);
  const aiStyle = useBuilderStore((s) => s.aiStyle);
  const setProjectId = useBuilderStore((s) => s.setProjectId);
  const setPageName = useBuilderStore((s) => s.setPageName);
  const setDevice = useBuilderStore((s) => s.setDevice);
  const selectBlock = useBuilderStore((s) => s.selectBlock);
  const insertBlock = useBuilderStore((s) => s.insertBlock);
  const deleteBlock = useBuilderStore((s) => s.deleteBlock);
  const moveBlock = useBuilderStore((s) => s.moveBlock);
  const updateBlockProps = useBuilderStore((s) => s.updateBlockProps);
  const replaceBlocks = useBuilderStore((s) => s.replaceBlocks);
  const setAiStyle = useBuilderStore((s) => s.setAiStyle);
  const saveProject = useBuilderStore((s) => s.saveProject);
  const isDirty = useBuilderStore((s) => s.isDirty);
  const setDirty = useBuilderStore((s) => s.setDirty);

  const [insertIndex, setInsertIndex] = useState(0);
  const [showInsertIndicator, setShowInsertIndicator] = useState(false);
  const [canvasHighlighted, setCanvasHighlighted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const [dragState, setDragState] = useState<DragState>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");
  const [aiOpen, setAiOpen] = useState(false);
  const [mobilePropsOpen, setMobilePropsOpen] = useState(false);
  const [previewThemeColor, setPreviewThemeColor] = useState("#00d4ff");

  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const [deployModalOpen, setDeployModalOpen] = useState(false);
  const [exportCode, setExportCode] = useState({ html: "", css: "", js: "" });

  const [toasts, setToasts] = useState<Array<{ id: string; message: string }>>([]);

  const canvasRef = useRef<HTMLDivElement | null>(null);

  const sensor = useSensor(PointerSensor, { activationConstraint: { distance: 6 } });
  const dndSensors = useMemo(() => [sensor], [sensor]);

  const selected = useMemo(() => blocks.find((b) => b.id === selectedBlockId) ?? null, [blocks, selectedBlockId]);

  // Load project from NeonDB
  useEffect(() => {
    setProjectId(projectId);
    
    async function load() {
      try {
        const res = await fetch(`/api/projects/${projectId}`);
        const data = await res.json();
        if (data.project?.data) {
          const parsed = data.project.data;
          if (typeof parsed?.pageName === "string") setPageName(parsed.pageName);
          if (parsed?.device === "desktop" || parsed?.device === "tablet" || parsed?.device === "mobile") setDevice(parsed.device as Device);
          if (Array.isArray(parsed?.blocks)) replaceBlocks(parsed.blocks, true);
          setDirty(false);
        }
      } catch (e) {
        console.error("Failed to load project", e);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const handleSaveToCloud = async () => {
    setIsSaving(true);
    try {
      await saveProject(projectId);
      showToast("Saved to database!");
    } catch (e) {
      console.error("Save failed", e);
      showToast("Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  const showToast = (message: string) => {
    const id = Math.random().toString(16).slice(2);
    setToasts((t) => [...t, { id, message: toastEscape(message) }]);
    window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 2300);
  };

  const computeInsertIndex = (over: any, active: any) => {
    if (!over || over.id === "canvas") return blocks.length;
    let idx = blocks.findIndex((b) => b.id === String(over.id));
    if (idx < 0) return blocks.length;

    // Only apply top/bottom relative logic for new items coming from library 
    // because sortable items physically swap places mid-drag.
    const isLibrarySource = active?.data?.current?.source === "library";
    if (isLibrarySource && over.rect && active.rect?.current?.translated) {
      const overCenterY = over.rect.top + over.rect.height / 2;
      const activeCenterY = active.rect.current.translated.top + active.rect.current.translated.height / 2;
      if (activeCenterY > overCenterY) {
        idx += 1; // Insert AFTER this block if dropping in bottom half
      }
    }
    return idx;
  };

  const onGenerateAI = async (prompt: string, style: StylePreset) => {
    try {
      setAiStyle(style);
      showToast("Asking AI for layout...");
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, style }),
      });
      if (!res.ok) throw new Error("AI request failed");
      const data = await res.json();
      if (!data?.blocks || !Array.isArray(data.blocks) || data.blocks.length === 0) throw new Error("Invalid AI response");
      
      const hydratedBlocks = data.blocks.map((b: any) => {
        const base = createBlock(b.type || "text", style);
        return { ...base, props: { ...base.props, ...(b.props || {}) } };
      });
      
      replaceBlocks(hydratedBlocks, true);
      showToast("AI layout generated!");
    } catch (e) {
      console.error(e);
      showToast("Generation failed. Try refining your prompt.");
    }
  };

  const onExport = () => {
    try {
      const html = buildExportHTML({ pageName, blocks });
      const blob = new Blob([html], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "my-website.html";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showToast("Website exported successfully.");
    } catch (e) {
      console.error(e);
      showToast("Export failed in this browser.");
    }
  };

  const onPreview = () => {
    try {
      const html = buildExportHTML({ pageName, blocks, themeColor: previewThemeColor });
      setPreviewHtml(html);
      setPreviewOpen(true);
    } catch (e) {
      console.error(e);
      showToast("Preview failed.");
    }
  };

  const onViewCode = () => {
    try {
      const code = buildExportCode({ pageName, blocks, themeColor: previewThemeColor });
      setExportCode(code);
      setCodeModalOpen(true);
    } catch (e) {
      console.error(e);
      showToast("Code generation failed.");
    }
  };

  const onDeploy = () => {
    try {
      const code = buildExportCode({ pageName, blocks, themeColor: previewThemeColor });
      setExportCode(code);
      setDeployModalOpen(true);
    } catch (e) {
      console.error(e);
      showToast("Code bundling failed.");
    }
  };

  useEffect(() => {
    if (previewOpen) {
      try {
        const html = buildExportHTML({ pageName, blocks, themeColor: previewThemeColor });
        setPreviewHtml(html);
      } catch (e) {
        console.error("Preview update failed", e);
      }
    }
  }, [previewThemeColor, blocks, pageName, previewOpen]);

  const onDragStart = (event: any) => {
    const active = event.active;
    const data = active?.data?.current || {};
    if (data?.source === "library") {
      setDragState({ activeType: data.type, source: "library" });
    } else {
      setDragState({ activeId: String(active.id), source: "canvas" });
    }
  };

  const onDragOver = debounce((event: any) => {
    const active = event.active;
    const over = event.over;
    const data = active?.data?.current || {};

    if (data?.source !== "library") {
      setShowInsertIndicator(false);
      setCanvasHighlighted(false);
      return;
    }

    const idx = computeInsertIndex(over, active);
    setInsertIndex(idx);
    setShowInsertIndicator(true);
    setCanvasHighlighted(true);
  }, 16);

  const onDragEnd = (event: any) => {
    const active = event.active;
    const over = event.over;
    const data = active?.data?.current || {};

    setShowInsertIndicator(false);
    setCanvasHighlighted(false);
    setDragState(null);

    if (!over) return;

    if (data?.source === "library") {
      const idx = computeInsertIndex(over, active);
      insertBlock(data.type as BlockType, idx, aiStyle);
      return;
    }

    // For sortable items we didn't attach a custom `data.source`, so treat any non-library drag
    // whose id exists in our blocks array as a reorder request.
    const fromId = String(active.id);
    const existsInCanvas = blocks.some((b) => b.id === fromId);
    if (existsInCanvas) {
      const targetIndex = computeInsertIndex(over, active);
      moveBlock(fromId, targetIndex);
    }
  };

  const groups = useMemo(() => {
    const g: any = {};
    for (const def of LIB_DEFS) {
      g[def.group] = g[def.group] ?? [];
      g[def.group].push(def);
    }
    return g as Record<string, typeof LIB_DEFS>;
  }, []);

  return (
    <>
      <div className="beamsWrapper">
        <div className="beam beam1" />
        <div className="beam beam2" />
        <div className="beam beam3" />
        <div className="beam beam4" />
      </div>
      <div className="app">
        <div className="topbar">
          <div className="brand" style={{ fontFamily: 'var(--syne)', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => router.push('/dashboard')}>
            <Home size={16} color="rgba(255,255,255,0.6)" />
            Buildify
          </div>
          <div className="topActions">
            <button
              className="btn"
              style={{
                marginRight: "6px",
                borderRadius: "50%",
                padding: "8px",
                width: "36px",
                height: "36px",
                color: "#10b981",
                border: "1px solid rgba(16,185,129,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
              type="button"
              onClick={handleSaveToCloud}
              title="Save to database"
              disabled={isSaving}
            >
              {isSaving ? <Loader2 size={16} className="spinner" /> : <Save size={16} />}
            </button>
            <button className="btn" type="button" onClick={onPreview}>
              <span className="btnIcon"><Eye size={14} /></span> Preview
            </button>
            <button className="btn" type="button" onClick={onViewCode}>
              <span className="btnIcon"><CodeXml size={14} /></span> View Code
            </button>
            <button className="btn" type="button" onClick={onExport}>
              <span className="btnIcon"><Download size={14} /></span> Export
            </button>
            <button className="btn btnPrimary" type="button" onClick={onDeploy}>
              <span className="btnIcon"><Rocket size={14} /></span> Publish
            </button>
            <button className="btn btnViolet" type="button" onClick={() => setAiOpen(true)}>
              <span className="btnIcon"><Sparkles size={14} /></span> AI Generate
            </button>
          </div>
        </div>

        <DndContext
          sensors={dndSensors}
          collisionDetection={closestCenter}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
        >
          <div className="main">
            <aside className="panelLeft">
            <div className="panelHeader">
              <div className="h">Components</div>
              <div className="hint">Drag into canvas</div>
            </div>

            {(["Layout", "Content", "Media", "Forms"] as const).map((grp) => (
              <div className="sectionGroup" key={grp}>
                <div className="sectionTitle">
                  <span>{grp}</span>
                </div>
                <div className="libGrid">
                  {(groups[grp] ?? []).map((d) => (
                    <LibraryCard key={d.type} type={d.type} icon={d.icon} title={d.title} subtitle={d.subtitle} />
                  ))}
                </div>
              </div>
            ))}
            </aside>

            <section className="panelCenter">
            <div className="deviceBar" aria-label="Device toggle">
              <div className="deviceLabel">Device</div>
              <button className={`segBtn ${device === "desktop" ? "active" : ""}`} data-device="desktop" type="button" onClick={() => setDevice("desktop")}>
                <span className="segEmoji"><Monitor size={14} /></span> Desktop
              </button>
              <button className={`segBtn ${device === "tablet" ? "active" : ""}`} data-device="tablet" type="button" onClick={() => setDevice("tablet")}>
                <span className="segEmoji"><Tablet size={14} /></span> Tablet
              </button>
              <button className={`segBtn ${device === "mobile" ? "active" : ""}`} data-device="mobile" type="button" onClick={() => setDevice("mobile")}>
                <span className="segEmoji"><Smartphone size={14} /></span> Mobile
              </button>
              <button 
                className={`segBtn mobileOnlyPropsBtn ${mobilePropsOpen ? "active" : ""}`} 
                type="button" 
                onClick={() => setMobilePropsOpen(!mobilePropsOpen)}
                style={{ marginLeft: "auto" }}
                aria-label="Toggle Properties"
              >
                <span className="segEmoji"><Sliders size={14} /></span> Properties
              </button>
            </div>
            <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
              <Canvas
                blocks={blocks}
                selectedBlockId={selectedBlockId}
                device={device}
                aiStyle={aiStyle}
                insertIndex={insertIndex}
                showInsertIndicator={showInsertIndicator}
                canvasHighlighted={canvasHighlighted}
                onSelectBlock={(id) => {
                  selectBlock(id);
                  setMobilePropsOpen(true);
                }}
                onDeleteBlock={(id) => deleteBlock(id)}
              />
            </SortableContext>

            <DragOverlay>
              {dragState?.source === "library" ? (
                <div className="componentCard" style={{ opacity: 0.95, pointerEvents: "none", cursor: "grabbing" }}>
                  {(() => {
                    const def = LIB_DEFS.find((x) => x.type === dragState.activeType);
                    if (!def) return null;
                    return (
                      <>
                        <div className="cardIcon">{def.icon}</div>
                        <div className="cardText">
                          <div className="cardTitle">{def.title}</div>
                          <div className="cardSub">{def.subtitle}</div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              ) : null}
            </DragOverlay>
          </section>

          <aside className={`panelRight ${mobilePropsOpen ? "mobileOpen" : ""}`}>
            <div className="propsHeader">
              <div className="h">Properties</div>
              <button className="mobilePropsClose" type="button" onClick={() => setMobilePropsOpen(false)}>×</button>
            </div>
            <div className="propsPanel">
              <PropertiesPanel selected={selected} onUpdateProps={updateBlockProps} />
            </div>
            </aside>
          </div>
        </DndContext>

        {aiOpen && (
          <AiGenerateModal
            open={aiOpen}
            initialStyle={aiStyle}
            onClose={() => setAiOpen(false)}
            onGenerate={onGenerateAI}
          />
        )}

        {previewOpen && (
          <div className="previewOverlay show" role="dialog" aria-modal="true" aria-label="Preview" onMouseDown={(e) => (e.currentTarget === e.target ? setPreviewOpen(false) : null)}>
            <div className={`previewCard ${device}`}>
              <div className="previewTop">
                <div className="title">
                  <span className="c-dot" aria-hidden="true" />
                  <span>{pageName} (Preview)</span>
                </div>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <label style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                    Theme Color
                    <input 
                      type="color" 
                      value={previewThemeColor} 
                      onChange={(e) => setPreviewThemeColor(e.target.value)} 
                      style={{ height: "24px", padding: 0, border: "none", cursor: "pointer", background: "transparent" }} 
                    />
                  </label>
                  <button className="closeBtn" type="button" onClick={() => setPreviewOpen(false)}>
                    Close
                  </button>
                </div>
              </div>
              <iframe className="previewFrame" id="previewFrame" title="Website Preview" srcDoc={previewHtml} />
            </div>
          </div>
        )}

        <CodeModal
          open={codeModalOpen}
          onClose={() => setCodeModalOpen(false)}
          html={exportCode.html}
          css={exportCode.css}
          js={exportCode.js}
          pageName={pageName}
        />

        <DeployModal
          open={deployModalOpen}
          onClose={() => setDeployModalOpen(false)}
          html={exportCode.html}
          css={exportCode.css}
          js={exportCode.js}
          pageName={pageName}
        />

        <div className="toastWrap" aria-live="polite" aria-atomic="true">
          {toasts.map((t) => (
            <div key={t.id} className="toast show">
              <div className="dot" aria-hidden="true" />
              <div>{t.message}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
});

