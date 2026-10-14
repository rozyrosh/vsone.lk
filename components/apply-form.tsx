"use client";

import { channels } from "@/lib/content";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const field =
  "w-full px-space-md py-space-sm rounded-[12px] bg-panel border border-outline-variant/70 font-body-md text-body-md text-on-surface focus:outline-none focus:border-graphite transition-colors";

export function ApplyForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirm = String(form.get("confirm") ?? "");
    if (password !== confirm) {
      setStatus("error");
      setMessage("Passwords do not match.");
      return;
    }
    setStatus("loading");
    const response = await fetch("/api/partners/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form.entries())),
    });
    const data = (await response.json()) as { error?: string };
    if (!response.ok) {
      setStatus("error");
      setMessage(data.error || "Could not submit the application.");
      return;
    }
    router.push("/partner-portal");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
      <label className="flex flex-col gap-space-2xs font-label-sm text-label-sm text-on-surface-variant">
        Company
        <input name="company" required className={field} />
      </label>
      <label className="flex flex-col gap-space-2xs font-label-sm text-label-sm text-on-surface-variant">
        Contact name
        <input name="contact" required className={field} />
      </label>
      <label className="flex flex-col gap-space-2xs font-label-sm text-label-sm text-on-surface-variant">
        Email
        <input name="email" type="email" required className={field} autoComplete="email" />
      </label>
      <label className="flex flex-col gap-space-2xs font-label-sm text-label-sm text-on-surface-variant">
        Phone
        <input name="phone" required className={field} />
      </label>
      <label className="flex flex-col gap-space-2xs font-label-sm text-label-sm text-on-surface-variant">
        Channel
        <select name="channel" required className={field} defaultValue={channels[1].title}>
          {channels.map((channel) => (
            <option key={channel.title}>{channel.title}</option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-space-2xs font-label-sm text-label-sm text-on-surface-variant">
        City
        <input name="city" required className={field} />
      </label>
      <label className="md:col-span-2 flex flex-col gap-space-2xs font-label-sm text-label-sm text-on-surface-variant">
        What you need from VS One
        <textarea name="message" rows={4} className={`${field} rounded-2xl`} />
      </label>
      <label className="flex flex-col gap-space-2xs font-label-sm text-label-sm text-on-surface-variant">
        Portal password
        <input name="password" type="password" required minLength={8} className={field} autoComplete="new-password" />
      </label>
      <label className="flex flex-col gap-space-2xs font-label-sm text-label-sm text-on-surface-variant">
        Confirm password
        <input name="confirm" type="password" required minLength={8} className={field} autoComplete="new-password" />
      </label>
      <div className="md:col-span-2 flex flex-col sm:flex-row sm:items-center gap-space-md">
        <button type="submit" disabled={status === "loading"} className="px-space-xl py-space-sm rounded-full bg-primary text-on-primary font-label-md text-label-md font-semibold disabled:opacity-60">
          {status === "loading" ? "Submitting" : "Submit application"}
        </button>
        {message ? <p className="font-body-sm text-body-sm text-secondary">{message}</p> : null}
      </div>
    </form>
  );
}
