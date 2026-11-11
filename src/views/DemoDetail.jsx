"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const DEMOS = {
  demo1: {
    id: "demo1",
    name: "Autonomous Inventory Agent",
    tagline: "Built in 12 minutes by chaining 3 REST APIs.",
    description:
      "No fine-tuning. No custom code. Just three existing APIs — inventory, purchasing, approval — chained together with an AI intent. The agent picks the right sequence, passes data between them, and loops in a human only when needed.",
    status: "active",

    // ⭐ THE NARRATIVE: what a YC partner cares about
    pitch: {
      problem:
        "Restaurant inventory runs on tribal knowledge: the chef walks the fridge, guesses what's low, calls the supplier, forgets to update the spreadsheet, and re-orders the same thing twice.",
      solution:
        "We chain 3 APIs that already exist in the customer's stack — inventory lookup, PO creation, and approval — into one conversational agent. The customer types 'Check stock of rice' and the AI does the rest, pausing for a single human approval before money moves.",
      why_it_matters:
        "This agent was built by a non-engineer in 12 minutes. Zero new backend. Zero ML. The barrier to shipping agents is no longer engineering capacity — it's knowing what to chain.",
    },

    // ⭐ THE ENGINE: the actual 3 APIs
    chain: [
      {
        step: 1,
        label: "Checking Inventory",
        method: "GET",
        endpoint: "/inventory/rice",
        description:
          "Look up real-time stock levels for the requested material.",
        outcome: "current_qty = 0, threshold = 4",
        badge: "auto",
      },
      {
        step: 2,
        label: "Purchase Order Created",
        method: "POST",
        endpoint: "/purchase-orders",
        description:
          "Auto-draft a PO with the correct supplier, material, quantity, and unit — all inferred from the inventory response.",
        outcome: "PO-C9AE52 drafted, approval link sent",
        badge: "human_pause",
      },
      {
        step: 3,
        label: "Purchase Order Approved",
        method: "PATCH",
        endpoint: "/purchase-orders/{{ po_id }}/approve",
        description:
          "Once the chef approves, mark the PO approved and atomically update live inventory.",
        outcome: "PO-7A49CC approved, inventory_updated: true",
        badge: "auto",
      },
    ],

    // ⭐ THE TRANSCRIPT: proof it actually works
    transcript: [
      {
        role: "user",
        text: "Check the current stock level of rice",
      },
      {
        role: "agent",
        text: '🔍 Checking inventory: "Basmati Rice" is currently at 0 kg (threshold: 4 kg).',
        meta: "Step 1 · GET /inventory/rice",
      },
      {
        role: "agent",
        text: '⚠️ Stock is below threshold. Drafted a purchase order for 4 kg from "FreshMeat". Awaiting your approval.',
        meta: "Step 2 · POST /purchase-orders",
        actions: ["✅ Approve", "❌ Decline"],
      },
      {
        role: "user",
        text: "Approved",
      },
      {
        role: "agent",
        text: '✅ Order PO-7A49CC approved. Inventory updated: rice is now at 4 kg. Next restock will trigger automatically when it drops below 4 kg again.',
        meta: "Step 3 · PATCH /purchase-orders/{{ po_id }}/approve",
      },
    ],

    // ⭐ THE VALUE: why the customer buys
    value: [
      {
        metric: "12 min",
        label: "Build time",
        detail: "No code, no ML training, no new backend",
      },
      {
        metric: "3 APIs",
        label: "Chained together",
        detail: "Existing REST endpoints from the customer's stack",
      },
      {
        metric: "1 tap",
        label: "Human involvement",
        detail: "Approval gate where money moves — the rest is autonomous",
      },
      {
        metric: "0%",
        label: "New engineering",
        detail: "The customer's existing APIs became an agent",
      },
    ],

    // ⭐ THE VIDEO
    video: "/videos/inventory-chain.mp4",
  },
};

// ============================================================
// Components
// ============================================================

function MethodPill({ method }) {
  const colors = {
    GET: { bg: "#dcfce7", fg: "#166534" },
    POST: { bg: "#dbeafe", fg: "#1e40af" },
    PATCH: { bg: "#fef3c7", fg: "#92400e" },
    PUT: { bg: "#fef3c7", fg: "#92400e" },
    DELETE: { bg: "#fee2e2", fg: "#991b1b" },
  };
  const c = colors[method] || colors.GET;
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 4,
        background: c.bg,
        color: c.fg,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.03em",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
      }}
    >
      {method}
    </span>
  );
}

