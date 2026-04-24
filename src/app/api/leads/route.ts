import { NextResponse } from "next/server";
import { z } from "zod";
import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const leadSchema = z.object({
  name: z.string().min(2).max(50),
  phone: z.string().regex(/^[6-9]\d{9}$/),
  city: z.string().min(2).max(80),
  bill: z.coerce.number().min(0).max(50_000),
  callTime: z.enum(["morning", "afternoon", "evening"]),
  calculatorType: z.enum(["subsidy", "emi", "loan", "savings"]),
  subsidyAmount: z.coerce.number().optional(),
  finalCost: z.coerce.number().optional(),
  monthlySavings: z.coerce.number().optional(),
  state: z.string().optional(),
});

export type LeadPayload = z.infer<typeof leadSchema>;

export interface StoredLead extends LeadPayload {
  id: string;
  timestamp: string;
  ipAddress: string | null;
}

function getIpAddress(req: Request): string | null {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() ?? null;
  return req.headers.get("x-real-ip");
}

async function readJsonArray(filePath: string): Promise<unknown[]> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function appendLead(lead: StoredLead): Promise<void> {
  const filePath = path.join(process.cwd(), "src", "data", "leads.json");
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, "[]\n", "utf8");
  }
  const arr = await readJsonArray(filePath);
  arr.push(lead);
  await fs.writeFile(filePath, JSON.stringify(arr, null, 2) + "\n", "utf8");
}

async function sendEmailJsNotification(lead: StoredLead): Promise<void> {
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) return;

  const subsidy = typeof lead.subsidyAmount === "number" ? lead.subsidyAmount : 0;

  const subject = `New Solar Lead — ${lead.city} — ₹${Math.round(subsidy)}`;

  // EmailJS REST API (server-side). Template must map template_params fields.
  await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: {
        subject,
        id: lead.id,
        name: lead.name,
        phone: lead.phone,
        city: lead.city,
        bill: lead.bill,
        callTime: lead.callTime,
        calculatorType: lead.calculatorType,
        subsidyAmount: lead.subsidyAmount ?? "",
        finalCost: lead.finalCost ?? "",
        monthlySavings: lead.monthlySavings ?? "",
        state: lead.state ?? "",
        timestamp: lead.timestamp,
        ipAddress: lead.ipAddress ?? "",
      },
    }),
  }).catch(() => {
    // Don't block lead capture if email fails.
  });
}

export async function POST(req: Request) {
  try {
    const json = await req.json().catch(() => null);
    const parsed = leadSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid lead data" },
        { status: 400 }
      );
    }

    const ipAddress = getIpAddress(req);
    const lead: StoredLead = {
      ...parsed.data,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      ipAddress,
    };

    await appendLead(lead);
    await sendEmailJsNotification(lead);

    // Never return the full leads array.
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}

