import type { Block, BlockType } from "./types";

function escapeHtml(input: unknown) {
  return String(input ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}` : "0,212,255";
}

function rawComponentHTML(block: Block): string {
  const p = block.props || {};

  switch (block.type as BlockType) {
    case "navbar": {
      const links = Array.isArray(p.links) ? p.links : ["Home", "Services", "Contact"];
      const brandText = typeof p.brandText === "string" ? p.brandText : "Buildify";
      return `
        <nav class="c-nav" aria-label="Navbar">
          <div class="brandLine">
            <span class="c-dot" aria-hidden="true"></span>
            <span>${escapeHtml(brandText)}</span>
          </div>
          <div class="links">
            ${links.slice(0, 5).map((link: any, i: number) => {
              const label = typeof link === "string" ? link : link.label;
              const url = typeof link === "string" ? "#" : (link.url || "#");
              return `<a href="${escapeHtml(url)}" data-link="${i}">${escapeHtml(label)}</a>`;
            }).join("")}
          </div>
        </nav>
      `;
    }

    case "hero": {
      const headline = typeof p.headline === "string" ? p.headline : "Your Amazing Headline";
      const subheadline = typeof p.subheadline === "string" ? p.subheadline : "A short paragraph that supports your headline.";
      const ctaText = typeof p.ctaText === "string" ? p.ctaText : "Get Started";
      const ctaLinkUrl = typeof (p as any).ctaLinkUrl === "string" ? (p as any).ctaLinkUrl : "#";
      const useGradient = p.useGradient !== false;
      const backgroundColor = typeof p.backgroundColor === "string" ? p.backgroundColor : "#16213e";
      return `
        <section class="c-hero ${useGradient ? "gradient" : "solid"}" ${useGradient ? "" : `style="background:${escapeHtml(backgroundColor)};"`}>
          <div class="inner">
            <h1>${escapeHtml(headline)}</h1>
            <p>${escapeHtml(subheadline)}</p>
            <div class="ctaRow">
              <a class="c-btn" href="${escapeHtml(ctaLinkUrl)}">${escapeHtml(ctaText)}</a>
            </div>
          </div>
        </section>
      `;
    }

    case "text": {
      const text = typeof p.text === "string" ? p.text : "Write something...";
      const color = typeof p.color === "string" ? p.color : "#0a0a0f";
      const align = (p.align === "center" || p.align === "right") ? p.align : "left";
      const fontSize = clamp(Number(p.fontSize ?? 16), 12, 28);
      return `
        <section class="c-textBlock" aria-label="Text Block">
          <div class="box">
            <p style="font-size:${fontSize}px; color:${escapeHtml(color)}; text-align:${escapeHtml(align)};">
              ${escapeHtml(text)}
            </p>
          </div>
        </section>
      `;
    }

    case "featureCards": {
      const cards = Array.isArray(p.cards) ? p.cards : [];
      const safeCards =
        cards.length
          ? cards.slice(0, 3)
          : [
              { emoji: "⚡", title: "Fast Setup", desc: "Drag blocks into place." },
              { emoji: "🎛️", title: "Live Editing", desc: "Edit and see updates instantly." },
              { emoji: "🚀", title: "Export Ready", desc: "Download a complete HTML file." },
            ];

      return `
        <section class="c-features" aria-label="Feature Cards">
          <div class="grid">
            ${safeCards
              .map((c: any) => {
                const emoji = typeof c.emoji === "string" ? c.emoji : "✨";
                const title = typeof c.title === "string" ? c.title : "Feature";
                const desc = typeof c.desc === "string" ? c.desc : "Description";
                return `
                  <div class="c-fcard">
                    <div class="top">
                      <div class="c-emoji" aria-hidden="true">${escapeHtml(emoji)}</div>
                      <h3>${escapeHtml(title)}</h3>
                    </div>
                    <p>${escapeHtml(desc)}</p>
                  </div>
                `;
              })
              .join("")}
          </div>
        </section>
      `;
    }

    case "testimonial": {
      const quote = typeof p.quote === "string" ? p.quote : "This product is incredible.";
      const author = typeof p.author === "string" ? p.author : "Author Name";
      const role = typeof p.role === "string" ? p.role : "Role / Title";
      return `
        <section class="c-testimonial" aria-label="Testimonial">
          <div class="wrap">
            <div class="c-avatar" aria-hidden="true">👤</div>
            <div style="flex:1; min-width:0;">
              <blockquote>“${escapeHtml(quote)}”</blockquote>
              <div class="c-author">
                <strong>${escapeHtml(author)}</strong>
                <span>${escapeHtml(role)}</span>
              </div>
            </div>
          </div>
        </section>
      `;
    }

    case "contactForm": {
      const submitText = typeof p.submitText === "string" ? p.submitText : "Send Message";
      return `
        <section class="c-form" aria-label="Contact Form">
          <form class="formBox" onsubmit="event.preventDefault();">
            <div>
              <label>Name</label>
              <input type="text" placeholder="Your name" required />
            </div>
            <div>
              <label>Email</label>
              <input type="email" placeholder="you@example.com" required />
            </div>
            <div class="fieldFull">
              <label>Message</label>
              <textarea placeholder="Write your message..."></textarea>
            </div>
            <div class="c-submitRow">
              <button class="c-submitBtn" type="submit">${escapeHtml(submitText)}</button>
            </div>
          </form>
        </section>
      `;
    }

    case "image": {
      const url = typeof p.url === "string" ? p.url : "https://placehold.co/800x400/1a1a2e/00d4ff?text=Image";
      const alt = typeof p.alt === "string" ? p.alt : "Image";
      const radius = clamp(Number(p.radius ?? 16), 0, 48);
      const widthPct = clamp(Number(p.widthPct ?? 90), 30, 100);
      return `
        <section class="c-imageBlock" aria-label="Image Block">
          <div class="imgBox">
            <img src="${escapeHtml(url)}" alt="${escapeHtml(alt)}" style="width:${widthPct}%; border-radius:${radius}px;" />
          </div>
        </section>
      `;
    }

    case "button": {
      const label = typeof p.label === "string" ? p.label : "Learn More";
      const bgColor = typeof p.bgColor === "string" ? p.bgColor : "#00d4ff";
      const radius = clamp(Number(p.radius ?? 14), 0, 28);
      const linkUrl = typeof p.linkUrl === "string" ? p.linkUrl : "#";
      return `
        <section class="c-inlineButton" aria-label="Button">
          <div class="btnWrap">
            <a class="c-linkBtn" href="${escapeHtml(linkUrl)}" style="background:${escapeHtml(bgColor)}; border-radius:${radius}px;">
              ${escapeHtml(label)}
            </a>
          </div>
        </section>
      `;
    }

    case "faq": {
      const faqs = Array.isArray(p.faqs) ? p.faqs : [];
      return `
        <section class="c-faq" aria-label="FAQ">
          <div class="faqBox">
            <h2>Frequently Asked Questions</h2>
            <div class="faqList">
              ${faqs.map((f: any) => `
                <details class="faqItem">
                  <summary>${escapeHtml(f.q || "Question?")}</summary>
                  <p>${escapeHtml(f.a || "Answer")}</p>
                </details>
              `).join("")}
            </div>
          </div>
        </section>
      `;
    }

    case "video": {
      const url = typeof p.url === "string" ? p.url : "";
      return `
        <section class="c-videoBlock" aria-label="Video Embed">
          <div class="videoBox">
            <iframe src="${escapeHtml(url)}" frameborder="0" allowfullscreen></iframe>
          </div>
        </section>
      `;
    }

    case "pricing": {
      const plans = Array.isArray(p.plans) ? p.plans : [];
      return `
        <section class="c-pricing" aria-label="Pricing">
          <div class="pricingGrid">
            ${plans.map((plan: any) => `
              <div class="c-pricingCard">
                <h3>${escapeHtml(plan.name || "Plan")}</h3>
                <div class="price">${escapeHtml(plan.price || "$0")}</div>
                <ul class="features">
                  ${(Array.isArray(plan.features) ? plan.features : []).map((feat: any) => `<li>${escapeHtml(feat)}</li>`).join("")}
                </ul>
                <a href="${escapeHtml(plan.linkUrl || "#")}" class="c-pricingBtn">${escapeHtml(plan.buttonText || "Choose")}</a>
              </div>
            `).join("")}
          </div>
        </section>
      `;
    }

    case "gallery": {
      const images = Array.isArray(p.images) ? p.images : [];
      return `
        <section class="c-gallery" aria-label="Image Gallery">
          <div class="galleryGrid">
            ${images.map((img: any) => `
              <div class="c-galleryItem">
                <img src="${escapeHtml(img)}" alt="Gallery image" />
              </div>
            `).join("")}
          </div>
        </section>
      `;
    }

    case "heading": {
      const text = typeof p.text === "string" ? p.text : "Heading";
      const lvl = p.level === "h1" || p.level === "h3" ? p.level : "h2";
      const align = p.align === "left" || p.align === "right" ? p.align : "center";
      return `
        <section class="c-headingBlock" aria-label="Heading" style="text-align:${escapeHtml(align)};">
          <div class="wrap">
            <${lvl}>${escapeHtml(text)}</${lvl}>
          </div>
        </section>
      `;
    }

    case "newsletter": {
      const title = typeof p.title === "string" ? p.title : "Subscribe";
      const subtitle = typeof p.subtitle === "string" ? p.subtitle : "Get the latest updates.";
      const buttonText = typeof p.buttonText === "string" ? p.buttonText : "Subscribe";
      return `
        <section class="c-newsletter" aria-label="Newsletter">
          <div class="nlBox">
            <h2>${escapeHtml(title)}</h2>
            <p>${escapeHtml(subtitle)}</p>
            <form onsubmit="event.preventDefault();" class="nlForm">
              <input type="email" placeholder="Enter your email" required />
              <button type="submit" class="c-submitBtn c-btn">${escapeHtml(buttonText)}</button>
            </form>
          </div>
        </section>
      `;
    }

    case "stats": {
      const stats = Array.isArray(p.stats) ? p.stats : [];
      return `
        <section class="c-stats" aria-label="Statistics">
          <div class="statsGrid">
            ${stats.map((s: any) => `
              <div class="statItem">
                <div class="sVal">${escapeHtml(s.value)}</div>
                <div class="sLab">${escapeHtml(s.label)}</div>
              </div>
            `).join("")}
          </div>
        </section>
      `;
    }

    case "split": {
      const img = typeof p.image === "string" ? p.image : "https://images.unsplash.com/photo-1498050108023-c5249f4df085";
      const tagline = typeof p.tagline === "string" ? p.tagline : "Features";
      const headline = typeof p.headline === "string" ? p.headline : "Discover our amazing features";
      const desc = typeof p.desc === "string" ? p.desc : "This is a great place to elaborate on your feature. A 50/50 split is highly effective.";
      const imgLeft = p.imageLeft === true;
      return `
        <section class="c-split ${imgLeft ? "img-left" : "img-right"}" aria-label="Split Section">
          <div class="splitWrap">
            <div class="splitText">
              ${tagline ? `<div class="tagline">${escapeHtml(tagline)}</div>` : ""}
              <h2>${escapeHtml(headline)}</h2>
              <p>${escapeHtml(desc)}</p>
            </div>
            <div class="splitImg">
              <img src="${escapeHtml(img)}" alt="Split feature" />
            </div>
          </div>
        </section>
      `;
    }

    case "logos": {
      const title = typeof p.title === "string" ? p.title : "TRUSTED BY";
      const logos = Array.isArray(p.logos) ? p.logos : [];
      return `
        <section class="c-logos" aria-label="Logos">
          <div class="logoWrap">
            ${title ? `<div class="lTitle">${escapeHtml(title)}</div>` : ""}
            <div class="lGrid">
              ${logos.map((l: any) => `<img src="${escapeHtml(l)}" alt="Partner logo" />`).join("")}
            </div>
          </div>
        </section>
      `;
    }

    case "buttonGroup": {
      const pt = typeof p.primaryText === "string" ? p.primaryText : "Primary";
      const pu = typeof p.primaryUrl === "string" ? p.primaryUrl : "#";
      const st = typeof p.secondaryText === "string" ? p.secondaryText : "Secondary";
      const su = typeof p.secondaryUrl === "string" ? p.secondaryUrl : "#";
      const align = p.align === "left" || p.align === "right" ? p.align : "center";
      return `
        <section class="c-btnGroupWrap" style="text-align:${escapeHtml(align)};">
          <div class="btnGroup">
            <a href="${escapeHtml(pu)}" class="c-btn">${escapeHtml(pt)}</a>
            <a href="${escapeHtml(su)}" class="c-btn secondary">${escapeHtml(st)}</a>
          </div>
        </section>
      `;
    }

    case "footer": {
      const copyright = typeof p.copyright === "string" ? p.copyright : `© ${new Date().getFullYear()} My Website`;
      const socials = Array.isArray(p.socials) ? p.socials : ["X", "IG", "YT"];
      return `
        <footer class="c-footer" aria-label="Footer">
          <div style="font-family: var(--mono); font-size: 13px; color: rgba(255,255,255,0.74);">${escapeHtml(copyright)}</div>
          <div class="social" aria-hidden="true">
            ${socials.slice(0, 4).map((s: any) => {
              const label = typeof s === "string" ? s : s.label;
              const url = typeof s === "string" ? "#" : (s.url || "#");
              return `<a href="${escapeHtml(url)}" class="c-socialIcon" style="text-decoration:none;">${escapeHtml(String(label || "").trim() ? label : " ")}</a>`;
            }).join("")}
          </div>
        </footer>
      `;
    }

    default:
      return `<section style="padding:18px; color:#0a0a0f;">Unknown component: ${escapeHtml(block.type)}</section>`;
  }
}

function componentHTML(block: Block): string {
  let html = rawComponentHTML(block);
  const p = block.props || {};

  if (p.bgColor || p.textColor) {
    const uniqueId = `b-${block.id}`;
    html = html.replace(/^(\s*<[a-zA-Z0-9\-]+)(\s|>)/i, `$1 id="${uniqueId}"$2`);

    const cssRules = [];
    if (p.bgColor) {
      cssRules.push(`#${uniqueId} { background: ${escapeHtml(p.bgColor as string)} !important; }`);
    }
    if (p.textColor) {
      cssRules.push(`#${uniqueId}, #${uniqueId} * { color: ${escapeHtml(p.textColor as string)} !important; }`);
    }

    const styleBlock = `<style>${cssRules.join(" ")}</style>\\n`;
    html = styleBlock + html;
  }

  return html;
}

