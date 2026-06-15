"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import type { Block } from "@/lib/buildify/types";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function typeSummary(type: Block["type"]) {
  switch (type) {
    case "text":
      return "Text, typography, alignment";
    case "button":
      return "Label, colors, link";
    case "hero":
      return "Headline, subheadline, CTA + background";
    case "image":
      return "Image URL, alt, radius, width";
    case "featureCards":
      return "Edit the 3 cards";
    case "testimonial":
      return "Quote + author";
    case "contactForm":
      return "Form CTA text";
    case "navbar":
      return "Brand + navigation links";
    case "footer":
      return "Copyright + social placeholders";
    case "faq":
      return "Edit frequently asked questions";
    case "video":
      return "YouTube/Vimeo embed URL";
    case "pricing":
      return "Edit pricing plans";
    case "gallery":
      return "Manage image URLs";
    case "heading":
      return "Heading text and level";
    case "newsletter":
      return "Newsletter title and labels";
    case "stats":
      return "Metrics and values";
    case "split":
      return "Text and image layout";
    case "logos":
      return "Company logos";
    case "buttonGroup":
      return "Primary and secondary CTA";
    default:
      return "Edit this component";
  }
}

function PanelSection({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <details className="propsSection" open>
      <summary>
        <div className="sectionHeading">
          <span>{title}</span>
          <span className="sectionHint">{subtitle}</span>
        </div>
        <span className="sectionToggle">⌄</span>
      </summary>
      <div className="sectionBody">{children}</div>
    </details>
  );
}

