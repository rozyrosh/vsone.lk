"use client";

import { FormEvent, useState } from "react";

const field =
  "w-full px-space-md py-space-sm rounded-[12px] bg-panel border border-outline-variant/70 font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-graphite transition-colors";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setStatus("loading");
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form.entries())),
    });
    const data = (await response.json()) as { message?: string; error?: string };
    if (!response.ok) {
      setStatus("error");
      setMessage(data.error || "Could not send the message.");
      return;
    }
    setStatus("done");
    setMessage(data.message || "Sent.");
    event.currentTarget.reset();
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
      <label className="flex flex-col gap-space-2xs font-label-sm text-label-sm text-on-surface-variant">
        Name
        <input name="name" required className={field} autoComplete="name" />
      </label>
      <label className="flex flex-col gap-space-2xs font-label-sm text-label-sm text-on-surface-variant">
        Company
        <input name="company" className={field} autoComplete="organization" />
      </label>
      <label className="flex flex-col gap-space-2xs font-label-sm text-label-sm text-on-surface-variant">
        Email
        <input name="email" type="email" required className={field} autoComplete="email" />
      </label>
      <label className="flex flex-col gap-space-2xs font-label-sm text-label-sm text-on-surface-variant">
        Phone
        <input name="phone" className={field} autoComplete="tel" />
      </label>
      <label className="md:col-span-2 flex flex-col gap-space-2xs font-label-sm text-label-sm text-on-surface-variant">
        Topic
        <select name="topic" required className={field} defaultValue="Product availability">
          <option>Partnership</option>
          <option>Product availability</option>
          <option>Warranty & RMA</option>
          <option>Experience Center visit</option>
          <option>Press</option>
        </select>
      </label>
      <label className="md:col-span-2 flex flex-col gap-space-2xs font-label-sm text-label-sm text-on-surface-variant">
        Message
        <textarea name="message" required rows={5} className={field} />
      </label>
      <div className="md:col-span-2 flex flex-col sm:flex-row sm:items-center gap-space-md">
        <button type="submit" disabled={status === "loading"} className="px-space-xl py-space-sm rounded-full bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container disabled:opacity-60">
          {status === "loading" ? "Sending" : "Send message"}
        </button>
        {message ? <p className={`font-body-sm text-body-sm ${status === "error" ? "text-secondary" : "text-on-surface"}`}>{message}</p> : null}
      </div>
    </form>
  );
}