function ChainStep({ step, isLast }) {
  const isHumanPause = step.badge === "human_pause";
  return (
    <div style={{ display: "flex", gap: 16, position: "relative" }}>
      {/* Vertical connector line */}
      {!isLast && (
        <div
          style={{
            position: "absolute",
            left: 19,
            top: 40,
            bottom: -16,
            width: 2,
            background: "var(--border)",
            zIndex: 0,
          }}
        />
      )}

      {/* Step circle */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: isHumanPause ? "#fef3c7" : "var(--primary-soft, #ede9fe)",
          color: isHumanPause ? "#92400e" : "#6d28d9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontSize: 14,
          flexShrink: 0,
          zIndex: 1,
          border: isHumanPause
            ? "2px dashed #f59e0b"
            : "2px solid var(--border)",
        }}
      >
        {isHumanPause ? "👤" : step.step}
      </div>

      {/* Step content */}
      <div style={{ flex: 1, paddingBottom: 24 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 4,
            flexWrap: "wrap",
          }}
        >
          <strong style={{ fontSize: 14 }}>{step.label}</strong>
          <MethodPill method={step.method} />
          <code
            style={{
              fontSize: 11,
              color: "var(--text-muted)",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              background: "var(--surface-2)",
              padding: "2px 6px",
              borderRadius: 4,
            }}
          >
            {step.endpoint}
          </code>
        </div>
        <p
          style={{
            margin: 0,
            fontSize: 13,
            color: "var(--text-muted)",
            lineHeight: 1.5,
          }}
        >
          {step.description}
        </p>
        <div
          style={{
            marginTop: 8,
            padding: "6px 10px",
            background: "var(--surface-2)",
            borderRadius: 6,
            fontSize: 12,
            color: "var(--text-muted)",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          }}
        >
          → {step.outcome}
        </div>
      </div>
    </div>
  );
}