export function generateStyles(themeColor?: string): string {
  let styles = `
    :root{ --accent:#00d4ff; --accent2:#7c3aed; --mono: DM Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono","Courier New", monospace; }
    body{ margin:0; font-family: var(--mono); background:#ffffff; color:#101018; }
    a{ color:inherit; }

    .c-nav{ background:#101018; color:#fff; padding:14px 18px; display:flex; align-items:center; justify-content:space-between; gap:12px; border-bottom: 1px solid rgba(255,255,255,0.06); }
    .c-nav .brandLine{ display:flex; align-items:center; gap:10px; font-weight:800; letter-spacing:0.2px; }
    .c-dot{ width:10px; height:10px; border-radius:50%; background: var(--accent); box-shadow: 0 0 22px rgba(0,212,255,0.35); }
    .c-nav .links{ display:flex; align-items:center; gap:14px; flex-wrap:wrap; justify-content:flex-end; }
    .c-nav a{ color: rgba(255,255,255,0.80); text-decoration:none; font-size:13px; padding:6px 10px; border-radius:999px; border:1px solid transparent; transition: border-color 200ms cubic-bezier(0.4,0,0.2,1), background 200ms cubic-bezier(0.4,0,0.2,1), color 200ms cubic-bezier(0.4,0,0.2,1); }
    .c-nav a:hover{ border-color: rgba(0,212,255,0.35); background: rgba(0,212,255,0.08); color:#fff; }

    .c-hero{ padding:54px 18px; color: rgba(255,255,255,0.95); position:relative; overflow:hidden; background: linear-gradient(135deg, #1a1a2e, #16213e); }
    .c-hero.gradient:before{ content:""; position:absolute; inset:-2px; background: radial-gradient(520px 280px at 10% 10%, rgba(0,212,255,0.28), transparent 60%), radial-gradient(520px 280px at 88% 0%, rgba(124,58,237,0.28), transparent 55%); pointer-events:none; opacity:0.9; }
    .c-hero.solid:before{ content:""; position:absolute; inset:-2px; background: radial-gradient(520px 280px at 15% 0%, rgba(255,255,255,0.14), transparent 60%); pointer-events:none; opacity:0.9; }
    .c-hero .inner{ position:relative; z-index:1; max-width:980px; margin:0 auto; display:flex; flex-direction:column; gap:14px; align-items:flex-start; }
    .c-hero h1{ font-family: Syne, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; font-weight:800; font-size:42px; line-height:1.05; margin:0; }
    .c-hero p{ margin:0; color: rgba(255,255,255,0.82); max-width:720px; font-size:15px; line-height:1.6; }
    .c-hero .ctaRow{ margin-top:8px; display:flex; gap:12px; flex-wrap:wrap; }

    .c-btn{ display:inline-flex; align-items:center; justify-content:center; padding:12px 16px; border-radius:14px; border:1px solid rgba(0,212,255,0.50); background: rgba(0,212,255,0.16); color:#fff; text-decoration:none; font-weight:700; letter-spacing:0.2px; box-shadow: 0 0 0 4px rgba(0,212,255,0.10), 0 0 24px rgba(0,212,255,0.22); transition: transform 200ms cubic-bezier(0.4,0,0.2,1), filter 200ms cubic-bezier(0.4,0,0.2,1); user-select:none; }
    .c-btn:hover{ transform: translateY(-1px); filter: brightness(1.06); }

    .c-textBlock{ padding:26px 18px; background:#fff; }
    .c-textBlock .box{ max-width:860px; margin:0 auto; padding:18px 16px; border-radius:14px; border:1px solid rgba(0,0,0,0.06); background:#fff; }
    .c-textBlock p{ margin:0; font-size:16px; line-height:1.75; color: rgba(10,10,15,0.84); word-break:break-word; }

    .c-features{ padding:34px 18px; background:#fff; }
    .c-features .grid{ max-width:980px; margin:0 auto; display:grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap:14px; }
    .c-fcard{ border-radius:16px; border:1px solid rgba(0,0,0,0.06); background:#fff; padding:16px 14px; box-shadow: 0 10px 30px rgba(0,0,0,0.06); transition: transform 200ms cubic-bezier(0.4,0,0.2,1), box-shadow 200ms cubic-bezier(0.4,0,0.2,1); }
    .c-fcard:hover{ transform: translateY(-2px); box-shadow: 0 18px 50px rgba(0,0,0,0.10); }
    .c-fcard .top{ display:flex; align-items:center; gap:10px; margin-bottom:8px; }
    .c-emoji{ width:38px; height:38px; border-radius:14px; background: rgba(0,212,255,0.08); border:1px solid rgba(0,212,255,0.18); display:flex; align-items:center; justify-content:center; font-size:16px; box-shadow: inset 0 1px 0 rgba(255,255,255,0.03); }
    .c-fcard h3{ margin:0; font-size:15px; color: rgba(10,10,15,0.86); font-family: Syne, ui-sans-serif, system-ui; font-weight:800; letter-spacing:0.1px; }
    .c-fcard p{ margin:0; color: rgba(10,10,15,0.62); font-size:13px; line-height:1.55; }

    @media (max-width:860px){
      .c-features .grid{ grid-template-columns: 1fr; }
    }

    .c-testimonial{ padding:34px 18px; background:#fff; }
    .c-testimonial .wrap{ max-width:980px; margin:0 auto; display:flex; gap:16px; align-items:flex-start; border-radius:18px; border:1px solid rgba(0,0,0,0.06); background:#fff; padding:18px 16px; }
    .c-testimonial blockquote{ margin:0; font-style:italic; color: rgba(10,10,15,0.78); line-height:1.65; font-size:15px; flex:1; }
    .c-avatar{ width:52px; height:52px; border-radius:999px; background: radial-gradient(circle at 30% 20%, rgba(0,212,255,0.22), rgba(124,58,237,0.12)); border:1px solid rgba(0,0,0,0.06); box-shadow:0 16px 40px rgba(0,0,0,0.08); flex:0 0 auto; display:flex; align-items:center; justify-content:center; color: rgba(10,10,15,0.55); font-weight:800; }
    .c-author{ margin-top:12px; display:flex; flex-direction:column; gap:2px; font-size:13px; color: rgba(10,10,15,0.65); }
    .c-author strong{ font-family: Syne, ui-sans-serif, system-ui; color: rgba(10,10,15,0.82); font-weight:900; letter-spacing:0.2px; }

    .c-form{ padding:34px 18px; background:#fff; }
    .c-form .formBox{ max-width:980px; margin:0 auto; border-radius:18px; border:1px solid rgba(0,0,0,0.06); background:#fff; padding:18px 16px; display:grid; grid-template-columns: 1fr 1fr; gap:12px; }
    .c-form .fieldFull{ grid-column: 1 / -1; }
    .c-form label{ font-size:12px; color: rgba(10,10,15,0.62); display:block; margin-bottom:6px; }
    .c-form input, .c-form textarea{ width:100%; border-radius:14px; border:1px solid rgba(0,0,0,0.12); padding:11px 12px; font-family: DM Mono, ui-monospace, monospace; font-size:13px; outline:none; background:#fff; color: rgba(10,10,15,0.85); }
    .c-form textarea{ min-height:104px; resize: vertical; }
    .c-submitRow{ grid-column: 1 / -1; display:flex; justify-content:flex-start; align-items:center; margin-top:4px; gap:10px; flex-wrap:wrap; }
    .c-submitBtn{ border:none; cursor:pointer; padding:12px 16px; border-radius:14px; font-family: DM Mono, ui-monospace, monospace; font-weight:800; letter-spacing:0.2px; background: rgba(0,212,255,0.16); border:1px solid rgba(0,212,255,0.50); color:#fff; box-shadow: 0 0 0 4px rgba(0,212,255,0.10); transition: transform 200ms cubic-bezier(0.4,0,0.2,1), filter 200ms cubic-bezier(0.4,0,0.2,1); user-select:none; }
    .c-submitBtn:hover{ transform: translateY(-1px); filter: brightness(1.06); }

    @media (max-width:860px){
      .c-form .formBox{ grid-template-columns: 1fr; }
    }

    .c-imageBlock{ padding:24px 18px; background:#fff; }
    .c-imageBlock .imgBox{ max-width:980px; margin:0 auto; border-radius:18px; border:1px solid rgba(0,0,0,0.06); background:#fff; padding:14px; display:flex; justify-content:center; align-items:center; }
    .c-imageBlock img{ max-width:100%; height:auto; border-radius:14px; display:block; border:1px solid rgba(0,0,0,0.05); box-shadow: 0 18px 50px rgba(0,0,0,0.08); }

    .c-inlineButton{ padding:24px 18px; background:#fff; display:flex; justify-content:center; align-items:center; }
    .c-inlineButton .btnWrap{ max-width:980px; width:100%; display:flex; justify-content:center; align-items:center; padding:14px 8px; }
    .c-linkBtn{ display:inline-flex; align-items:center; justify-content:center; padding:12px 18px; border-radius:14px; border:1px solid rgba(0,0,0,0.10); color:#fff; font-weight:900; text-decoration:none; transition: transform 200ms cubic-bezier(0.4,0,0.2,1), filter 200ms cubic-bezier(0.4,0,0.2,1), box-shadow 200ms cubic-bezier(0.4,0,0.2,1); box-shadow: 0 16px 40px rgba(0,0,0,0.10); min-width:140px; text-align:center; user-select:none; }
    .c-linkBtn:hover{ transform: translateY(-1px); filter: brightness(1.06); box-shadow: 0 22px 60px rgba(0,0,0,0.14); }

    .c-faq{ padding:44px 18px; background:#fff; }
    .c-faq .faqBox{ max-width:800px; margin:0 auto; }
    .c-faq h2{ text-align:center; margin:0 0 24px 0; font-family: Syne, ui-sans-serif, system-ui; font-weight:800; font-size:28px; }
    .faqItem{ border-bottom: 1px solid rgba(0,0,0,0.08); padding: 16px 0; }
    .faqItem summary{ font-weight:700; cursor:pointer; list-style:none; outline:none; color: rgba(10,10,15,0.9); font-size: 16px; display:flex; justify-content:space-between; align-items:center; }
    .faqItem summary::-webkit-details-marker { display:none; }
    .faqItem summary::after{ content:"+"; font-size:20px; color:var(--accent); }
    .faqItem[open] summary::after{ content:"-"; }
    .faqItem p{ margin: 12px 0 0 0; color: rgba(10,10,15,0.65); line-height: 1.6; font-size: 15px; }

    .c-videoBlock{ padding:34px 18px; background:#fff; }
    .c-videoBlock .videoBox{ max-width:980px; margin:0 auto; aspect-ratio: 16/9; background:#101018; border-radius:18px; overflow:hidden; border:1px solid rgba(0,0,0,0.06); box-shadow: 0 18px 50px rgba(0,0,0,0.08); }
    .c-videoBlock iframe{ width:100%; height:100%; border:none; }

    .c-pricing{ padding:54px 18px; background:#fff; }
    .c-pricing .pricingGrid{ max-width:980px; margin:0 auto; display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:24px; }
    .c-pricingCard{ background:#fff; border:1px solid rgba(0,0,0,0.08); border-radius:18px; padding:32px 24px; text-align:center; box-shadow: 0 12px 40px rgba(0,0,0,0.04); display:flex; flex-direction:column; align-items:center; }
    .c-pricingCard h3{ margin:0; font-family: Syne, ui-sans-serif, system-ui; font-size:20px; font-weight:800; color: rgba(10,10,15,0.8); }
    .c-pricingCard .price{ font-size:42px; font-family: Syne, ui-sans-serif, system-ui; font-weight:900; margin:16px 0; color: rgba(10,10,15,0.95); }
    .c-pricingCard .features{ list-style:none; padding:0; margin:0 0 24px 0; display:flex; flex-direction:column; gap:12px; font-size:15px; color: rgba(10,10,15,0.65); width:100%; }
    .c-pricingBtn{ display:inline-block; margin-top:auto; padding:12px 24px; background: rgba(0,212,255,0.1); border:1px solid rgba(0,212,255,0.5); color:#000; border-radius:999px; text-decoration:none; font-weight:700; width:100%; transition: all 200ms ease; }
    .c-pricingBtn:hover{ background: rgba(0,212,255,0.2); }

    .c-gallery{ padding:34px 18px; background:#fff; }
    .c-gallery .galleryGrid{ max-width:980px; margin:0 auto; display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:16px; }
    .c-galleryItem{ border-radius:14px; overflow:hidden; aspect-ratio:4/3; background:#f0f0f0; border:1px solid rgba(0,0,0,0.06); }
    .c-galleryItem img{ width:100%; height:100%; object-fit:cover; display:block; }

    .c-headingBlock{ padding:34px 18px; background:#fff; }
    .c-headingBlock .wrap{ max-width:980px; margin:0 auto; }
    .c-headingBlock h1{ font-size:48px; margin:0; font-family: Syne, ui-sans-serif, system-ui; font-weight:900; color: rgba(10,10,15,0.95); line-height: 1.1; }
    .c-headingBlock h2{ font-size:36px; margin:0; font-family: Syne, ui-sans-serif, system-ui; font-weight:800; color: rgba(10,10,15,0.9); line-height: 1.2; }
    .c-headingBlock h3{ font-size:24px; margin:0; font-family: Syne, ui-sans-serif, system-ui; font-weight:700; color: rgba(10,10,15,0.85); line-height: 1.3; }

    .c-newsletter{ padding:54px 18px; background:#f8f9fa; text-align:center; }
    .c-newsletter .nlBox{ max-width:600px; margin:0 auto; }
    .c-newsletter h2{ margin:0 0 12px; font-family: Syne, ui-sans-serif, system-ui; font-weight:800; font-size:32px; color: rgba(10,10,15,0.9); }
    .c-newsletter p{ margin:0 0 24px; color: rgba(10,10,15,0.65); font-size:16px; line-height:1.6; }
    .c-newsletter .nlForm{ display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }
    .c-newsletter input{ flex:1; min-width:240px; border-radius:14px; border:1px solid rgba(0,0,0,0.12); padding:12px 18px; font-family: DM Mono, ui-monospace, monospace; font-size:14px; outline:none; background:#fff; }

    .c-stats{ padding:54px 18px; background:#101018; color:#fff; }
    .c-stats .statsGrid{ max-width:980px; margin:0 auto; display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:24px; text-align:center; }
    .c-stats .sVal{ font-size:54px; font-family: Syne, ui-sans-serif, system-ui; font-weight:900; color:var(--accent); line-height:1; margin-bottom:8px; }
    .c-stats .sLab{ font-size:14px; color: rgba(255,255,255,0.7); text-transform:uppercase; letter-spacing:1px; font-weight:700; }

    .c-split{ padding:54px 18px; background:#fff; overflow:hidden; }
    .c-split .splitWrap{ max-width:1100px; margin:0 auto; display:flex; gap:48px; align-items:center; }
    .c-split.img-left .splitWrap{ flex-direction:row-reverse; }
    .c-split .splitText{ flex:1; min-width:300px; }
    .c-split .tagline{ font-size:13px; font-weight:800; color:var(--accent); text-transform:uppercase; letter-spacing:1.5px; margin-bottom:12px; }
    .c-split h2{ font-size:38px; font-family: Syne, ui-sans-serif, system-ui; font-weight:800; margin:0 0 16px; color: rgba(10,10,15,0.9); line-height:1.1; }
    .c-split p{ font-size:16px; line-height:1.7; color: rgba(10,10,15,0.65); margin:0; }
    .c-split .splitImg{ flex:1; min-width:300px; border-radius:24px; overflow:hidden; box-shadow: 0 24px 60px rgba(0,0,0,0.08); font-size:0; }
    .c-split .splitImg img{ width:100%; height:auto; display:block; }
    @media (max-width:860px){
      .c-split .splitWrap{ flex-direction:column-reverse !important; gap:32px; text-align:center; }
      .c-split .splitImg{ width:100%; border-radius:16px; }
    }

    .c-logos{ padding:44px 18px; background:#fff; border-bottom: 1px solid rgba(0,0,0,0.04); }
    .c-logos .logoWrap{ max-width:980px; margin:0 auto; text-align:center; }
    .c-logos .lTitle{ font-size:12px; font-weight:700; color: rgba(10,10,15,0.4); text-transform:uppercase; letter-spacing:2px; margin-bottom:24px; }
    .c-logos .lGrid{ display:flex; justify-content:center; gap:40px; flex-wrap:wrap; align-items:center; opacity:0.6; filter: grayscale(100%); transition: filter 300ms, opacity 300ms; }
    .c-logos .lGrid:hover{ filter: grayscale(50%); opacity:0.9; }
    .c-logos .lGrid img{ max-height:32px; width:auto; display:block; }

    .c-btnGroupWrap{ padding:24px 18px; background:#fff; }
    .c-btnGroupWrap .btnGroup{ display:inline-flex; gap:12px; flex-wrap:wrap; justify-content:center; }
    .c-btn.secondary{ background:transparent; border-color:rgba(0,0,0,0.15); color:rgba(10,10,15,0.85); box-shadow:none; }
    .c-btn.secondary:hover{ background:rgba(0,0,0,0.04); border-color:rgba(0,0,0,0.25); color:#000; }

    .c-footer{ padding:22px 18px; background:#0f0f18; color: rgba(255,255,255,0.78); text-align:center; border-top: 1px solid rgba(255,255,255,0.06); }
    .c-footer .social{ display:flex; justify-content:center; gap:10px; margin:12px 0 6px; flex-wrap:wrap; }
    .c-socialIcon{ width:36px; height:36px; border-radius:14px; background: rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.10); color: rgba(255,255,255,0.70); display:flex; align-items:center; justify-content:center; font-size:14px; }
  `;

  const themeHex = themeColor || "#00d4ff";
  const themeRgb = hexToRgb(themeHex);

  if (themeHex.toLowerCase() !== "#00d4ff") {
    styles = styles.replaceAll("#00d4ff", themeHex).replaceAll("0,212,255", themeRgb);
  }
  return styles;
}

