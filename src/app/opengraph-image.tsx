import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F59E0B",
          fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            padding: 64,
            borderRadius: 32,
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.25)",
          }}
        >
          <div style={{ fontSize: 72, lineHeight: 1 }}>☀</div>
          <div style={{ marginTop: 18, fontSize: 72, fontWeight: 800, color: "#FFFFFF" }}>
            Solar Subsidy Calculator
          </div>
          <div style={{ marginTop: 14, fontSize: 32, fontWeight: 600, color: "rgba(255,255,255,0.95)" }}>
            Free Solar Subsidy Calculator for India
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

