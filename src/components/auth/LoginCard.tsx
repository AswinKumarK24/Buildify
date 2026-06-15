"use client";

import { useState } from "react";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validation, setValidation] = useState({ email: "", password: "" });

  const validateForm = () => {
    const emailError = emailPattern.test(email) ? "" : "Please enter a valid email address.";
    const passwordError = password.length >= 8 ? "" : "Password must be at least 8 characters.";
    setValidation({ email: emailError, password: passwordError });
    return !emailError && !passwordError;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.error || "Invalid login credentials.");
        setIsLoading(false);
        return;
      }

      window.location.href = "/dashboard";
    } catch (caughtError) {
      setError("Unable to sign in. Please try again later.");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900/50 backdrop-blur-md p-8 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.8)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-cyan-400/12 via-slate-900/0 to-transparent blur-2xl" />
      <div className="relative mb-6 space-y-3">
        <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">GET STARTED</p>
        <h1 className="font-heading text-3xl font-semibold tracking-[-0.03em] text-white">Sign in to Buildify</h1>
        <p className="text-sm leading-6 text-slate-400">
          Access your workspace and continue building with confidence.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate autoComplete="off">
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-300">
            Email address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="off"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-3xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            aria-invalid={!!validation.email}
            aria-describedby={validation.email ? "email-error" : undefined}
          />
          {validation.email ? (
            <p id="email-error" className="mt-2 text-sm text-rose-300">
              {validation.email}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-300">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-3xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            aria-invalid={!!validation.password}
            aria-describedby={validation.password ? "password-error" : undefined}
          />
          {validation.password ? (
            <p id="password-error" className="mt-2 text-sm text-rose-300">
              {validation.password}
            </p>
          ) : null}
        </div>

        {error ? (
          <div className="rounded-3xl border border-rose-300/20 bg-rose-300/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-65"
        >
          {isLoading ? (
            <span className="flex items-center gap-3">
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
              Signing in...
            </span>
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Don’t have an account yet? <a href="/signup" className="text-cyan-300 hover:text-white">Create one here.</a>
      </p>
    </div>
  );
}