export function generateBodyHTML(blocks: Block[], themeColor?: string): string {
  let body = blocks.map((b) => componentHTML(b)).join("\n");
  const themeHex = themeColor || "#00d4ff";
  const themeRgb = hexToRgb(themeHex);

  if (themeHex.toLowerCase() !== "#00d4ff") {
    body = body.replaceAll("#00d4ff", themeHex).replaceAll("0,212,255", themeRgb);
  }
  return body;
}

export function buildExportHTML(opts: { pageName: string; blocks: Block[]; themeColor?: string }): string {
  const title = (opts.pageName || "My Website").trim() || "My Website";
  const styles = generateStyles(opts.themeColor);
  const body = generateBodyHTML(opts.blocks, opts.themeColor);

  const head = `
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500;700&family=Syne:wght@600;700;800&display=swap" rel="stylesheet">
    <style>${styles}</style>
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>${head}</head>
<body>${body}</body>
</html>`;
}

export function buildExportCode(opts: { pageName: string; blocks: Block[]; themeColor?: string }): { html: string; css: string; js: string } {
  const title = (opts.pageName || "My Website").trim() || "My Website";
  const styles = generateStyles(opts.themeColor);
  const body = generateBodyHTML(opts.blocks, opts.themeColor);

  const js = `
// Custom Website Scripts
console.log("Website '${title}' loaded successfully.");
// Add your interactive component logic here!
  `.trim();

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500;700&family=Syne:wght@600;700;800&display=swap" rel="stylesheet">
  
  <!-- CSS Stylesheet -->
  <link rel="stylesheet" href="styles.css">
</head>
<body>
${body}

  <!-- Javascript -->
  <script src="script.js"></script>
</body>
</html>`;

  return { html, css: styles, js };
}

