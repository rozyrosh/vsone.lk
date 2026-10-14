"use client";

import { FormEvent, useState } from "react";

export function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("loading");
    const response = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = (await response.json()) as { message?: string; error?: string };
    if (!response.ok) {
      setStatus("error");
      setMessage(data.error || "Could not subscribe.");
      return;
    }
    setStatus("done");
    setMessage(data.message || "Subscribed.");
    setEmail("");
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-space-xs">
      <div className="flex flex-col min-[420px]:flex-row min-[420px]:items-center gap-space-xs">
        <label className="sr-only" htmlFor="dispatch-email">
          Work email
        </label>
        <input
          id="dispatch-email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="corporate.email@domain.lk"
          className="min-w-0 w-full px-space-md py-space-xs rounded-[10px] bg-mist border border-outline-variant/70 font-body-sm text-[16px] text-on-surface placeholder:text-outline focus:outline-none focus:border-graphite transition-colors"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="min-h-11 px-space-md py-space-xs rounded-[10px] bg-[#013D65] text-on-primary font-label-md text-[13px] font-semibold hover:bg-[#012f4e] transition-colors shrink-0 disabled:opacity-60"
        >
          {status === "loading" ? "Sending" : "Subscribe"}
        </button>
      </div>
      {message ? (
        <p className={`font-body-sm text-body-sm ${status === "error" ? "text-secondary" : "text-on-surface"}`}>{message}</p>
      ) : null}
    </form>
  );
}
