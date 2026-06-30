import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/seo";

export const alt =
  "Agent Config Hub — curated skills, rules, MCP configs, and starter kits for AI coding agents";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#09090b",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* faint grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(#18181b 1px, transparent 1px), linear-gradient(90deg, #18181b 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              border: "2px solid #27272a",
              background: "#111113",
              fontSize: "34px",
              color: "#34d399",
              fontWeight: 700,
            }}
          >
            {">_"}
          </div>
          <div style={{ display: "flex", fontSize: "28px", color: "#a1a1aa" }}>
            {SITE_NAME}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          <div
            style={{
              display: "flex",
              fontSize: "76px",
              fontWeight: 700,
              color: "#fafafa",
              letterSpacing: "-2px",
              lineHeight: 1.05,
              maxWidth: "900px",
            }}
          >
            Agent setup, without the guesswork
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "32px",
              color: "#a1a1aa",
              maxWidth: "880px",
              lineHeight: 1.3,
            }}
          >
            Skills, rules, MCP configs, hooks, and starter kits for Cursor,
            Claude Code, Codex, and more.
          </div>
        </div>

        <div style={{ display: "flex", gap: "16px" }}>
          {[
            ["#60a5fa", "Skills"],
            ["#c084fc", "Rules"],
            ["#34d399", "MCP"],
            ["#fbbf24", "Hooks"],
            ["#fb7185", "Kits"],
          ].map(([color, label]) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 22px",
                borderRadius: "999px",
                border: "1px solid #27272a",
                background: "#111113",
                fontSize: "26px",
                color: "#e4e4e7",
              }}
            >
              <div
                style={{
                  width: "14px",
                  height: "14px",
                  borderRadius: "999px",
                  background: color,
                  display: "flex",
                }}
              />
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
