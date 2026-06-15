export type Device = "desktop" | "tablet" | "mobile";

export type StylePreset =
  | "Portfolio"
  | "Business"
  | "Landing Page"
  | "Blog"
  | "Restaurant"
  | "Agency";

export type BlockType =
  | "hero"
  | "text"
  | "image"
  | "button"
  | "featureCards"
  | "testimonial"
  | "contactForm"
  | "navbar"
  | "footer"
  | "faq"
  | "video"
  | "pricing"
  | "gallery"
  | "heading"
  | "newsletter"
  | "stats"
  | "split"
  | "logos"
  | "buttonGroup";

export type BaseBlock = {
  id: string;
  type: BlockType;
  props: Record<string, unknown>;
};

export type Block = BaseBlock;

export type BuilderProject = {
  id: string;
  pageName: string;
  device: Device;
  blocks: Block[];
  updatedAt: string;
};

export type AiGenerateRequest = {
  prompt: string;
  style: StylePreset;
};

export type AiGenerateResponse = {
  blocks: Block[];
};

