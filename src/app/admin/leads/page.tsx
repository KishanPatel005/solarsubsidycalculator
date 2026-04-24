"use client";

import * as React from "react";
import Link from "next/link";
import { Download, LogOut, MessageCircle } from "lucide-react";

import { Logo } from "@/components/layout/Logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatINR } from "@/lib/utils/formatCurrency";

type Lead = {
  id?: string;
  timestamp?: string;
  name?: string;
  phone?: string;
  city?: string;
  state?: string;
  bill?: number;
  calculatorType?: string;
  callTime?: string;
  subsidyAmount?: number;
};

const PIN = "5498";

function formatDateTime(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function toCsvValue(v: unknown) {
  const s = v == null ? "" : String(v);
  const escaped = s.replace(/"/g, '""');
  return `"${escaped}"`;
}

function downloadCsv(leads: Lead[]) {
  const headers = [
    "#",
    "Date & Time",
    "Name",
    "Phone",
    "City",
    "State",
    "Monthly Bill",
    "Calculator Used",
    "Call Time",
    "Subsidy Amount",
  ];

  const rows = leads.map((l, idx) => [
    idx + 1,
    formatDateTime(l.timestamp),
    l.name ?? "",
    l.phone ?? "",
    l.city ?? "",
    l.state ?? "",
    typeof l.bill === "number" ? l.bill : "",
    l.calculatorType ?? "",
    l.callTime ?? "",
    typeof l.subsidyAmount === "number" ? l.subsidyAmount : "",
  ]);

  const csv =
    [headers, ...rows].map((r) => r.map(toCsvValue).join(",")).join("\n") + "\n";

  const date = new Date().toISOString().slice(0, 10);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `solarhelp-leads-${date}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfWeek() {
  // Monday-start week for India
  const d = startOfToday();
  const day = d.getDay(); // 0 Sun .. 6 Sat
  const diff = (day + 6) % 7; // 0 for Mon, 6 for Sun
  d.setDate(d.getDate() - diff);
  return d;
}

function mostCommonState(leads: Lead[]) {
  const counts: Record<string, number> = {};
  for (const l of leads) {
    const s = (l.state || "").trim();
    if (!s) continue;
    counts[s] = (counts[s] ?? 0) + 1;
  }

  let bestState = "—";
  let bestCount = 0;
  for (const s of Object.keys(counts)) {
    const c = counts[s] ?? 0;
    if (c > bestCount) {
      bestCount = c;
      bestState = s;
    }
  }
  return bestState;
}

export default function AdminLeadsPage() {
  const [pin, setPin] = React.useState("");
  const [unlocked, setUnlocked] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [leads, setLeads] = React.useState<Lead[]>([]);

  const loadLeads = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/leads", { method: "GET" }).catch(
      () => null
    );
    if (!res || !res.ok) {
      setLoading(false);
      setError("Failed to load leads.");
      return;
    }
    const json = (await res.json().catch(() => [])) as unknown;
    setLeads(Array.isArray(json) ? (json as Lead[]) : []);
    setLoading(false);
  }, []);

  React.useEffect(() => {
    if (unlocked) void loadLeads();
  }, [unlocked, loadLeads]);

  const ordered = React.useMemo(
    () =>
      [...leads].sort((a, b) =>
        (a.timestamp ?? "") < (b.timestamp ?? "") ? 1 : -1
      ),
    [leads]
  );

  const todayStart = React.useMemo(() => startOfToday(), []);
  const weekStart = React.useMemo(() => startOfWeek(), []);

  const todays = ordered.filter((l) => {
    const t = l.timestamp ? new Date(l.timestamp) : null;
    return t && !Number.isNaN(t.getTime()) && t >= todayStart;
  });

  const thisWeek = ordered.filter((l) => {
    const t = l.timestamp ? new Date(l.timestamp) : null;
    return t && !Number.isNaN(t.getTime()) && t >= weekStart;
  });

  if (!unlocked) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <Card className="w-full max-w-md p-6">
          <div className="flex flex-col items-center text-center">
            <Logo size="lg" />
            <h1 className="mt-5 text-xl font-semibold">Admin Access</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter PIN to view leads
            </p>
          </div>

          <div className="mt-6 space-y-3">
            <Input
              value={pin}
              onChange={(e) =>
                setPin(e.target.value.replace(/[^\d]/g, "").slice(0, 4))
              }
              type="password"
              inputMode="numeric"
              maxLength={4}
              placeholder="••••"
              className="text-center text-lg tracking-widest"
            />
            <Button
              className="w-full bg-solar-600 text-white hover:bg-solar-700"
              onClick={() => {
                if (pin === PIN) {
                  setUnlocked(true);
                  setError(null);
                  setPin("");
                  return;
                }
                setError("Incorrect PIN. Try again.");
              }}
            >
              View Leads
            </Button>
            {error ? (
              <p className="text-sm text-red-600">{error}</p>
            ) : null}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">
            SolarHelp Leads Dashboard
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Total: {ordered.length}</Badge>
            {loading ? <Badge variant="outline">Loading…</Badge> : null}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => downloadCsv(ordered)}
            disabled={!ordered.length}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setUnlocked(false);
              setLeads([]);
              setError(null);
              setPin("");
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Total Leads</div>
          <div className="mt-1 text-xl font-semibold">{ordered.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Today&apos;s Leads</div>
          <div className="mt-1 text-xl font-semibold">{todays.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">This Week&apos;s Leads</div>
          <div className="mt-1 text-xl font-semibold">{thisWeek.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Most Common State</div>
          <div className="mt-1 text-xl font-semibold">
            {mostCommonState(ordered)}
          </div>
        </Card>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        {ordered.length ? (
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-amber-50">
                <tr className="text-left">
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">
                    #
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">
                    Date &amp; Time
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">
                    Name
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">
                    Phone
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">
                    City
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">
                    State
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">
                    Monthly Bill
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">
                    Calculator Used
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">
                    Call Time
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">
                    Subsidy Amount
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">
                    WhatsApp
                  </th>
                </tr>
              </thead>
              <tbody>
                {ordered.map((l, idx) => {
                  const rowNum = idx + 1;
                  const waHref = l.phone
                    ? `https://wa.me/91${l.phone}`
                    : null;
                  return (
                    <tr
                      key={l.id ?? `${l.phone}-${idx}`}
                      className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="whitespace-nowrap px-4 py-3">{rowNum}</td>
                      <td className="whitespace-nowrap px-4 py-3">
                        {formatDateTime(l.timestamp)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        {l.name ?? "—"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        {l.phone ?? "—"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        {l.city ?? "—"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        {l.state ?? "—"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        {typeof l.bill === "number" ? formatINR(l.bill) : "—"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        {l.calculatorType ?? "—"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        {l.callTime ?? "—"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        {typeof l.subsidyAmount === "number"
                          ? formatINR(l.subsidyAmount)
                          : "—"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        {waHref ? (
                          <Button asChild size="sm" variant="outline">
                            <a
                              href={waHref}
                              target="_blank"
                              rel="noreferrer"
                              aria-label="Open WhatsApp"
                            >
                              <MessageCircle className="h-4 w-4" />
                            </a>
                          </Button>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No leads yet. <br />
              Share your site to start getting leads!
            </p>
            <div className="mt-4 flex justify-center">
              <Button asChild className="bg-solar-600 text-white hover:bg-solar-700">
                <Link href="/">Back to site</Link>
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

