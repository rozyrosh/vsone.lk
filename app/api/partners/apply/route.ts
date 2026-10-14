import { NextResponse } from "next/server";
import { setSession } from "@/lib/session";
import { addPartner, publicPartner } from "@/lib/store";
import { clean, isEmail, requireFields } from "@/lib/validators";

const channels = new Set([
  "Direct Retail Showrooms",
  "IT Resellers",
  "System Integrators",
  "Sub Distributors",
  "Large-Format Retailers",
  "E-Commerce Marketplaces",
]);

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const input = {
    company: clean(body?.company, 120),
    contact: clean(body?.contact, 80),
    email: clean(body?.email, 160).toLowerCase(),
    phone: clean(body?.phone, 40),
    channel: clean(body?.channel, 80),
    city: clean(body?.city, 80),
    message: clean(body?.message, 2000),
    password: String(body?.password ?? ""),
  };
  const missing = requireFields({
    company: input.company,
    contact: input.contact,
    email: input.email,
    phone: input.phone,
    channel: input.channel,
    city: input.city,
  });
  if (missing.length) {
    return NextResponse.json({ error: "Complete every field before submitting the application." }, { status: 400 });
  }
  if (!isEmail(input.email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (!channels.has(input.channel)) {
    return NextResponse.json({ error: "Choose a channel we supply." }, { status: 400 });
  }
  if (input.password.length < 8) {
    return NextResponse.json({ error: "Use a password of at least 8 characters." }, { status: 400 });
  }
  const result = await addPartner(input);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 409 });
  }
  await setSession(result.partner.email);
  return NextResponse.json({
    message: `Application ${result.partner.id} is under review. You can sign in with this email.`,
    partner: publicPartner(result.partner),
  });
}
