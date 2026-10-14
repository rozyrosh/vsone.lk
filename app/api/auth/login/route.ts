import { NextResponse } from "next/server";
import { setSession } from "@/lib/session";
import { findPartner, publicPartner, verifyPassword } from "@/lib/store";
import { clean, isEmail } from "@/lib/validators";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = clean(body?.email, 160).toLowerCase();
  const password = String(body?.password ?? "");
  if (!isEmail(email) || !password) {
    return NextResponse.json({ error: "Enter the email and password from your application." }, { status: 400 });
  }
  const partner = await findPartner(email);
  if (!partner || !(await verifyPassword(password, partner.passwordHash))) {
    return NextResponse.json({ error: "Those portal credentials do not match an application." }, { status: 401 });
  }
  await setSession(email);
  return NextResponse.json({ partner: publicPartner(partner) });
}
