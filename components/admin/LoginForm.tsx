"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const field =
  "w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 text-sm text-white placeholder:text-white/40 backdrop-blur focus:border-white/40 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-white/30";

export default function LoginForm({ demo }: { demo?: { email: string; password: string } }) {
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const f = new FormData(e.currentTarget);
    const res = await signIn("credentials", { email: f.get("email"), password: f.get("password"), redirect: false });
    if (res?.ok) {
      // Reception staff land on their simplified dashboard (the middleware redirects if needed).
      window.location.href = "/admin";
    } else {
      setError("Incorrect email or password.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-white/80">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          placeholder="you@example.com"
          defaultValue={demo?.email}
          className={field}
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-white/80">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={show ? "text" : "password"}
            required
            autoComplete="current-password"
            placeholder="Enter your password"
            defaultValue={demo?.password}
            className={field + " pr-11"}
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-white/60 hover:text-white"
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between text-xs">
        <label className="flex items-center gap-2 text-white/70">
          <input type="checkbox" name="remember" defaultChecked className="accent-[#E60012]" /> Remember me
        </label>
        <a
          href="mailto:kutjaworx@gmail.com?subject=Admin%20password%20reset"
          className="text-white/70 underline-offset-2 hover:text-white hover:underline"
        >
          Forgot password?
        </a>
      </div>
      {error && (
        <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}
      <button
        disabled={busy}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-red py-3 text-sm font-semibold text-white shadow-[0_6px_24px_rgba(230,0,18,0.35)] transition-colors hover:bg-brand-dark disabled:opacity-60"
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" />} Log In
      </button>
    </form>
  );
}
