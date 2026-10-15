"use client";

import { offerings } from "@/lib/content";
import { FormEvent, useState } from "react";

const field =
  "w-full px-space-md py-space-sm rounded-[12px] bg-panel border border-outline-variant/70 font-body-md text-body-md text-on-surface focus:outline-none focus:border-graphite transition-colors";

const label = "font-label-md text-label-md text-on-surface";

const roles = [
  "IT reseller",
  "Retail showroom",
  "System integrator",
  "Sub distributor",
  "E-commerce seller",
  "Brand / vendor",
];

const districts = [
  "Colombo",
  "Gampaha",
  "Kalutara",
  "Kandy",
  "Matale",
  "Nuwara Eliya",
  "Galle",
  "Matara",
  "Hambantota",
  "Jaffna",
  "Kilinochchi",
  "Mannar",
  "Vavuniya",
  "Mullaitivu",
  "Batticaloa",
  "Ampara",
  "Trincomalee",
  "Kurunegala",
  "Puttalam",
  "Anuradhapura",
  "Polonnaruwa",
  "Badulla",
  "Monaragala",
  "Ratnapura",
  "Kegalle",
];

export function ApplyForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "sent">("idle");
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!role) {
      setStatus("error");
      setMessage("Choose who you are before sending the enquiry.");
      return;
    }
    setStatus("loading");
    const response = await fetch("/api/partners/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(form).entries())),
    });
    const data = (await response.json()) as { error?: string; message?: string };
    if (!response.ok) {
      setStatus("error");
      setMessage(data.error || "Could not send the enquiry.");
      return;
    }
    form.reset();
    setRole("");
    setStatus("sent");
    setMessage(data.message || "Received. The Colombo desk will call you back.");
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
      <div className="md:col-span-2 flex flex-col gap-space-sm">
        <input type="hidden" name="role" value={role} />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" role="radiogroup" aria-label="I am a">
          {roles.map((item) => {
            const selected = role === item;
            return (
              <button
                key={item}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setRole(item)}
                className={`rounded-full border px-3 py-2.5 text-center font-body-sm text-body-sm transition-colors ${
                  selected
                    ? "border-[#e11d48] text-[#e11d48] bg-white"
                    : "border-outline-variant/80 bg-panel text-on-surface hover:border-on-surface"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>
      <label className={`flex flex-col gap-space-2xs ${label}`}>
        Name
        <input name="name" required className={field} />
      </label>
      <label className={`flex flex-col gap-space-2xs ${label}`}>
        Company
        <input name="company" required className={field} />
      </label>
      <label className={`flex flex-col gap-space-2xs ${label}`}>
        Phone
        <input name="phone" required className={field} />
      </label>
      <label className={`flex flex-col gap-space-2xs ${label}`}>
        District
        <select name="district" required className={field} defaultValue="Colombo">
          {districts.map((district) => (
            <option key={district}>{district}</option>
          ))}
        </select>
      </label>
      <label className={`md:col-span-2 flex flex-col gap-space-2xs ${label}`}>
        Interested in
        <select name="interest" required className={field} defaultValue="PC & Component">
          {offerings.map((item) => (
            <option key={item.title}>{item.title}</option>
          ))}
        </select>
      </label>
      <label className={`md:col-span-2 flex flex-col gap-space-2xs ${label}`}>
        Message (optional)
        <textarea name="message" rows={4} className={`${field} rounded-2xl`} />
      </label>
      <div className="md:col-span-2 flex flex-col sm:flex-row sm:items-center gap-space-md">
        <button type="submit" disabled={status === "loading"} className="px-space-xl py-space-sm rounded-full bg-primary text-on-primary font-label-md text-label-md font-semibold disabled:opacity-60">
          {status === "loading" ? "Sending" : "Send enquiry"}
        </button>
        {message ? <p className={`font-body-sm text-body-sm ${status === "sent" ? "text-on-surface-variant" : "text-secondary"}`}>{message}</p> : null}
      </div>
    </form>
  );
}
