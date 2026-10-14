"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const field =
  "w-full px-space-md py-space-sm rounded-full bg-white border border-outline-variant font-body-md text-body-md text-on-surface focus:outline-none focus:border-secondary";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    <form onSubmit={onSubmit} className="flex flex-col gap-space-md max-w-md">
      <label className="flex flex-col gap-space-2xs font-label-sm text-label-sm text-on-surface-variant">
        Email
        <input name="email" type="email" required className={field} autoComplete="username" />
      </label>
      <label className="flex flex-col gap-space-2xs font-label-sm text-label-sm text-on-surface-variant">
        Password
        <input name="password" type="password" required className={field} autoComplete="current-password" />
      </label>
      {error ? <p className="font-body-sm text-body-sm text-secondary">{error}</p> : null}
      <button type="submit" disabled={loading} className="self-start px-space-xl py-space-sm rounded-full bg-primary text-on-primary font-label-md text-label-md font-semibold disabled:opacity-60">
        {loading ? "Signing in" : "Sign in"}
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
