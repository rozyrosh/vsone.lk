import { NextResponse } from "next/server";
import { addSubscriber } from "@/lib/store";
import { clean, isEmail } from "@/lib/validators";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = clean(body?.email, 160).toLowerCase();
  if (!isEmail(email)) {
    return NextResponse.json({ error: "Enter a valid work email." }, { status: 400 });
  }
  const result = await addSubscriber(email);
  return NextResponse.json({
    message: result.created
      ? "You are on Corporate Dispatch. Allocation notes will go to this inbox."
      : "This email is already on Corporate Dispatch.",
  });
}