function TranscriptMessage({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: 10,
      }}
    >
      <div style={{ maxWidth: "85%" }}>
        {msg.meta && (
          <div
            style={{
              fontSize: 10,
              color: "var(--text-muted)",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              marginBottom: 3,
              textAlign: isUser ? "right" : "left",
            }}
          >
            {msg.meta}
          </div>
        )}
        <div
          style={{
            padding: "8px 12px",
            borderRadius: isUser
              ? "14px 14px 4px 14px"
              : "14px 14px 14px 4px",
            background: isUser ? "#4A7FEB" : "var(--surface-2)",
            color: isUser ? "#ffffff" : "var(--text)",
            fontSize: 13,
            lineHeight: 1.5,
            whiteSpace: "pre-wrap",
          }}
        >
          {msg.text}
        </div>
        {msg.actions && (
          <div
            style={{
              display: "flex",
              gap: 8,
              marginTop: 6,
              flexWrap: "wrap",
            }}
          >
            {msg.actions.map((a) => (
              <span
                key={a}
                style={{
                  padding: "4px 10px",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 500,
                }}
              >
                {a}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// Demo Detail Wrapper
// ============================================================
export default function DemoDetail({ id }) {
  const router = useRouter();
  const demo = DEMOS[id];

  const [openAccordion, setOpenAccordion] = useState(0);

  if (!demo) {
    return (
      <div style={{ padding: "2rem" }}>
        <h1>Demo not found</h1>
        <p className="muted">
          No demo with id <code>{id}</code>.
        </p>
        <Link
          href="/demos"
          className="btn btn-ghost"
          style={{ marginBottom: 24, display: "inline-block" }}
        >
          ← Back
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "clamp(24px, 4vw, 64px)" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        {/* ---------------- HERO ---------------- */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              display: "inline-block",
              padding: "4px 12px",
              background: "var(--primary-soft, #ede9fe)",
              color: "#6d28d9",
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            Live agent · 3 REST APIs
          </div>
          <h1 style={{ margin: 0, fontSize: 34 }}>{demo.name}</h1>
          <p
            className="muted"
            style={{
              marginTop: 8,
              fontSize: 16,
              maxWidth: 680,
              marginInline: "auto",
              lineHeight: 1.5,
            }}
          >
            {demo.tagline}
          </p>
          <p
            className="muted"
            style={{
              marginTop: 12,
              fontSize: 14,
              maxWidth: 720,
              marginInline: "auto",
              lineHeight: 1.6,
            }}
          >
            {demo.description}
          </p>
        </div>

        <Link
          href="/demos"
          className="btn btn-ghost"
          style={{ marginBottom: 24, display: "inline-block" }}
        >
          ← Back
        </Link>

        {/* ---------------- THE PITCH (Why it matters) ---------------- */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
            padding: 28,
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            boxShadow: "var(--shadow)",
            marginBottom: 32,
          }}
          className="two-col-grid"
        >
          <div>
            <h4
              style={{
                margin: "0 0 8px 0",
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "#dc2626",
              }}
            >
              The problem
            </h4>
            <p className="muted small" style={{ margin: 0, lineHeight: 1.6 }}>
              {demo.pitch.problem}
            </p>
          </div>
          <div>
            <h4
              style={{
                margin: "0 0 8px 0",
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "#16a34a",
              }}
            >
              The solution
            </h4>
            <p className="muted small" style={{ margin: 0, lineHeight: 1.6 }}>
              {demo.pitch.solution}
            </p>
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <h4
              style={{
                margin: "0 0 8px 0",
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "#6d28d9",
              }}
            >
              Why it matters
            </h4>
            <p className="muted small" style={{ margin: 0, lineHeight: 1.6 }}>
              {demo.pitch.why_it_matters}
            </p>
          </div>
        </div>

        {/* ---------------- VALUE GRID ---------------- */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
            marginBottom: 32,
          }}
          className="value-grid"
        >
          {demo.value.map((v) => (
            <div
              key={v.label}
              style={{
                padding: 20,
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  color: "#6d28d9",
                  marginBottom: 4,
                }}
              >
                {v.metric}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                {v.label}
              </div>
              <div
                className="muted"
                style={{ fontSize: 11, lineHeight: 1.4 }}
              >
                {v.detail}
              </div>
            </div>
          ))}
        </div>

        {/* ---------------- THE CHAIN ---------------- */}
        <div
          style={{
            padding: 28,
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            boxShadow: "var(--shadow)",
            marginBottom: 32,
          }}
        >
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ margin: 0, fontSize: 22 }}>
              The chain: 3 APIs, 1 agent
            </h2>
            <p
              className="muted"
              style={{ marginTop: 6, fontSize: 14, lineHeight: 1.5 }}
            >
              Every step is a REST API the customer already owns. The AI
              infers the sequence, pipes data between steps, and pauses for
              a human when money moves.
            </p>
          </div>

          <div>
            {demo.chain.map((step, i) => (
              <ChainStep
                key={step.step}
                step={step}
                isLast={i === demo.chain.length - 1}
              />
            ))}
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              marginTop: 8,
              flexWrap: "wrap",
              alignItems: "center",
              fontSize: 12,
              color: "var(--text-muted)",
            }}
          >
            <span>Legend:</span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "2px 8px",
                background: "#ede9fe",
                color: "#6d28d9",
                borderRadius: 12,
                fontWeight: 600,
              }}
            >
              ● Auto
            </span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "2px 8px",
                background: "#fef3c7",
                color: "#92400e",
                borderRadius: 12,
                fontWeight: 600,
              }}
            >
              👤 Human approval
            </span>
          </div>
        </div>

        {/* ---------------- TRANSCRIPT + VIDEO ---------------- */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
            marginBottom: 32,
          }}
          className="two-col-grid"
        >
          {/* Transcript */}
          <div
            style={{
              padding: 24,
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              boxShadow: "var(--shadow)",
            }}
          >
            <h3
              style={{
                margin: "0 0 4px 0",
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              Live transcript
            </h3>
            <p
              className="muted"
              style={{ margin: "0 0 16px 0", fontSize: 12 }}
            >
              What a customer actually sees in the chat widget.
            </p>
            <div>
              {demo.transcript.map((msg, i) => (
                <TranscriptMessage key={i} msg={msg} />
              ))}
            </div>
          </div>

          {/* Video */}
          <div
            style={{
              padding: 24,
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              boxShadow: "var(--shadow)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h3
              style={{
                margin: "0 0 4px 0",
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              End-to-end walkthrough
            </h3>
            <p
              className="muted"
              style={{ margin: "0 0 16px 0", fontSize: 12 }}
            >
              Recorded in the live widget — real chain execution.
            </p>
            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "16 / 9",
                background: "var(--surface-2)",
                border: "2px dashed var(--border)",
                borderRadius: "var(--radius-sm)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-muted)",
                overflow: "hidden",
                flex: 1,
              }}
            >
              {demo.video ? (
                <video
                  src={demo.video}
                  controls
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    background: "#000",
                  }}
                />
              ) : (
                <>
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      background: "var(--surface)",
                      border: "2px solid var(--border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="var(--text-muted)"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <span
                    style={{
                      position: "absolute",
                      bottom: 10,
                      left: 14,
                      fontSize: 12,
                      fontWeight: 500,
                    }}
                  >
                    Demo video — coming soon
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ---------------- CTA ---------------- */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "32px 0",
          }}
        >
          <button
            className="btn btn-primary"
            style={{
              padding: "14px 36px",
              fontSize: 15,
              fontWeight: 600,
            }}
            onClick={() => {
              localStorage.setItem("active_demo", id);
              window.location.assign("/owner");
            }}
          >
            Try it live →
          </button>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 800px) {
          .two-col-grid {
            grid-template-columns: 1fr !important;
          }
          .value-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          .value-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}