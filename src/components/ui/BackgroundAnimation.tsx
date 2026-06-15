"use client";

export default function BackgroundAnimation() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden opacity-75">
      <div className="absolute left-[-20%] top-[10%] h-72 w-72 rounded-full bg-cyan-400/12 blur-3xl animate-blob" />
      <div className="absolute right-[-10%] top-[20%] h-80 w-80 rounded-full bg-violet-400/10 blur-3xl animate-blob animation-delay-2000" />
      <div className="absolute left-[20%] bottom-[10%] h-64 w-64 rounded-full bg-sky-300/6 blur-3xl animate-blob animation-delay-4000" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,212,255,0.08),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(124,58,237,0.06),_transparent_25%)]" />
    </div>
  );
}
