import React from "react";
import type { Block } from "@/lib/buildify/types";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function BlockPreview({ block }: { block: Block }) {
  const p = block.props || {};

  const content = (() => {
    switch (block.type) {
      case "navbar": {
      const brandText = typeof p.brandText === "string" ? p.brandText : "Buildify";
      const links = Array.isArray(p.links) ? p.links : ["Home", "Services", "Contact"];
      return (
        <nav className="c-nav" aria-label="Navbar">
          <div className="brandLine">
            <span className="c-dot" aria-hidden="true" />
            <span>{brandText}</span>
          </div>
          <div className="links">
            {links.slice(0, 5).map((link: any, i: number) => {
              const label = typeof link === "string" ? link : link.label;
              const url = typeof link === "string" ? "#" : (link.url || "#");
              return (
                <a key={i} href={url} data-link={i} onClick={(e) => e.preventDefault()}>
                  {String(label ?? "")}
                </a>
              );
            })}
          </div>
        </nav>
      );
    }

    case "hero": {
      const headline = typeof p.headline === "string" ? p.headline : "Your Amazing Headline";
      const subheadline = typeof p.subheadline === "string" ? p.subheadline : "A short paragraph that supports your headline.";
      const ctaText = typeof p.ctaText === "string" ? p.ctaText : "Get Started";
      const ctaLinkUrl = typeof (p as any).ctaLinkUrl === "string" ? (p as any).ctaLinkUrl : "#";
      const useGradient = p.useGradient !== false;
      const backgroundColor = typeof p.backgroundColor === "string" ? p.backgroundColor : "#16213e";

      return (
        <section className={`c-hero ${useGradient ? "gradient" : "solid"}`} style={useGradient ? undefined : { background: backgroundColor }}>
          <div className="inner">
            <h1>{headline}</h1>
            <p>{subheadline}</p>
            <div className="ctaRow">
              <a className="c-btn" href={ctaLinkUrl}>
                {ctaText}
              </a>
            </div>
          </div>
        </section>
      );
    }

    case "text": {
      const text = typeof p.text === "string" ? p.text : "Write something...";
      const color = typeof p.color === "string" ? p.color : "#0a0a0f";
      const align: "left" | "center" | "right" = p.align === "center" || p.align === "right" ? p.align : "left";
      const fontSize = clamp(Number(p.fontSize ?? 16), 12, 28);

      return (
        <section className="c-textBlock" aria-label="Text Block">
          <div className="box">
            <p style={{ fontSize, color, textAlign: align }}>{text}</p>
          </div>
        </section>
      );
    }

    case "featureCards": {
      const cards = Array.isArray(p.cards) ? p.cards : [];
      const safeCards =
        cards.length
          ? cards.slice(0, 3)
          : [
              { emoji: "FS", title: "Fast Setup", desc: "Drag blocks into place." },
              { emoji: "LE", title: "Live Editing", desc: "Edit and see updates instantly." },
              { emoji: "ER", title: "Export Ready", desc: "Download a complete HTML file." },
            ];

      return (
        <section className="c-features" aria-label="Feature Cards">
          <div className="grid">
            {safeCards.map((c: any, i: number) => (
              <div className="c-fcard" key={i}>
                <div className="top">
                  <div className="c-emoji" aria-hidden="true">
                    {typeof c.emoji === "string" ? c.emoji : "AI"}
                  </div>
                  <h3>{typeof c.title === "string" ? c.title : "Feature"}</h3>
                </div>
                <p>{typeof c.desc === "string" ? c.desc : "Description"}</p>
              </div>
            ))}
          </div>
        </section>
      );
    }

    case "testimonial": {
      const quote = typeof p.quote === "string" ? p.quote : "This product is incredible.";
      const author = typeof p.author === "string" ? p.author : "Author Name";
      const role = typeof p.role === "string" ? p.role : "Role / Title";
      return (
        <section className="c-testimonial" aria-label="Testimonial">
          <div className="wrap">
            <div className="c-avatar" aria-hidden="true">
              U
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <blockquote>“{quote}”</blockquote>
              <div className="c-author">
                <strong>{author}</strong>
                <span>{role}</span>
              </div>
            </div>
          </div>
        </section>
      );
    }

    case "contactForm": {
      const submitText = typeof p.submitText === "string" ? p.submitText : "Send Message";
      return (
        <section className="c-form" aria-label="Contact Form">
          <form className="formBox" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label>Name</label>
              <input type="text" placeholder="Your name" required />
            </div>
            <div>
              <label>Email</label>
              <input type="email" placeholder="you@example.com" required />
            </div>
            <div className="fieldFull">
              <label>Message</label>
              <textarea placeholder="Write your message..." />
            </div>
            <div className="c-submitRow">
              <button className="c-submitBtn" type="submit">
                {submitText}
              </button>
            </div>
          </form>
        </section>
      );
    }

    case "image": {
      const url = typeof p.url === "string" ? p.url : "https://placehold.co/800x400/1a1a2e/00d4ff?text=Image";
      const alt = typeof p.alt === "string" ? p.alt : "Image";
      const radius = clamp(Number(p.radius ?? 16), 0, 48);
      const widthPct = clamp(Number(p.widthPct ?? 90), 30, 100);
      return (
        <section className="c-imageBlock" aria-label="Image Block">
          <div className="imgBox">
            <img src={url} alt={alt} style={{ width: `${widthPct}%`, borderRadius: `${radius}px` }} />
          </div>
        </section>
      );
    }

    case "button": {
      const label = typeof p.label === "string" ? p.label : "Learn More";
      const bgColor = typeof p.bgColor === "string" ? p.bgColor : "#00d4ff";
      const radius = clamp(Number(p.radius ?? 14), 0, 28);
      const linkUrl = typeof p.linkUrl === "string" ? p.linkUrl : "#";
      return (
        <section className="c-inlineButton" aria-label="Button">
          <div className="btnWrap">
            <a className="c-linkBtn" href={linkUrl} style={{ background: bgColor, borderRadius: `${radius}px` }}>
              {label}
            </a>
          </div>
        </section>
      );
    }

    case "faq": {
      const faqs = Array.isArray(p.faqs) ? p.faqs : [];
      return (
        <section className="c-faq" aria-label="FAQ">
          <div className="faqBox">
            <h2>Frequently Asked Questions</h2>
            <div className="faqList">
              {faqs.map((f: any, i: number) => (
                <details className="faqItem" key={i}>
                  <summary>{f.q || "Question?"}</summary>
                  <p>{f.a || "Answer"}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      );
    }

    case "video": {
      const url = typeof p.url === "string" ? p.url : "";
      return (
        <section className="c-videoBlock" aria-label="Video Embed">
          <div className="videoBox">
            <iframe title="Video Embed" src={url} frameBorder="0" allowFullScreen />
          </div>
        </section>
      );
    }

    case "pricing": {
      const plans = Array.isArray(p.plans) ? p.plans : [];
      return (
        <section className="c-pricing" aria-label="Pricing">
          <div className="pricingGrid">
            {plans.map((plan: any, i: number) => (
              <div className="c-pricingCard" key={i}>
                <h3>{plan.name || "Plan"}</h3>
                <div className="price">{plan.price || "$0"}</div>
                <ul className="features">
                  {(Array.isArray(plan.features) ? plan.features : []).map((feat: any, j: number) => (
                    <li key={j}>{feat}</li>
                  ))}
                </ul>
                <a href={plan.linkUrl || "#"} className="c-pricingBtn" onClick={(e) => e.preventDefault()}>
                  {plan.buttonText || "Choose"}
                </a>
              </div>
            ))}
          </div>
        </section>
      );
    }

    case "gallery": {
      const images = Array.isArray(p.images) ? p.images : [];
      return (
        <section className="c-gallery" aria-label="Image Gallery">
          <div className="galleryGrid">
            {images.map((img: any, i: number) => (
              <div className="c-galleryItem" key={i}>
                <img src={img} alt="Gallery image" />
              </div>
            ))}
          </div>
        </section>
      );
    }

    case "heading": {
      const text = typeof p.text === "string" ? p.text : "Heading";
      const lvl = p.level === "h1" || p.level === "h3" ? p.level : "h2";
      const align = p.align === "left" || p.align === "right" ? p.align : "center";
      
      const content = lvl === "h1" ? <h1>{text}</h1> : lvl === "h3" ? <h3>{text}</h3> : <h2>{text}</h2>;
      return (
        <section className="c-headingBlock" aria-label="Heading" style={{ textAlign: align }}>
          <div className="wrap">{content}</div>
        </section>
      );
    }

    case "newsletter": {
      const title = typeof p.title === "string" ? p.title : "Subscribe";
      const subtitle = typeof p.subtitle === "string" ? p.subtitle : "Get the latest updates.";
      const buttonText = typeof p.buttonText === "string" ? p.buttonText : "Subscribe";
      return (
        <section className="c-newsletter" aria-label="Newsletter">
          <div className="nlBox">
            <h2>{title}</h2>
            <p>{subtitle}</p>
            <form onSubmit={(e) => e.preventDefault()} className="nlForm">
              <input type="email" placeholder="Enter your email" required />
              <button type="submit" className="c-submitBtn c-btn">{buttonText}</button>
            </form>
          </div>
        </section>
      );
    }

    case "stats": {
      const stats = Array.isArray(p.stats) ? p.stats : [];
      return (
        <section className="c-stats" aria-label="Statistics">
          <div className="statsGrid">
            {stats.map((s: any, i: number) => (
              <div className="statItem" key={i}>
                <div className="sVal">{s.value}</div>
                <div className="sLab">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      );
    }

    case "split": {
      const tagline = typeof p.tagline === "string" ? p.tagline : "";
      const headline = typeof p.headline === "string" ? p.headline : "Headline";
      const desc = typeof p.description === "string" ? p.description : "Description";
      const img = typeof p.imageUrl === "string" ? p.imageUrl : "https://placehold.co/600x600/1a1a2e/00d4ff?text=Image";
      const imgLeft = p.imageLeft === true;
      return (
        <section className={`c-split ${imgLeft ? "img-left" : "img-right"}`} aria-label="Split Section">
          <div className="splitWrap">
            <div className="splitText">
              {tagline && <div className="tagline">{tagline}</div>}
              <h2>{headline}</h2>
              <p>{desc}</p>
            </div>
            <div className="splitImg">
              <img src={img} alt="Split feature" />
            </div>
          </div>
        </section>
      );
    }

    case "logos": {
      const title = typeof p.title === "string" ? p.title : "TRUSTED BY";
      const logos = Array.isArray(p.logos) ? p.logos : [];
      return (
        <section className="c-logos" aria-label="Logos">
          <div className="logoWrap">
            {title && <div className="lTitle">{title}</div>}
            <div className="lGrid">
              {logos.map((l: any, i: number) => (
                <img key={i} src={l} alt="Partner logo" />
              ))}
            </div>
          </div>
        </section>
      );
    }

    case "buttonGroup": {
      const pt = typeof p.primaryText === "string" ? p.primaryText : "Primary";
      const pu = typeof p.primaryUrl === "string" ? p.primaryUrl : "#";
      const st = typeof p.secondaryText === "string" ? p.secondaryText : "Secondary";
      const su = typeof p.secondaryUrl === "string" ? p.secondaryUrl : "#";
      const align = p.align === "left" || p.align === "right" ? p.align : "center";
      return (
        <section className="c-btnGroupWrap" style={{ textAlign: align }}>
          <div className="btnGroup">
            <a href={pu} className="c-btn" onClick={(e) => e.preventDefault()}>{pt}</a>
            <a href={su} className="c-btn secondary" onClick={(e) => e.preventDefault()}>{st}</a>
          </div>
        </section>
      );
    }

    case "footer": {
      const copyright = typeof p.copyright === "string" ? p.copyright : `© ${new Date().getFullYear()} My Website`;
      const socials = Array.isArray(p.socials) ? p.socials : ["X", "IG", "YT"];
      return (
        <footer className="c-footer" aria-label="Footer">
          <div style={{ fontFamily: "var(--mono)", fontSize: 13, color: "rgba(255,255,255,0.74)" }}>{copyright}</div>
          <div className="social" aria-hidden="true">
            {socials.slice(0, 4).map((s: any, i: number) => {
              const label = typeof s === "string" ? s : s.label;
              const url = typeof s === "string" ? "#" : (s.url || "#");
              return (
                <a key={i} href={url} className="c-socialIcon" style={{ textDecoration: "none" }} onClick={(e) => e.preventDefault()}>
                  {String(label ?? "").trim() ? label : " "}
                </a>
              );
            })}
          </div>
        </footer>
      );
    }

    default:
      return (
        <section style={{ padding: 18, color: "#0a0a0f" }} aria-label="Unknown component">
          Unknown component: {block.type}
        </section>
      );
    }
  })();

  if (p.bgColor || p.textColor) {
    const cssRules = [];
    if (p.bgColor) {
      cssRules.push(`[data-block-id="${block.id}"] .blockInner > * { background: ${p.bgColor} !important; }`);
    }
    if (p.textColor) {
      cssRules.push(`[data-block-id="${block.id}"] .blockInner * { color: ${p.textColor} !important; border-color: ${p.textColor} !important; }`);
    }
    
    // Use a composite key to force React to completely unmount and recreate the style tag.
    // React sometimes fails to repaint dynamically updated style tag contents properly.
    const styleKey = `style-${block.id}-${p.bgColor || "bg"}-${p.textColor || "tc"}`;

    return (
      <>
        <style key={styleKey} dangerouslySetInnerHTML={{ __html: cssRules.join(" ") }} />
        {content}
      </>
    );
  }

  return content;
}

