import type { Block, BlockType, Device, StylePreset } from "./types";

function uid() {
  return "b_" + Math.random().toString(16).slice(2) + "_" + Date.now().toString(16);
}

export function createBlock(type: BlockType, stylePreset: StylePreset): Block {
  return {
    id: uid(),
    type,
    props: createDefaultPropsForType(type, stylePreset),
  };
}

export function createDefaultPropsForType(type: BlockType, stylePreset: StylePreset): Record<string, unknown> {
  const sp = stylePreset || "Landing Page";

  const heroByStyle: Record<
    StylePreset,
    { headline: string; subheadline: string; ctaText: string }
  > = {
    Portfolio: {
      headline: "Showcase Your Work",
      subheadline: "A polished portfolio built to highlight projects, skills, and impact.",
      ctaText: "View Projects",
    },
    Business: {
      headline: "Grow Your Business",
      subheadline: "Turn visitors into customers with a clean layout and a strong call to action.",
      ctaText: "Get a Quote",
    },
    "Landing Page": {
      headline: "Launch a Stunning Landing Page",
      subheadline: "A premium, conversion-ready layout you can drag, edit, and export in minutes.",
      ctaText: "Start Now",
    },
    Blog: {
      headline: "Write. Share. Inspire.",
      subheadline: "Publish updates with a layout designed for clarity and reading comfort.",
      ctaText: "Read Latest",
    },
    Restaurant: {
      headline: "Dine in Style",
      subheadline: "Highlight your menu with a refined hero, bold visuals, and an easy contact form.",
      ctaText: "Reserve a Table",
    },
    Agency: {
      headline: "Build Brands That Convert",
      subheadline: "A modern agency layout with highlights, social proof, and a clear next step.",
      ctaText: "Book a Call",
    },
  };

  const heroDefaults = heroByStyle[sp] ?? heroByStyle["Landing Page"];

  switch (type) {
    case "navbar":
      return { brandText: "Buildify", links: ["Home", "Services", "Contact"] };
    case "footer":
      return { copyright: `© ${new Date().getFullYear()} My Website`, socials: ["X", "IG", "YT"] };
    case "hero":
      return {
        headline: heroDefaults.headline,
        subheadline: heroDefaults.subheadline,
        ctaText: heroDefaults.ctaText,
        useGradient: true,
        backgroundColor: "#16213e",
      };
    case "text":
      return {
        text:
          sp === "Blog"
            ? "Welcome to the blog. Share your latest thoughts, updates, and insights with a layout that feels clean, readable, and premium."
            : "Tell your story here. Keep it concise and confident—this block is designed for readability and quick scanning.",
        color: "#0a0a0f",
        fontSize: 16,
        align: "left",
      };
    case "featureCards":
      return {
        cards: [
          { emoji: "⚡", title: "Fast Setup", desc: "Drag blocks into place and customize instantly." },
          { emoji: "🎛️", title: "Live Editing", desc: "Properties update your canvas in real time." },
          { emoji: "🚀", title: "One-Click Export", desc: "Download a complete, responsive HTML page." },
        ],
      };
    case "testimonial":
      return {
        quote:
          sp === "Portfolio"
            ? "Buildify helped me turn my ideas into a real website layout in minutes. The drag workflow feels surprisingly professional."
            : "We replaced our old website quickly. The editor experience is smooth and the export is actually usable.",
        author: sp === "Restaurant" ? "Avery Chen" : "Jordan Lee",
        role: sp === "Restaurant" ? "Food Critic" : "Founder",
      };
    case "contactForm":
      return {
        submitText: sp === "Business" ? "Send Request" : sp === "Restaurant" ? "Send Reservation" : "Send Message",
      };
    case "image":
      return { url: "https://placehold.co/800x400/1a1a2e/00d4ff?text=Image", alt: "Placeholder image", radius: 16, widthPct: 90 };
    case "button":
      return { label: sp === "Landing Page" ? "Get Started" : "Learn More", bgColor: "#00d4ff", radius: 14, linkUrl: "https://example.com" };
    case "faq":
      return {
        faqs: [
          { q: "How does it work?", a: "It is simple and straightforward. Just drag and drop." },
          { q: "Can I use it for free?", a: "Yes, we offer a free tier with all basic features." },
          { q: "Is there customer support?", a: "We provide 24/7 support via email and chat." },
        ],
      };
    case "video":
      return { url: "https://www.youtube.com/embed/dQw4w9WgXcQ", title: "Promo Video" };
    case "pricing":
      return {
        plans: [
          { name: "Basic", price: "$9", features: ["1 Project", "Basic Support"], buttonText: "Choose Basic" },
          { name: "Pro", price: "$29", features: ["Unlimited Projects", "Priority Support", "Custom Domain"], buttonText: "Choose Pro" },
        ],
      };
    case "gallery":
      return {
        images: [
          "https://placehold.co/400x300/1a1a2e/00d4ff?text=Img1",
          "https://placehold.co/400x300/1a1a2e/00d4ff?text=Img2",
          "https://placehold.co/400x300/1a1a2e/00d4ff?text=Img3",
        ]
      };
    case "heading":
      return {
        text: "Section Heading",
        level: "h2", // h1, h2, h3
        align: "center",
      };
    case "newsletter":
      return {
        title: "Subscribe to our Newsletter",
        subtitle: "Get the latest updates directly in your inbox.",
        buttonText: "Subscribe",
      };
    case "stats":
      return {
        stats: [
          { value: "1M+", label: "Active Users" },
          { value: "99%", label: "Uptime" },
          { value: "24/7", label: "Support" },
        ],
      };
    case "split":
      return {
        tagline: "FEATURES",
        headline: "Beautiful side-by-side design",
        description: "Combine imagery and typography seamlessly. Enhance your layout with dynamic components.",
        imageUrl: "https://placehold.co/600x600/1a1a2e/00d4ff?text=Split+Image",
        imageLeft: false, // false = text left, image right
      };
    case "logos":
      return {
        title: "TRUSTED BY",
        logos: [
          "https://placehold.co/120x40/f0f0f0/666?text=LOGO+1",
          "https://placehold.co/120x40/f0f0f0/666?text=LOGO+2",
          "https://placehold.co/120x40/f0f0f0/666?text=LOGO+3",
          "https://placehold.co/120x40/f0f0f0/666?text=LOGO+4",
          "https://placehold.co/120x40/f0f0f0/666?text=LOGO+5",
        ],
      };
    case "buttonGroup":
      return {
        primaryText: "Get Started",
        primaryUrl: "#",
        secondaryText: "Learn More",
        secondaryUrl: "#",
        align: "center",
      };
    default:
      return {};
  }
}

export function presetComponentTypes(style: StylePreset): BlockType[] {
  switch (style) {
    case "Portfolio":
      return ["navbar", "hero", "featureCards", "testimonial", "footer"];
    case "Business":
      return ["navbar", "hero", "featureCards", "contactForm", "footer"];
    case "Landing Page":
      return ["hero", "featureCards", "testimonial", "button", "footer"];
    case "Restaurant":
      return ["navbar", "hero", "image", "contactForm", "footer"];
    case "Blog":
      return ["navbar", "text", "featureCards", "footer"];
    case "Agency":
      return ["navbar", "hero", "featureCards", "testimonial", "footer"];
    default:
      return ["navbar", "hero", "featureCards", "footer"];
  }
}

export const DEFAULT_DEVICE: Device = "desktop";

