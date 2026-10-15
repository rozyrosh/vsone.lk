import { NextResponse } from "next/server";
import { addPartnerEnquiry } from "@/lib/store";
import { clean, requireFields } from "@/lib/validators";

const roles = new Set([
  "IT reseller",
  "Retail showroom",
  "System integrator",
  "Sub distributor",
  "E-commerce seller",
  "Brand / vendor",
]);

const districts = new Set([
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
]);

const interests = new Set([
  "PC & Component",
  "Network & Security",
  "Datacenter Systems",
  "Display & Audio",
  "Mobile & accessories",
  "Software & services",
  "Smart home & office",
]);

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const input = {
    role: clean(body?.role, 80),
    name: clean(body?.name, 80),
    company: clean(body?.company, 120),
    phone: clean(body?.phone, 40),
    district: clean(body?.district, 80),
    interest: clean(body?.interest, 80),
    message: clean(body?.message, 2000),
  };
  const missing = requireFields({
    role: input.role,
    name: input.name,
    company: input.company,
    phone: input.phone,
    district: input.district,
    interest: input.interest,
  });
  if (missing.length) {
    return NextResponse.json({ error: "Complete every field before sending the enquiry." }, { status: 400 });
  }
  if (!roles.has(input.role) || !districts.has(input.district) || !interests.has(input.interest)) {
    return NextResponse.json({ error: "Choose a role, district, and interest from the lists." }, { status: 400 });
  }
  const enquiry = await addPartnerEnquiry(input);
  return NextResponse.json({
    message: `Received. Your reference is ${enquiry.id}. The Colombo desk will call you back.`,
    id: enquiry.id,
  });
}
