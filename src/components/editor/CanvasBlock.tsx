"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import type { Block } from "@/lib/buildify/types";
import { BlockPreview } from "./BlockPreview";

function titleForType(type: Block["type"]) {
  switch (type) {
    case "hero":
      return "Hero Section";
    case "text":
      return "Text Block";
    case "image":
      return "Image Block";
    case "button":
      return "Button";
    case "featureCards":
      return "Feature Cards (3-grid)";
    case "testimonial":
      return "Testimonial";
    case "contactForm":
      return "Contact Form";
    case "navbar":
      return "Navbar";
    case "footer":
      return "Footer";
    case "faq":
      return "FAQ Section";
    case "video":
      return "Video Embed";
    case "pricing":
      return "Pricing";
    case "gallery":
      return "Image Gallery";
    case "heading":
      return "Section Heading";
    case "newsletter":
      return "Newsletter Form";
    case "stats":
      return "Statistics";
    case "split":
      return "Split Layout (Image + Text)";
    case "logos":
      return "Logo Banner";
    case "buttonGroup":
      return "Button Group";
    default:
      return type;
  }
}

function hintForType(type: Block["type"]) {
  switch (type) {
    case "hero":
      return "Headline, subheadline, CTA";
    case "text":
      return "Text, color, typography";
    case "image":
      return "URL, alt, radius, width";
    case "button":
      return "Label, colors, link";
    case "featureCards":
      return "Three-column highlights";
    case "testimonial":
      return "Quote, author, role";
    case "contactForm":
      return "Name, email, message";
    case "navbar":
      return "Links & branding";
    case "footer":
      return "Copyright & socials";
    case "faq":
      return "Q&A list";
    case "video":
      return "YouTube/Vimeo embed";
    case "pricing":
      return "Plans and features";
    case "gallery":
      return "Grid of images";
    case "heading":
      return "H1, H2, H3 title";
    case "newsletter":
      return "Inline subscribe container";
    case "stats":
      return "Row of metrics/numbers";
    case "split":
      return "50/50 side by side layout";
    case "logos":
      return "Row of customer logos";
    case "buttonGroup":
      return "Primary & Secondary CTAs";
    default:
      return "Component";
  }
}

export function CanvasBlock({
  block,
  selected,
  onSelect,
  onDelete,
}: {
  block: Block;
  selected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  return (
    <div
      ref={setNodeRef}
      className={`blockWrap ${selected ? "selected" : ""}`}
      data-block-id={block.id}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.45 : 1,
      }}
      onClick={onSelect}
    >
      <div className="blockTopRow">
        <div className="dragHandle" aria-label="Drag to reorder" title="Drag to reorder" {...attributes} {...listeners}>
          <GripVertical size={14} />
        </div>
        <div className="blockMeta"></div>
        <div className="blockActions" aria-label="Block actions">
          <button
            className="iconBtn"
            type="button"
            data-action="edit"
            aria-label="Edit block"
            title="Edit"
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
          >
            <span className="iconGlyph"><Pencil size={14} /></span>
          </button>
          <button
            className="iconBtn danger"
            type="button"
            data-action="delete"
            aria-label="Delete block"
            title="Delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <span className="iconGlyph"><Trash2 size={14} /></span>
          </button>
        </div>
      </div>
      <div className="blockInner">
        <BlockPreview block={block} />
      </div>
    </div>
  );
}

