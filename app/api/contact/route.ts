import { NextResponse } from "next/server";
import { addInquiry } from "@/lib/store";
import { clean, isEmail, requireFields } from "@/lib/validators";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const input = {
    name: clean(body?.name, 80),
    company: clean(body?.company, 120),
    email: clean(body?.email, 160).toLowerCase(),
    phone: clean(body?.phone, 40),
    topic: clean(body?.topic, 80),
    message: clean(body?.message, 2000),
  };
  const missing = requireFields({ name: input.name, email: input.email, message: input.message, topic: input.topic });
  if (missing.length) {
    return NextResponse.json({ error: "Add your name, email, topic, and message." }, { status: 400 });
  }
  if (!isEmail(input.email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  const inquiry = await addInquiry(input);
  return NextResponse.json({
    message: `Received. Your reference is ${inquiry.id}. The Colombo desk will reply to ${inquiry.email}.`,
    id: inquiry.id,
  });
}
