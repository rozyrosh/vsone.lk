"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Symbol } from "./symbol";

const field =
  "w-full h-12 px-4 rounded-[12px] bg-white border border-outline-variant font-body-md text-[15px] text-on-surface placeholder:text-steel/70 focus:outline-none focus:border-[#013D65] focus-visible:ring-2 focus-visible:ring-[#013D65]/15";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.get("email"), password: form.get("password") }),
    });
    const data = (await response.json()) as { error?: string };
    setLoading(false);
    if (!response.ok) {
      setError(data.error || "Could not sign in.");
      return;
    }
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="portal-email" className="font-label-md text-[14px] font-semibold text-graphite">
          Email
        </label>
        <input id="portal-email" name="email" type="email" required className={field} autoComplete="username" placeholder="name@company.lk" />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="portal-password" className="font-label-md text-[14px] font-semibold text-graphite">
          Password
        </label>
        <span className="relative block">
          <input
            id="portal-password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            className={`${field} pr-16`}
            autoComplete="current-password"
          />
          <button
            type="button"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 px-3 rounded-full font-label-md text-[13px] font-semibold text-steel hover:text-graphite focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#013D65]"
            aria-pressed={showPassword}
            onClick={() => setShowPassword((value) => !value)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </span>
      </div>
      {error ? (
        <p role="alert" className="font-body-sm text-body-sm text-secondary">
          {error}
        </p>
      ) : null}
      <button type="submit" disabled={loading} className="btn w-full mt-1 bg-[#013D65] text-white shadow-[0_10px_24px_-14px_rgba(1,61,101,0.65)] hover:bg-[#012844] disabled:opacity-60">
        {loading ? "Signing in" : "Sign in"}
        <span className="dot">
          <Symbol name="arrow_forward" className="text-[16px]" />
        </span>
      </button>
    </form>
  );
}

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      className="px-space-lg py-space-xs rounded-full border border-outline-variant font-label-md text-label-md hover:bg-surface-container-low"
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.refresh();
      }}
    >
      Sign out
    </button>
  );
}