export function PropertiesPanel({
  selected,
  onUpdateProps,
}: {
  selected: Block | null;
  onUpdateProps: (id: string, patch: Record<string, unknown>) => void;
}) {
  const [projects, setProjects] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        setProjects(data.projects || []);
      } catch (error) {
        console.error("Failed to fetch projects", error);
      }
    }

    fetchProjects();
  }, []);

  if (!selected) {
    return (
      <div className="propsBody open" id="propsBody">
        <div className="propsEmpty">
          <div className="title">Select a component to edit</div>
          <div className="sub">Click a block on the canvas. Properties will appear here instantly.</div>
        </div>
      </div>
    );
  }

  const p = selected.props as Record<string, any>;
  const update = (patch: Record<string, unknown>) => onUpdateProps(selected.id, patch);

  return (
    <motion.div
      className="propsBody open"
      initial={{ opacity: 0, x: -10, filter: "blur(0.4px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="propsGrid">
        <div className="field panelSummary">
          <label>
            Block type <span className="value">{selected.type}</span>
          </label>
          <div className="fieldNote">{typeSummary(selected.type)}</div>
        </div>

        <PanelSection title="Identity" subtitle="Brand text and heading content">
          {selected.type === "navbar" && (
            <div className="field">
              <label>Brand Text</label>
              <input
                title="Brand Text"
                type="text"
                value={typeof p.brandText === "string" ? p.brandText : ""}
                onChange={(e) => update({ brandText: e.target.value })}
              />
            </div>
          )}
          {selected.type === "hero" && (
            <>
              <div className="field">
                <label>Headline</label>
                <input
                  title="Headline"
                  type="text"
                  value={typeof p.headline === "string" ? p.headline : ""}
                  onChange={(e) => update({ headline: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Subheadline</label>
                <textarea
                  title="Subheadline"
                  value={typeof p.subheadline === "string" ? p.subheadline : ""}
                  onChange={(e) => update({ subheadline: e.target.value })}
                />
              </div>
            </>
          )}
          {selected.type === "heading" && (
            <>
              <div className="field">
                <label>Heading Text</label>
                <input title="Heading Text" type="text" value={typeof p.text === "string" ? p.text : ""} onChange={(e) => update({ text: e.target.value })} />
              </div>
              <div className="field">
                <label>HTML Level</label>
                <select title="HTML Level" value={typeof p.level === "string" ? p.level : "h2"} onChange={(e) => update({ level: e.target.value })}>
                  <option value="h1">H1 (Main Title)</option>
                  <option value="h2">H2 (Section)</option>
                  <option value="h3">H3 (Subsection)</option>
                </select>
              </div>
            </>
          )}
          {selected.type === "text" && (
            <div className="field">
              <label>Text Content</label>
              <textarea
                title="Text Content"
                value={typeof p.text === "string" ? p.text : ""}
                onChange={(e) => update({ text: e.target.value })}
              />
            </div>
          )}
          {selected.type === "button" && (
            <div className="field">
              <label>Button Text</label>
              <input
                title="Button Label"
                type="text"
                value={typeof p.label === "string" ? p.label : "Learn More"}
                onChange={(e) => update({ label: e.target.value })}
              />
            </div>
          )}
          {(!["navbar", "hero", "heading", "text", "button"].includes(selected.type)) && (
            <div className="fieldNote">No identity properties available for this component type.</div>
          )}
        </PanelSection>

        <PanelSection title="Appearance" subtitle="Surface styling and brand colors">
          <div className="field fieldGrid">
            <label>Background Color</label>
            <div className="colorRow">
              <div
                className="colorSwatch"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  border: "2px solid rgba(255,255,255,0.2)",
                  backgroundColor: typeof p.bgColor === "string" ? p.bgColor : "#ffffff",
                  cursor: "pointer",
                  position: "relative"
                }}
                onClick={() => document.getElementById(`bg-color-input-${selected.id}`)?.click()}
              />
              <input
                id={`bg-color-input-${selected.id}`}
                title="Background Color"
                type="color"
                value={typeof p.bgColor === "string" ? p.bgColor : "#ffffff"}
                onChange={(e) => update({ bgColor: e.target.value })}
                style={{ position: "absolute", opacity: 0, width: "1px", height: "1px" }}
              />
              <button className="btn secondary compact" type="button" onClick={() => update({ bgColor: undefined })}>
                Clear
              </button>
            </div>
          </div>

          <div className="field fieldGrid">
            <label>Text Color</label>
            <div className="colorRow">
              <div
                className="colorSwatch"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  border: "2px solid rgba(255,255,255,0.2)",
                  backgroundColor: typeof p.textColor === "string" ? p.textColor : "#000000",
                  cursor: "pointer",
                  position: "relative"
                }}
                onClick={() => document.getElementById(`text-color-input-${selected.id}`)?.click()}
              />
              <input
                id={`text-color-input-${selected.id}`}
                title="Text Color"
                type="color"
                value={typeof p.textColor === "string" ? p.textColor : "#000000"}
                onChange={(e) => update({ textColor: e.target.value })}
                style={{ position: "absolute", opacity: 0, width: "1px", height: "1px" }}
              />
              <button className="btn secondary compact" type="button" onClick={() => update({ textColor: undefined })}>
                Clear
              </button>
            </div>
          </div>
        </PanelSection>

        <PanelSection title="Spacing & Geometry" subtitle="Padding, margin, and layout dimensions">
          {selected.type === "text" && (
            <div className="field">
              <label>
                Font Size <span className="value">{clamp(Number(p.fontSize ?? 16), 12, 28)}px</span>
              </label>
              <input
                title="Font Size"
                type="range"
                min={12}
                max={28}
                value={clamp(Number(p.fontSize ?? 16), 12, 28)}
                onChange={(e) => update({ fontSize: clamp(Number(e.target.value), 12, 28) })}
              />
            </div>
          )}
          {selected.type === "button" && (
            <div className="field fieldGrid">
              <label>Border Radius</label>
              <div className="fieldNote">{clamp(Number(p.radius ?? 14), 0, 28)}px</div>
              <input
                title="Border Radius"
                type="range"
                min={0}
                max={28}
                value={clamp(Number(p.radius ?? 14), 0, 28)}
                onChange={(e) => update({ radius: clamp(Number(e.target.value), 0, 28) })}
              />
            </div>
          )}
          {selected.type === "image" && (
            <>
              <div className="field fieldGrid">
                <label>Border Radius</label>
                <div className="fieldNote">{clamp(Number(p.radius ?? 16), 0, 48)}px</div>
                <input
                  title="Border Radius"
                  type="range"
                  min={0}
                  max={48}
                  value={clamp(Number(p.radius ?? 16), 0, 48)}
                  onChange={(e) => update({ radius: clamp(Number(e.target.value), 0, 48) })}
                />
              </div>
              <div className="field fieldGrid">
                <label>Width</label>
                <div className="fieldNote">{clamp(Number(p.widthPct ?? 90), 30, 100)}%</div>
                <input
                  title="Width Percentage"
                  type="range"
                  min={30}
                  max={100}
                  value={clamp(Number(p.widthPct ?? 90), 30, 100)}
                  onChange={(e) => update({ widthPct: clamp(Number(e.target.value), 30, 100) })}
                />
              </div>
            </>
          )}
          {(!["text", "button", "image"].includes(selected.type)) && (
            <div className="fieldNote">No spacing properties available for this component type.</div>
          )}
        </PanelSection>

        {selected.type === "text" && (
          <PanelSection title="Text Alignment" subtitle="Text alignment options">
            <div className="field">
              <label>Alignment</label>
              <div className="alignRow">
                {(["left", "center", "right"] as const).map((align) => (
                  <button
                    key={align}
                    type="button"
                    className={`pillBtn ${p.align === align ? "active" : ""}`}
                    onClick={() => update({ align })}
                  >
                    {align.charAt(0).toUpperCase() + align.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </PanelSection>
        )}

        {selected.type === "button" && (
          <PanelSection title="Button Destination" subtitle="Link destination and type">
            <div className="field fieldGrid">
              <label>Destination</label>
              <div className="alignRow">
                <button
                  type="button"
                  className={`pillBtn ${p.linkType !== "project" ? "active" : ""}`}
                  onClick={() => update({ linkType: "url" })}
                >
                  External URL
                </button>
                <button
                  type="button"
                  className={`pillBtn ${p.linkType === "project" ? "active" : ""}`}
                  onClick={() => update({ linkType: "project" })}
                >
                  Project
                </button>
              </div>
            </div>
            {p.linkType === "project" ? (
              <div className="field">
                <label>Select Project</label>
                <select
                  title="Select Project"
                  value={typeof p.linkUrl === "string" ? p.linkUrl.replace("/editor/", "") : ""}
                  onChange={(e) => update({ linkUrl: `/editor/${e.target.value}` })}
                >
                  <option value="">Choose a project...</option>
                  {projects.map((proj) => (
                    <option key={proj.id} value={proj.id}>
                      {proj.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="field">
                <label>Link URL</label>
                <input
                  type="text"
                  title="Link URL"
                  value={typeof p.linkUrl === "string" ? p.linkUrl : "https://example.com"}
                  onChange={(e) => update({ linkUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            )}
          </PanelSection>
        )}

        {selected.type === "hero" && (
          <PanelSection title="Hero CTA" subtitle="Call-to-action settings">
            <div className="field">
              <label>CTA Text</label>
              <input
                title="CTA Text"
                type="text"
                value={typeof p.ctaText === "string" ? p.ctaText : ""}
                onChange={(e) => update({ ctaText: e.target.value })}
              />
            </div>
            <div className="field fieldGrid">
              <label>CTA Destination</label>
              <div className="alignRow">
                <button
                  type="button"
                  className={`pillBtn ${p.ctaLinkType !== "project" ? "active" : ""}`}
                  onClick={() => update({ ctaLinkType: "url" })}
                >
                  URL
                </button>
                <button
                  type="button"
                  className={`pillBtn ${p.ctaLinkType === "project" ? "active" : ""}`}
                  onClick={() => update({ ctaLinkType: "project" })}
                >
                  Project
                </button>
              </div>
            </div>
            {p.ctaLinkType === "project" ? (
              <div className="field">
                <label>Select Project</label>
                <select
                  title="Select Project"
                  value={typeof p.ctaLinkUrl === "string" ? p.ctaLinkUrl.replace("/editor/", "") : ""}
                  onChange={(e) => update({ ctaLinkUrl: `/editor/${e.target.value}` })}
                >
                  <option value="">Choose a project...</option>
                  {projects.map((proj) => (
                    <option key={proj.id} value={proj.id}>
                      {proj.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="field">
                <label>CTA Link URL</label>
                <input
                  type="text"
                  title="CTA Link URL"
                  value={typeof p.ctaLinkUrl === "string" ? p.ctaLinkUrl : "#"}
                  onChange={(e) => update({ ctaLinkUrl: e.target.value })}
                />
              </div>
            )}
            <div className="field fieldGrid">
              <label>Background Style</label>
              <div className="alignRow">
                <button
                  type="button"
                  className={`pillBtn ${p.useGradient !== false ? "active" : ""}`}
                  onClick={() => update({ useGradient: true })}
                >
                  Gradient
                </button>
                <button
                  type="button"
                  className={`pillBtn ${p.useGradient === false ? "active" : ""}`}
                  onClick={() => update({ useGradient: false })}
                >
                  Solid
                </button>
              </div>
            </div>
            <div className="field">
              <label>Solid Color</label>
              <input
                title="Solid Color"
                type="color"
                value={typeof p.backgroundColor === "string" ? p.backgroundColor : "#16213e"}
                disabled={p.useGradient !== false}
                onChange={(e) => update({ backgroundColor: e.target.value, useGradient: false })}
              />
            </div>
          </PanelSection>
        )}

        {selected.type === "image" && (
          <PanelSection title="Image Source" subtitle="Image URL and alt text">
            <div className="field">
              <label>Image URL</label>
              <input
                title="Image URL"
                type="text"
                value={typeof p.url === "string" ? p.url : ""}
                onChange={(e) => update({ url: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Alt Text</label>
              <input
                title="Alt Text"
                type="text"
                value={typeof p.alt === "string" ? p.alt : ""}
                onChange={(e) => update({ alt: e.target.value })}
              />
            </div>
          </PanelSection>
        )}

        {selected.type === "featureCards" && (
          <PanelSection title="Feature Cards" subtitle="Update each card quickly">
            <div className="field fieldGrid">
              {(Array.isArray(p.cards) ? p.cards : []).slice(0, 3).map((card: any, idx: number) => (
                <div key={idx} className="cardEditPanel">
                  <div className="field">
                    <label>Card {idx + 1} Emoji</label>
                    <input
                      title="Card Emoji"
                      type="text"
                      value={typeof card?.emoji === "string" ? card.emoji : ""}
                      onChange={(e) => {
                        const nextCards = Array.isArray(p.cards) ? [...p.cards] : [];
                        nextCards[idx] = { ...(nextCards[idx] || {}), emoji: e.target.value };
                        update({ cards: nextCards });
                      }}
                    />
                  </div>
                  <div className="field">
                    <label>Card {idx + 1} Title</label>
                    <input
                      title="Card Title"
                      type="text"
                      value={typeof card?.title === "string" ? card.title : ""}
                      onChange={(e) => {
                        const nextCards = Array.isArray(p.cards) ? [...p.cards] : [];
                        nextCards[idx] = { ...(nextCards[idx] || {}), title: e.target.value };
                        update({ cards: nextCards });
                      }}
                    />
                  </div>
                  <div className="field">
                    <label>Card {idx + 1} Description</label>
                    <textarea
                      title="Card Description"
                      value={typeof card?.desc === "string" ? card.desc : ""}
                      onChange={(e) => {
                        const nextCards = Array.isArray(p.cards) ? [...p.cards] : [];
                        nextCards[idx] = { ...(nextCards[idx] || {}), desc: e.target.value };
                        update({ cards: nextCards });
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </PanelSection>
        )}

        {selected.type === "testimonial" && (
          <PanelSection title="Testimonial" subtitle="Quote, author, and role">
            <div className="field">
              <label>Quote</label>
              <textarea
                title="Quote"
                value={typeof p.quote === "string" ? p.quote : ""}
                onChange={(e) => update({ quote: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Author</label>
              <input
                title="Author"
                type="text"
                value={typeof p.author === "string" ? p.author : ""}
                onChange={(e) => update({ author: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Role</label>
              <input
                title="Role"
                type="text"
                value={typeof p.role === "string" ? p.role : ""}
                onChange={(e) => update({ role: e.target.value })}
              />
            </div>
          </PanelSection>
        )}

        {selected.type === "contactForm" && (
          <PanelSection title="Contact Form" subtitle="Submit button label">
            <div className="field">
              <label>Submit Button Text</label>
              <input
                title="Submit Button Text"
                type="text"
                value={typeof p.submitText === "string" ? p.submitText : "Send Message"}
                onChange={(e) => update({ submitText: e.target.value })}
              />
              <div className="fieldNote">Form fields are styled for a clean, premium experience.</div>
            </div>
          </PanelSection>
        )}

        {selected.type === "navbar" && (
          <PanelSection title="Navigation Links" subtitle="Configure navbar links">
            <div className="field fieldGrid">
              {(Array.isArray(p.links) ? p.links : [{ label: "Home", url: "#" }, { label: "Services", url: "#" }, { label: "Contact", url: "#" }]).slice(0, 5).map((link: any, idx: number) => (
                <div className="cardEditPanel" key={idx}>
                  <div className="field">
                    <label>Link {idx + 1} label</label>
                    <input
                      title="Link label"
                      type="text"
                      value={typeof link?.label === "string" ? link.label : ""}
                      onChange={(e) => {
                        const nextLinks = Array.isArray(p.links) ? [...p.links] : [];
                        nextLinks[idx] = { ...(nextLinks[idx] || {}), label: e.target.value };
                        update({ links: nextLinks });
                      }}
                    />
                  </div>
                  <div className="field">
                    <label>Link {idx + 1} URL</label>
                    <input
                      title="Link URL"
                      type="text"
                      value={typeof link?.url === "string" ? link.url : "#"}
                      onChange={(e) => {
                        const nextLinks = Array.isArray(p.links) ? [...p.links] : [];
                        nextLinks[idx] = { ...(nextLinks[idx] || {}), url: e.target.value };
                        update({ links: nextLinks });
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </PanelSection>
        )}

        {selected.type === "footer" && (
          <>
            <div className="field">
              <label>Copyright Text</label>
              <input title="Copyright Text" type="text" value={typeof p.copyright === "string" ? p.copyright : ""} onChange={(e) => update({ copyright: e.target.value })} />
            </div>
            <div className="field">
              <label>Social Links (up to 4)</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {(Array.isArray(p.socials) ? p.socials : ["X", "IG", "YT"]).slice(0, 4).map((s: any, idx: number) => {
                  const sObj = typeof s === "string" ? { label: s, url: "#" } : s;
                  return (
                    <div key={idx} style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 8, background: "rgba(10,10,15,0.15)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <div style={{ minWidth: 20, fontSize: 10, color: "rgba(255,255,255,0.4)" }}>#{idx + 1}</div>
                        <input
                          type="text"
                          placeholder="Label (e.g. X)"
                          value={sObj.label || ""}
                          onChange={(e) => {
                            const next = Array.isArray(p.socials) ? [...p.socials] : [];
                            next[idx] = { ...sObj, label: e.target.value };
                            update({ socials: next });
                          }}
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Social URL"
                        value={sObj.url || ""}
                        onChange={(e) => {
                          const next = Array.isArray(p.socials) ? [...p.socials] : [];
                          next[idx] = { ...sObj, url: e.target.value };
                          update({ socials: next });
                        }}
                        style={{ fontSize: 11 }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {selected.type === "faq" && (
          <div className="field">
            <label>FAQ Items</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {(Array.isArray(p.faqs) ? p.faqs : []).map((faq: any, idx: number) => (
                <div key={idx} style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 10, background: "rgba(10,10,15,0.20)" }}>
                  <label style={{ fontSize: 12, opacity: 0.95, display: "block", marginBottom: 6 }}>Question {idx + 1}</label>
                  <input
                    title="Question"
                    type="text"
                    value={typeof faq?.q === "string" ? faq.q : ""}
                    onChange={(e) => {
                      const next = Array.isArray(p.faqs) ? [...p.faqs] : [];
                      next[idx] = { ...(next[idx] || {}), q: e.target.value };
                      update({ faqs: next });
                    }}
                  />
                  <label style={{ fontSize: 12, opacity: 0.95, display: "block", marginTop: 8, marginBottom: 6 }}>Answer</label>
                  <textarea
                    title="Answer"
                    value={typeof faq?.a === "string" ? faq.a : ""}
                    onChange={(e) => {
                      const next = Array.isArray(p.faqs) ? [...p.faqs] : [];
                      next[idx] = { ...(next[idx] || {}), a: e.target.value };
                      update({ faqs: next });
                    }}
                  />
                </div>
              ))}
              <button
                type="button"
                className="pillBtn"
                onClick={() => {
                  const next = Array.isArray(p.faqs) ? [...p.faqs] : [];
                  next.push({ q: "New Question", a: "New Answer" });
                  update({ faqs: next });
                }}
              >
                + Add FAQ
              </button>
            </div>
          </div>
        )}

        {selected.type === "video" && (
          <div className="field">
            <label>Embed / Video URL</label>
            <input title="Embed / Video URL" type="text" value={typeof p.url === "string" ? p.url : ""} onChange={(e) => update({ url: e.target.value })} />
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.52)", lineHeight: 1.45, marginTop: 8 }}>
              Use YouTube embed URL e.g., https://www.youtube.com/embed/dQw4w9WgXcQ
            </div>
          </div>
        )}

        {selected.type === "pricing" && (
          <div className="field">
            <label>Pricing Plans</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {(Array.isArray(p.plans) ? p.plans : []).map((plan: any, idx: number) => (
                <div key={idx} style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 10, background: "rgba(10,10,15,0.20)" }}>
                  <label style={{ fontSize: 12, opacity: 0.95, display: "block", marginBottom: 6 }}>Plan {idx + 1} Name</label>
                  <input
                    title="Plan Name"
                    type="text"
                    value={typeof plan?.name === "string" ? plan.name : ""}
                    onChange={(e) => {
                      const next = Array.isArray(p.plans) ? [...p.plans] : [];
                      next[idx] = { ...(next[idx] || {}), name: e.target.value };
                      update({ plans: next });
                    }}
                  />
                  <label style={{ fontSize: 12, opacity: 0.95, display: "block", marginTop: 8, marginBottom: 6 }}>Price</label>
                  <input
                    title="Price"
                    type="text"
                    value={typeof plan?.price === "string" ? plan.price : ""}
                    onChange={(e) => {
                      const next = Array.isArray(p.plans) ? [...p.plans] : [];
                      next[idx] = { ...(next[idx] || {}), price: e.target.value };
                      update({ plans: next });
                    }}
                  />
                  <label style={{ fontSize: 12, opacity: 0.95, display: "block", marginTop: 8, marginBottom: 6 }}>Features (comma separated)</label>
                  <input
                    title="Features"
                    type="text"
                    value={Array.isArray(plan?.features) ? plan.features.join(", ") : ""}
                    onChange={(e) => {
                      const next = Array.isArray(p.plans) ? [...p.plans] : [];
                      next[idx] = { ...(next[idx] || {}), features: e.target.value.split(",").map((s: string) => s.trim()) };
                      update({ plans: next });
                    }}
                  />
                  <label style={{ fontSize: 12, opacity: 0.95, display: "block", marginTop: 8, marginBottom: 6 }}>Button Text</label>
                  <input
                    title="Button Text"
                    type="text"
                    value={typeof plan?.buttonText === "string" ? plan.buttonText : ""}
                    onChange={(e) => {
                      const next = Array.isArray(p.plans) ? [...p.plans] : [];
                      next[idx] = { ...(next[idx] || {}), buttonText: e.target.value };
                      update({ plans: next });
                    }}
                  />
                  
                  <label style={{ fontSize: 12, opacity: 0.95, display: "block", marginTop: 8, marginBottom: 6 }}>Button Link Type</label>
                  <div className="alignRow" style={{ marginBottom: 8 }}>
                    <button
                      type="button"
                      className={`pillBtn ${plan.linkType !== "project" ? "active" : ""}`}
                      onClick={() => {
                        const next = Array.isArray(p.plans) ? [...p.plans] : [];
                        next[idx] = { ...(next[idx] || {}), linkType: "url" };
                        update({ plans: next });
                      }}
                      style={{ fontSize: 10, padding: "2px 8px" }}
                    >
                      URL
                    </button>
                    <button
                      type="button"
                      className={`pillBtn ${plan.linkType === "project" ? "active" : ""}`}
                      onClick={() => {
                        const next = Array.isArray(p.plans) ? [...p.plans] : [];
                        next[idx] = { ...(next[idx] || {}), linkType: "project" };
                        update({ plans: next });
                      }}
                      style={{ fontSize: 10, padding: "2px 8px" }}
                    >
                      Project
                    </button>
                  </div>

                  {plan.linkType === "project" ? (
                    <select
                      title="Select Project"
                      value={typeof plan.linkUrl === "string" ? plan.linkUrl.replace("/editor/", "") : ""}
                      onChange={(e) => {
                        const next = Array.isArray(p.plans) ? [...p.plans] : [];
                        next[idx] = { ...(next[idx] || {}), linkUrl: `/editor/${e.target.value}` };
                        update({ plans: next });
                      }}
                      style={{ fontSize: 11 }}
                    >
                      <option value="">Choose project...</option>
                      {projects.map((proj) => (
                        <option key={proj.id} value={proj.id}>{proj.name}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder="Button Link URL"
                      value={typeof plan?.linkUrl === "string" ? plan.linkUrl : ""}
                      onChange={(e) => {
                        const next = Array.isArray(p.plans) ? [...p.plans] : [];
                        next[idx] = { ...(next[idx] || {}), linkUrl: e.target.value };
                        update({ plans: next });
                      }}
                      style={{ fontSize: 11 }}
                    />
                  )}
                </div>
              ))}
              <button
                type="button"
                className="pillBtn"
                onClick={() => {
                  const next = Array.isArray(p.plans) ? [...p.plans] : [];
                  next.push({ name: "New Plan", price: "$99", features: ["1 Feature"], buttonText: "Select" });
                  update({ plans: next });
                }}
              >
                + Add Plan
              </button>
            </div>
          </div>
        )}

        {selected.type === "gallery" && (
          <div className="field">
            <label>Images</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {(Array.isArray(p.images) ? p.images : []).map((imgUrl: any, idx: number) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ minWidth: 20, fontSize: 12, color: "rgba(255,255,255,0.58)" }}>#{idx + 1}</div>
                  <input
                    title="Image URL"
                    type="text"
                    value={typeof imgUrl === "string" ? imgUrl : ""}
                    onChange={(e) => {
                      const next = Array.isArray(p.images) ? [...p.images] : [];
                      next[idx] = e.target.value;
                      update({ images: next });
                    }}
                  />
                </div>
              ))}
              <button
                type="button"
                className="pillBtn"
                onClick={() => {
                  const next = Array.isArray(p.images) ? [...p.images] : [];
                  next.push("https://placehold.co/400x300/1a1a2e/00d4ff?text=New+Img");
                  update({ images: next });
                }}
              >
                + Add Image
              </button>
            </div>
          </div>
        )}

        {selected.type === "heading" && (
          <PanelSection title="Heading Alignment" subtitle="Text alignment options">
            <div className="field">
              <label>Alignment</label>
              <select title="Alignment" value={typeof p.align === "string" ? p.align : "center"} onChange={(e) => update({ align: e.target.value })}>
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </PanelSection>
        )}

        {selected.type === "newsletter" && (
          <>
            <div className="field">
              <label>Title</label>
              <input title="Title" type="text" value={typeof p.title === "string" ? p.title : ""} onChange={(e) => update({ title: e.target.value })} />
            </div>
            <div className="field">
              <label>Subtitle / Description</label>
              <textarea title="Subtitle" value={typeof p.subtitle === "string" ? p.subtitle : ""} onChange={(e) => update({ subtitle: e.target.value })} />
            </div>
            <div className="field">
              <label>Button Text</label>
              <input title="Button Text" type="text" value={typeof p.buttonText === "string" ? p.buttonText : ""} onChange={(e) => update({ buttonText: e.target.value })} />
            </div>
          </>
        )}

        {selected.type === "stats" && (
          <div className="field">
            <label>Statistics</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {(Array.isArray(p.stats) ? p.stats : []).map((stat: any, idx: number) => (
                <div key={idx} style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 10, background: "rgba(10,10,15,0.20)" }}>
                  <label style={{ fontSize: 12, opacity: 0.95, display: "block", marginBottom: 6 }}>Value</label>
                  <input
                    title="Value"
                    type="text"
                    value={typeof stat?.value === "string" ? stat.value : ""}
                    onChange={(e) => {
                      const next = Array.isArray(p.stats) ? [...p.stats] : [];
                      next[idx] = { ...(next[idx] || {}), value: e.target.value };
                      update({ stats: next });
                    }}
                  />
                  <label style={{ fontSize: 12, opacity: 0.95, display: "block", marginTop: 8, marginBottom: 6 }}>Label</label>
                  <input
                    title="Label"
                    type="text"
                    value={typeof stat?.label === "string" ? stat.label : ""}
                    onChange={(e) => {
                      const next = Array.isArray(p.stats) ? [...p.stats] : [];
                      next[idx] = { ...(next[idx] || {}), label: e.target.value };
                      update({ stats: next });
                    }}
                  />
                </div>
              ))}
              <button
                type="button"
                className="pillBtn"
                onClick={() => {
                  const next = Array.isArray(p.stats) ? [...p.stats] : [];
                  next.push({ value: "100", label: "New Stat" });
                  update({ stats: next });
                }}
              >
                + Add Stat
              </button>
            </div>
          </div>
        )}

        {selected.type === "split" && (
          <>
            <div className="field">
              <label>Tagline</label>
              <input title="Tagline" type="text" value={typeof p.tagline === "string" ? p.tagline : ""} onChange={(e) => update({ tagline: e.target.value })} />
            </div>
            <div className="field">
              <label>Headline</label>
              <textarea title="Headline" value={typeof p.headline === "string" ? p.headline : ""} onChange={(e) => update({ headline: e.target.value })} />
            </div>
            <div className="field">
              <label>Description</label>
              <textarea title="Description" value={typeof p.description === "string" ? p.description : ""} onChange={(e) => update({ description: e.target.value })} />
            </div>
            <div className="field">
              <label>Image URL</label>
              <input title="Image URL" type="text" value={typeof p.imageUrl === "string" ? p.imageUrl : ""} onChange={(e) => update({ imageUrl: e.target.value })} />
            </div>
            <div className="field">
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <input type="checkbox" checked={p.imageLeft === true} onChange={(e) => update({ imageLeft: e.target.checked })} style={{ width: "auto" }} />
                Swap Layout (Image Left)
              </label>
            </div>
          </>
        )}

        {selected.type === "logos" && (
          <>
            <div className="field">
              <label>Title</label>
              <input type="text" value={typeof p.title === "string" ? p.title : ""} onChange={(e) => update({ title: e.target.value })} />
            </div>
            <div className="field">
              <label>Logo Images</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {(Array.isArray(p.logos) ? p.logos : []).map((imgUrl: any, idx: number) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ minWidth: 20, fontSize: 12, color: "rgba(255,255,255,0.58)" }}>#{idx + 1}</div>
                    <input
                      title="Logo URL"
                      type="text"
                      value={typeof imgUrl === "string" ? imgUrl : ""}
                      onChange={(e) => {
                        const next = Array.isArray(p.logos) ? [...p.logos] : [];
                        next[idx] = e.target.value;
                        update({ logos: next });
                      }}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  className="pillBtn"
                  onClick={() => {
                    const next = Array.isArray(p.logos) ? [...p.logos] : [];
                    next.push("https://placehold.co/120x40/f0f0f0/666?text=New");
                    update({ logos: next });
                  }}
                >
                  + Add Logo
                </button>
              </div>
            </div>
          </>
        )}

        {selected.type === "buttonGroup" && (
          <>
            <div className="field">
              <label>Primary Button Text</label>
              <input
                title="Primary Button Text"
                type="text"
                value={typeof p.primaryText === "string" ? p.primaryText : ""}
                onChange={(e) => update({ primaryText: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Primary Button Link Type</label>
              <div className="alignRow">
                <button
                  type="button"
                  className={`pillBtn ${p.primaryLinkType !== "project" ? "active" : ""}`}
                  onClick={() => update({ primaryLinkType: "url" })}
                >
                  URL
                </button>
                <button
                  type="button"
                  className={`pillBtn ${p.primaryLinkType === "project" ? "active" : ""}`}
                  onClick={() => update({ primaryLinkType: "project" })}
                >
                  Project
                </button>
              </div>
              {p.primaryLinkType === "project" ? (
                <select
                  title="Select Project"
                  value={typeof p.primaryUrl === "string" ? p.primaryUrl.replace("/editor/", "") : ""}
                  onChange={(e) => update({ primaryUrl: `/editor/${e.target.value}` })}
                  style={{ marginTop: 8 }}
                >
                  <option value="">Choose a project...</option>
                  {projects.map((proj) => (
                    <option key={proj.id} value={proj.id}>
                      {proj.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={typeof p.primaryUrl === "string" ? p.primaryUrl : ""}
                  onChange={(e) => update({ primaryUrl: e.target.value })}
                  style={{ marginTop: 8 }}
                  placeholder="Primary URL"
                />
              )}
            </div>
            <div className="field">
              <label>Secondary Button Text</label>
              <input
                title="Secondary Button Text"
                type="text"
                value={typeof p.secondaryText === "string" ? p.secondaryText : ""}
                onChange={(e) => update({ secondaryText: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Secondary Button Link Type</label>
              <div className="alignRow">
                <button
                  type="button"
                  className={`pillBtn ${p.secondaryLinkType !== "project" ? "active" : ""}`}
                  onClick={() => update({ secondaryLinkType: "url" })}
                >
                  URL
                </button>
                <button
                  type="button"
                  className={`pillBtn ${p.secondaryLinkType === "project" ? "active" : ""}`}
                  onClick={() => update({ secondaryLinkType: "project" })}
                >
                  Project
                </button>
              </div>
              {p.secondaryLinkType === "project" ? (
                <select
                  title="Select Project"
                  value={typeof p.secondaryUrl === "string" ? p.secondaryUrl.replace("/editor/", "") : ""}
                  onChange={(e) => update({ secondaryUrl: `/editor/${e.target.value}` })}
                  style={{ marginTop: 8 }}
                >
                  <option value="">Choose a project...</option>
                  {projects.map((proj) => (
                    <option key={proj.id} value={proj.id}>
                      {proj.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={typeof p.secondaryUrl === "string" ? p.secondaryUrl : ""}
                  onChange={(e) => update({ secondaryUrl: e.target.value })}
                  style={{ marginTop: 8 }}
                  placeholder="Secondary URL"
                />
              )}
            </div>
            <div className="field">
              <label>Alignment</label>
              <select
                title="Alignment"
                value={typeof p.align === "string" ? p.align : "center"}
                onChange={(e) => update({ align: e.target.value })}
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </>
        )}

      </div>
    </motion.div>
  );
}

