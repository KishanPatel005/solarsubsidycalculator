import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";

// Admin dashboard: https://solarsubsidycalculator.com/admin/leads
// PIN: 5498

const leadsPath = path.join(process.cwd(), "src", "data", "leads.json");

async function readLeadsFile(): Promise<unknown[]> {
  try {
    const raw = await fs.readFile(leadsPath, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function GET() {
  const leads = await readLeadsFile();
  return NextResponse.json(leads, { status: 200 });
}

