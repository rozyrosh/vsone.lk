"use client";

import { Symbol } from "@/components/symbol";
import { FormEvent, useState } from "react";

const field =
  "w-full h-12 px-4 rounded-[12px] bg-white border border-outline-variant font-body-md text-[15px] text-on-surface placeholder:text-steel/70 focus:outline-none focus:border-[#013D65] focus-visible:ring-2 focus-visible:ring-[#013D65]/15";
const label = "flex flex-col gap-2 font-label-md text-[14px] font-semibold text-graphite";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formEl = event.currentTarget;
    const form = new FormData(formEl);
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
    formEl.reset();
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <label className={label} htmlFor="contact-name">
        Name
        <input id="contact-name" name="name" required className={field} autoComplete="name" placeholder="Your name" />
      </label>
      <label className={label} htmlFor="contact-company">
        Company
        <input id="contact-company" name="company" className={field} autoComplete="organization" placeholder="Company name" />
      </label>
      <label className={label} htmlFor="contact-email">
        Email
        <input id="contact-email" name="email" type="email" required className={field} autoComplete="email" placeholder="name@company.lk" />
      </label>
      <label className={label} htmlFor="contact-phone">
        Phone
        <input id="contact-phone" name="phone" className={field} autoComplete="tel" placeholder="+94" />
      </label>
      <label className={`${label} md:col-span-2`} htmlFor="contact-topic">
        Topic
        <select id="contact-topic" name="topic" required className={field} defaultValue="Product availability">
          <option>Partnership</option>
          <option>Product availability</option>
          <option>Warranty & RMA</option>
          <option>Experience Center visit</option>
          <option>Press</option>
        </select>
      </label>
      <label className={`${label} md:col-span-2`} htmlFor="contact-message">
        Message
        <textarea id="contact-message" name="message" required rows={5} className={`${field} h-auto py-3`} placeholder="The bid, serial, or visit you need." />
      </label>
      <div className="md:col-span-2 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <button type="submit" disabled={status === "loading"} className="btn bg-[#013D65] text-white shadow-[0_10px_24px_-14px_rgba(1,61,101,0.65)] hover:bg-[#012844] disabled:opacity-60">
          {status === "loading" ? "Sending" : "Send message"}
          <span className="dot">
            <Symbol name="arrow_forward" className="text-[16px]" />
          </span>
        </button>
        {message ? (
          <p role={status === "error" ? "alert" : "status"} className={`font-body-sm text-[14px] ${status === "error" ? "text-secondary" : "text-graphite"}`}>
            {message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
