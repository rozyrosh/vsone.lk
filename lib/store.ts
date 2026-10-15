import { randomBytes, scrypt, timingSafeEqual } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);
const dataDir = path.join(process.cwd(), "data");

export type Inquiry = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
  createdAt: string;
};

export type Subscriber = {
  email: string;
  createdAt: string;
};

export type PartnerAccount = {
  id: string;
  company: string;
  contact: string;
  email: string;
  phone: string;
  channel: string;
  city: string;
  message: string;
  passwordHash: string;
  status: "Under review";
  createdAt: string;
};

export type PartnerEnquiry = {
  id: string;
  role: string;
  name: string;
  company: string;
  phone: string;
  district: string;
  interest: string;
  message: string;
  createdAt: string;
};

type Db = {
  inquiries: Inquiry[];
  subscribers: Subscriber[];
  partners: PartnerAccount[];
  partnerEnquiries: PartnerEnquiry[];
};

const empty: Db = { inquiries: [], subscribers: [], partners: [], partnerEnquiries: [] };

let chain: Promise<unknown> = Promise.resolve();

function withLock<T>(task: () => Promise<T>): Promise<T> {
  const run = chain.then(task, task);
  chain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function readDb(): Promise<Db> {
  try {
    const raw = await fs.readFile(path.join(dataDir, "store.json"), "utf8");
    const parsed = JSON.parse(raw) as Partial<Db>;
    return {
      inquiries: parsed.inquiries ?? [],
      subscribers: parsed.subscribers ?? [],
      partners: parsed.partners ?? [],
      partnerEnquiries: parsed.partnerEnquiries ?? [],
    };
  } catch {
    return { ...empty, inquiries: [], subscribers: [], partners: [], partnerEnquiries: [] };
  }
}

async function writeDb(db: Db) {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(path.join(dataDir, "store.json"), JSON.stringify(db, null, 2));
}

export function reference(prefix: string) {
  const token = randomBytes(3).toString("hex").toUpperCase();
  return `${prefix}-${new Date().getFullYear()}-${token}`;
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  const expected = Buffer.from(hash, "hex");
  if (expected.length !== derived.length) return false;
  return timingSafeEqual(expected, derived);
}

export async function addInquiry(input: Omit<Inquiry, "id" | "createdAt">) {
  return withLock(async () => {
    const db = await readDb();
    const inquiry: Inquiry = {
      ...input,
      id: reference("INQ"),
      createdAt: new Date().toISOString(),
    };
    db.inquiries.push(inquiry);
    await writeDb(db);
    return inquiry;
  });
}

export async function addSubscriber(email: string) {
  return withLock(async () => {
    const db = await readDb();
    const existing = db.subscribers.find((item) => item.email === email);
    if (existing) return { created: false as const, subscriber: existing };
    const subscriber: Subscriber = { email, createdAt: new Date().toISOString() };
    db.subscribers.push(subscriber);
    await writeDb(db);
    return { created: true as const, subscriber };
  });
}

export async function addPartnerEnquiry(input: Omit<PartnerEnquiry, "id" | "createdAt">) {
  return withLock(async () => {
    const db = await readDb();
    const enquiry: PartnerEnquiry = {
      ...input,
      id: reference("ENQ"),
      createdAt: new Date().toISOString(),
    };
    db.partnerEnquiries.push(enquiry);
    await writeDb(db);
    return enquiry;
  });
}

export async function addPartner(
  input: Omit<PartnerAccount, "id" | "passwordHash" | "status" | "createdAt"> & { password: string },
) {
  return withLock(async () => {
    const db = await readDb();
    const email = input.email.toLowerCase();
    if (db.partners.some((item) => item.email === email)) {
      return { ok: false as const, error: "An application already exists for this email." };
    }
    const partner: PartnerAccount = {
      id: reference("VS"),
      company: input.company,
      contact: input.contact,
      email,
      phone: input.phone,
      channel: input.channel,
      city: input.city,
      message: input.message,
      passwordHash: await hashPassword(input.password),
      status: "Under review",
      createdAt: new Date().toISOString(),
    };
    db.partners.push(partner);
    await writeDb(db);
    return { ok: true as const, partner };
  });
}

export async function findPartner(email: string) {
  const db = await readDb();
  return db.partners.find((item) => item.email === email.toLowerCase()) ?? null;
}

export function publicPartner(partner: PartnerAccount) {
  return {
    id: partner.id,
    company: partner.company,
    contact: partner.contact,
    email: partner.email,
    phone: partner.phone,
    channel: partner.channel,
    city: partner.city,
    status: partner.status,
    createdAt: partner.createdAt,
  };
}
