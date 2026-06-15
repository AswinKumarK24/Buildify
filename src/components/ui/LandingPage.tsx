import React from "react";
import Link from "next/link";

const featureCards = [
  {
    title: "Visual site builder",
    description:
      "Drag, drop, and customize every section with a fluid builder that keeps your content structured and beautiful.",
  },
  {
    title: "Ready-made templates",
    description:
      "Launch faster with polished page layouts designed for modern brands, portfolios, and digital products.",
  },
  {
    title: "Performance-first pages",
    description:
      "Optimized for speed, accessibility, and search performance across devices and network conditions.",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#05060b] text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav
          className="flex items-center justify-between gap-6 border-b border-white/10 py-4"
          aria-label="Primary navigation"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-cyan-400/20 ring-1 ring-cyan-400/30 shadow-[0_0_30px_rgba(0,212,255,0.18)]"></div>
            <div>
              <p className="font-heading text-lg font-semibold tracking-tight text-white">
                Buildify
              </p>
              <p className="text-xs uppercase tracking-[0.25em] text-cyan-200/70">
                No-code studio
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-8 text-sm font-medium text-slate-300 md:flex">
            <a href="#features" className="transition-all duration-300 ease-in-out hover:scale-105 hover:text-white">
              Features
            </a>
            <Link href="/login" className="transition-all duration-300 ease-in-out hover:scale-105 hover:text-white">
              Login
            </Link>
          </div>

          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-100 transition-all duration-300 ease-in-out hover:scale-105 hover:bg-opacity-90 hover:border-cyan-300/60 hover:bg-cyan-400/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
          >
            Get Started
          </Link>
        </nav>

        <section className="grid gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-8">
            <p className="inline-flex rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.32em] text-cyan-200">
              Launch faster with confidence
            </p>
            <div className="space-y-6">
              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white">
                Build beautiful websites without writing a line of code.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                Create polished, responsive experiences at speed with a modern drag-and-drop builder designed for teams and creators.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                id="get-started"
                href="/signup"
                className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
              >
                Get Started
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-base font-semibold text-white/90 transition-all duration-300 ease-in-out hover:scale-105 hover:bg-opacity-90 hover:bg-white/10"
              >
                Explore features
              </a>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_40px_120px_-40px_rgba(0,212,255,0.4)] sm:p-8">
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-cyan-400/20 to-transparent" aria-hidden="true" />
            <div className="relative rounded-[1.5rem] border border-cyan-400/15 bg-slate-950/90 p-8 shadow-2xl">
              <div className="mb-6 flex items-center justify-between gap-4">
                <span className="text-xs uppercase tracking-[0.28em] text-cyan-200/80">
                  Premium builder preview
                </span>
                <span className="rounded-full bg-white/5 px-3 py-1 text-[0.72rem] uppercase tracking-[0.3em] text-slate-300">
                  Live
                </span>
              </div>
              <div className="space-y-4">
                <div className="h-3 w-24 rounded-full bg-white/10" />
                <div className="grid gap-3">
                  <div className="h-5 rounded-full bg-white/10" />
                  <div className="h-5 w-5/6 rounded-full bg-white/10" />
                  <div className="h-5 w-2/3 rounded-full bg-white/10" />
                </div>
              </div>
              <div className="mt-6 grid gap-3 rounded-3xl bg-slate-900/80 p-5">
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>Live preview</span>
                  <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-cyan-200">Fast</span>
                </div>
                <div className="h-2 rounded-full bg-white/10" />
                <div className="h-2 w-5/6 rounded-full bg-white/10" />
              </div>
            </div>
          </div>
        </section>

        <section id="features" aria-labelledby="features-heading" className="py-16">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm uppercase tracking-[0.32em] text-cyan-300/80">
              Feature spotlight
            </p>
            <h2 id="features-heading" className="mt-4 font-heading text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Everything you need to ship a beautiful site in minutes.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-300">
              A curated suite of building blocks, performance optimizations, and simple workflows designed for modern teams.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {featureCards.map((feature) => (
              <article
                key={feature.title}
                className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-cyan-500/5 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/10"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-3xl bg-cyan-400/10 text-cyan-300 shadow-inner shadow-cyan-500/10">
                  <span className="text-xl font-semibold">✓</span>
                </div>
                <h3 className="font-heading text-xl font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-4 leading-7 text-slate-300">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </section>


        <section id="newsletter" className="rounded-[2rem] border border-white/10 bg-white/5 p-10 text-center shadow-[0_24px_80px_-40px_rgba(0,212,255,0.25)]">
          <div className="mx-auto max-w-2xl">
            <p className="text-sm uppercase tracking-[0.32em] text-cyan-300/80">Stay in the loop</p>
            <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Get product updates and launch tips.
            </h2>
            <form className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                placeholder="you@example.com"
                aria-label="Email address"
                className="min-w-0 flex-1 rounded-full border border-white/10 bg-slate-950/90 px-5 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400/70 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>

        <footer className="mt-16 border-t border-white/10 py-8 text-sm text-slate-400">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Buildify. Designed for fast launches and reliable brand experiences.</p>
            <nav aria-label="Footer navigation" className="flex flex-wrap gap-4">
              <a href="#features" className="transition hover:text-white">
                Features
              </a>
              <a href="#newsletter" className="transition hover:text-white">
                Newsletter
              </a>
            </nav>
          </div>
        </footer>
      </div>
    </main>
  );
}
