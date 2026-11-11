"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const DEMOS = {
  demo1: {
    id: "demo1",
    name: "Demo 1 — Inventory & Purchase Orders",
    description:
      "How three reference-CRM API endpoints become a working AI agent — configured in under 10 minutes, zero code.",
    status: "active",

    // ⭐ THE MOAT — the single biggest selling point.
    //    Shown at the very top of the page, right after the header.
    //    Framing is YC-first: structural advantage, distribution, one
    //    artifact. CRM-vendor detail is nested inside as the "how".
    moat: {
      eyebrow: "The structural advantage",
      headline:
        "Ship one agent. Every restaurant on your platform inherits it.",
      subhead:
        "One base configuration. Thousands of downstream tenants. Per-tenant overrides for the chains that want them — without forking the agent, without per-customer integration work, without an AI team.",

      // ⭐ Concrete scale illustration — the number a YC partner or a
      //    CRM VP of Product actually remembers.
      scaleDiagram: {
        base: "1 base agent",
        inherited: { count: "4,200", label: "restaurants inherit it automatically" },
        overrides: { count: "87", label: "chains pin custom overrides" },
        pushes: { count: "1", label: "push updates all 4,113 downstream apps" },
      },

      // ⭐ Three pillars — the "how". Each is one sentence of the
      //    moat, in plain structural language.
      pillars: [
        {
          step: "01",
          title: "Build once",
          body:
            "You build the agent against your CRM's APIs — chain editor, no code, ~7 minutes. One artifact to maintain forever.",
        },
        {
          step: "02",
          title: "Fan out",
          body:
            "Every downstream restaurant, franchise location, and chain that signs up on your platform inherits the agent pre-scoped to their own tenant data. Day-one AI, zero per-customer setup.",
        },
        {
          step: "03",
          title: "Override per tenant",
          body:
            "Chains that want their own supplier list, thresholds, or auth get tenant-scoped config overrides — data, not code. The base agent stays single; the variations stay isolated.",
        },
      ],
    },

    // ⭐ Headline pitch — YC / CRM-vendor framing
    pitch: {
      oneLiner:
        "Vertical SaaS CRMs already own the data. Sageion turns their raw APIs into a distribution layer for AI.",
      whyNow:
        "Every vertical SaaS — Petpuja, Posist, Rista, and hundreds of others — is being asked by their customers to ship an AI layer on top of their existing product. Building that layer in-house means months of platform engineering and a new AI team. Sageion gives them that layer as a product: their APIs go in, an agent comes out — and every one of their customers inherits it on day one.",
    },

    // ⭐ Single consolidated build walkthrough (video + facts + APIs)
    buildWalkthrough: {
      title: "See how this agent was built — live, no code",
      subtitle:
        "A raw walkthrough of the exact steps: 3 API endpoints selected, 2 branch mappings wired, 1 chain published. Time to first agent: ~7 minutes. No editor, no CLI, no YAML.",
      videoUrl: null, // ← future: attach YouTube URL here
      videoPlaceholder:
        "YouTube walkthrough coming soon — drop the video URL in `demo.buildWalkthrough.videoUrl`",
      facts: [
        { label: "APIs used", value: "3 reference-CRM endpoints" },
        { label: "Chain steps", value: "3 nodes · 2 branches" },
        { label: "Build time", value: "~7 minutes" },
        { label: "Code written", value: "0 lines" },
      ],
      apis: [
        {
          name: "GET /inventory/:material_id",
          purpose: "Read live stock for the requested ingredient.",
        },
        {
          name: "POST /purchase-orders",
          purpose: "Create a pending PO against the chosen supplier.",
        },
        {
          name: "PATCH /purchase-orders/:po_id/approve",
          purpose: "Approve the PO and update inventory in one shot.",
        },
      ],
    },

    purpose: {
      whatWeDo:
        "Sageion turns the APIs a vertical SaaS already exposes into a production-grade AI agent. Select your endpoints, wire the branches, publish. No SDK, no prompt engineering, no new infrastructure.",
      whyItMatters:
        "For a vertical SaaS vendor, that means every one of their customers gets an AI assistant on day one — powered by the vendor's own data and APIs, governed by the vendor's own auth and scope rules. For the end restaurant, it means the CRM they already pay for suddenly talks back.",
    },

    workflows: [
      {
        title: "View stock / low-stock alerts",
        content:
          "The agent calls the inventory endpoint with the ingredient the user names. The response includes current quantity and the low-stock threshold, so the agent can flag a shortage in plain language before the kitchen runs dry.",
        // video: "/videos/inventory-stock.mp4",
      },
      {
        title: "Raise a purchase order",
        content:
          "If stock is low, the agent maps the response into a PO payload — supplier, material, quantity, unit — and calls the purchase-orders endpoint. A real PO is created in the CRM, not a mock, not a shadow copy.",
        // video: "/videos/raise-po.mp4",
      },
      {
        title: "Approve order & update inventory",
        content:
          "Once the supplier confirms, the agent calls the approve endpoint. The CRM marks the PO approved and increments stock in the same transaction. The user just says 'yes' — three APIs, one conversation.",
        // video: "/videos/approve-po.mp4",
      },
    ],

    // ⭐ Secondary capability detail — the "operate at scale" support
    //    story, below the moat banner.
    capabilityAtScale: {
      heading: "The operational consequences of the fan-out model",
      intro:
        "Once the base agent is inherited by every downstream tenant, the operational math changes. Here is what Sageion takes off your team's plate.",
      points: [
        {
          title: "Tenant isolation at the API boundary",
          body:
            "Every agent run is bound to a tenant identity, an app scope, and a per-app API key. Cross-tenant data leakage is not a policy the model has to respect — it's a boundary the runtime enforces before any request goes out.",
        },
        {
          title: "Your auth, your scopes, your governance",
          body:
            "OAuth connections, secondary auth flows, per-app API keys, and attached tenant-wide resources flow through Sageion's scope-attachment model unchanged. Your security posture is your security posture — Sageion does not introduce a parallel one.",
        },
        {
          title: "Rollout with zero coordination cost",
          body:
            "Publishing a new version of the agent is a single click. It propagates to every downstream tenant that has not pinned an override. Chains that have customized their agent keep their customization; everyone else moves forward automatically.",
        },
        {
          title: "Operate one agent, not thousands of integrations",
          body:
            "You don't provision one AI stack per customer. You provision one Sageion agent per workflow, and the platform fans it out. Support, observability, and upgrades are centralized — the same way your existing product is centralized today.",
        },
      ],
    },

    // ⭐ "Why this matters for CRMs" — the pitch to Petpuja/Posist/Rista
    crmAngle: {
      heading: "Built for vertical SaaS CRMs, not for one restaurant",
      intro:
        "Petpuja, Posist, Rista, and the hundreds of other vertical SaaS CRMs in this space don't sell software to one restaurant — they sell infrastructure to thousands of them. Sageion is priced and architected for that reality.",
      points: [
        {
          title: "Your APIs, unmodified",
          body:
            "Sageion consumes your existing REST endpoints — auth headers, path params, query strings, body payloads. Nothing is mocked, wrapped, or refactored.",
        },
        {
          title: "Your customers, individually",
          body:
            "Every app on your platform gets its own tenant-scoped agent. The same three APIs can power a thousand distinct assistants without a thousand integration sprints.",
        },
        {
          title: "Your governance, preserved",
          body:
            "Per-app API keys, tenant-scoped auth configs, and OAuth connections flow through unchanged. Sageion never gets credentials it shouldn't.",
        },
        {
          title: "Your team, freed up",
          body:
            "No AI platform to build, no prompt engineering to maintain, no agent runtime to operate. The vertical SaaS ships the feature; Sageion runs the underlying AI layer.",
        },
      ],
    },

    // ⭐ "Reference CRM" framing — how this generalizes beyond restaurants
    referenceCrm: {
      heading: "A reference CRM, not a one-off demo",
      body:
        "This demo uses Petpuja-shaped endpoints because they exemplify the vertical SaaS CRM pattern: read a record, create a downstream record, approve it, update the source. That is the same shape every vertical SaaS exposes — inventory in retail, patient records in clinics, work orders in field services, tickets in any B2B SaaS. The agent you see here mirrors that pattern in the open. The same three-endpoint chain works, verbatim, against any vertical SaaS that exposes a similar REST surface.",
      callout:
        "We built this against a reference CRM so the pipeline is legible. If your CRM exposes the same shape — read, mutate, approve — the agent you see here is the agent you ship.",
    },
  },
};

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

  const currentWorkflow =
    demo.workflows?.[openAccordion] || demo.workflows?.[0];
  const currentVideo = currentWorkflow?.video;

  return (
    <div style={{ padding: "clamp(24px, 4vw, 64px)" }}>
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>
        {/* ---------------- HEADER ---------------- */}
        <div style={{ textAlign: "center" }}>
          <h1 style={{ margin: 0, fontSize: 28 }}>{demo.name}</h1>
          <p className="muted" style={{ marginTop: 6 }}>
            {demo.description}
          </p>
        </div>

        {/* ---------------- TOP BAR: Back + Try me ---------------- */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginTop: 20,
            marginBottom: 24,
            flexWrap: "wrap",
          }}
        >
          <Link href="/demos" className="btn btn-ghost">
            ← Back
          </Link>
          <button
            className="btn btn-primary"
            onClick={() => {
              localStorage.setItem("active_demo", id);
              window.location.assign("/owner");
            }}
            style={{
              padding: "12px 24px",
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            Try me →
          </button>
        </div>

        {/* ---------------- MOAT BANNER (the #1 selling point) ---------------- */}
        {demo.moat && (
          <div
            style={{
              marginBottom: 24,
              padding: "28px 32px",
              background: "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)",
              border: "1px solid #c7d2fe",
              borderRadius: "var(--radius)",
              boxShadow: "var(--shadow)",
            }}
          >
            <div
              style={{
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontWeight: 700,
                color: "#4338ca",
                marginBottom: 10,
              }}
            >
              {demo.moat.eyebrow}
            </div>
            <h2
              style={{
                margin: "0 0 10px 0",
                fontSize: 24,
                lineHeight: 1.25,
                color: "#1e1b4b",
                letterSpacing: "-0.01em",
              }}
            >
              {demo.moat.headline}
            </h2>
            <p
              style={{
                margin: "0 0 24px 0",
                fontSize: 15,
                lineHeight: 1.6,
                color: "#3730a3",
              }}
            >
              {demo.moat.subhead}
            </p>

            {/* Scale diagram */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                gap: 12,
                marginBottom: 24,
              }}
              className="moat-scale-grid"
            >
              <div
                style={{
                  padding: "14px 16px",
                  background: "#ffffff",
                  border: "1px solid #c7d2fe",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 600, color: "#4338ca" }}>
                  {demo.moat.scaleDiagram.base}
                </div>
                <div style={{ fontSize: 12, color: "#6366f1", marginTop: 4 }}>
                  what you maintain
                </div>
              </div>
              <div
                style={{
                  padding: "14px 16px",
                  background: "#ffffff",
                  border: "1px solid #c7d2fe",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                <div
                  style={{ fontSize: 22, fontWeight: 700, color: "#1e1b4b" }}
                >
                  {demo.moat.scaleDiagram.inherited.count}
                </div>
                <div
                  style={{ fontSize: 12, color: "#4f46e5", marginTop: 2, lineHeight: 1.4 }}
                >
                  {demo.moat.scaleDiagram.inherited.label}
                </div>
              </div>
              <div
                style={{
                  padding: "14px 16px",
                  background: "#ffffff",
                  border: "1px solid #c7d2fe",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                <div
                  style={{ fontSize: 22, fontWeight: 700, color: "#1e1b4b" }}
                >
                  {demo.moat.scaleDiagram.overrides.count}
                </div>
                <div
                  style={{ fontSize: 12, color: "#4f46e5", marginTop: 2, lineHeight: 1.4 }}
                >
                  {demo.moat.scaleDiagram.overrides.label}
                </div>
              </div>
              <div
                style={{
                  padding: "14px 16px",
                  background: "#ffffff",
                  border: "1px solid #c7d2fe",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                <div
                  style={{ fontSize: 22, fontWeight: 700, color: "#1e1b4b" }}
                >
                  {demo.moat.scaleDiagram.pushes.count} push
                </div>
                <div
                  style={{ fontSize: 12, color: "#4f46e5", marginTop: 2, lineHeight: 1.4 }}
                >
                  {demo.moat.scaleDiagram.pushes.label}
                </div>
              </div>
            </div>

            {/* Three pillars */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 14,
              }}
              className="moat-pillars-grid"
            >
              {demo.moat.pillars.map((p) => (
                <div
                  key={p.step}
                  style={{
                    padding: "16px 18px",
                    background: "#ffffff",
                    border: "1px solid #c7d2fe",
                    borderRadius: "var(--radius-sm)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      color: "#6366f1",
                      marginBottom: 6,
                    }}
                  >
                    {p.step}
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#1e1b4b",
                      marginBottom: 6,
                    }}
                  >
                    {p.title}
                  </div>
                  <div
                    style={{
                      fontSize: 12.5,
                      lineHeight: 1.55,
                      color: "#3730a3",
                    }}
                  >
                    {p.body}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- PITCH BANNER ---------------- */}
        {demo.pitch && (
          <div
            style={{
              marginBottom: 24,
              padding: "20px 24px",
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              boxShadow: "var(--shadow)",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 15,
                fontWeight: 600,
                color: "var(--text)",
              }}
            >
              {demo.pitch.oneLiner}
            </p>
            <p
              className="muted small"
              style={{ margin: "8px 0 0 0", lineHeight: 1.6 }}
            >
              {demo.pitch.whyNow}
            </p>
          </div>
        )}

        {/* ---------------- HERO CARD ---------------- */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 32,
            padding: 32,
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            boxShadow: "var(--shadow)",
            marginBottom: 32,
          }}
          className="demo-hero"
        >
          {/* ⭐ LEFT: Workflows Accordion */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: 13,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "var(--text-muted)",
                  marginBottom: 10,
                }}
              >
                Inventory Workflows Covered
              </h3>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)",
                  overflow: "hidden",
                }}
              >
                {(demo.workflows || []).map((w, i) => {
                  const isOpen = openAccordion === i;
                  return (
                    <div
                      key={i}
                      style={{
                        borderBottom:
                          i < demo.workflows.length - 1
                            ? "1px solid var(--border)"
                            : "none",
                      }}
                    >
                      <button
                        onClick={() => setOpenAccordion(isOpen ? null : i)}
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "14px 16px",
                          background: isOpen
                            ? "var(--surface-2)"
                            : "var(--surface)",
                          border: "none",
                          cursor: "pointer",
                          fontSize: 14,
                          fontWeight: 500,
                          textAlign: "left",
                          color: "var(--text)",
                          transition: "background 0.15s",
                        }}
                      >
                        <span style={{ display: "flex", gap: 8 }}>
                          <span style={{ color: "var(--text-muted)" }}></span>
                          {w.title}
                        </span>
                        <span
                          style={{
                            color: "var(--text-muted)",
                            transition: "transform 0.2s",
                            transform: isOpen
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                          }}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                        </span>
                      </button>

                      {isOpen && (
                        <div
                          style={{
                            padding: "0 16px 16px 16px",
                            fontSize: 14,
                            color: "var(--text-muted)",
                            lineHeight: 1.6,
                          }}
                        >
                          {w.content}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ⭐ RIGHT: Build walkthrough (video + facts + APIs) */}
          {demo.buildWalkthrough && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <h3
                style={{
                  fontSize: 13,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "var(--text-muted)",
                  marginBottom: 10,
                }}
              >
                {demo.buildWalkthrough.title}
              </h3>

              <p
                className="muted small"
                style={{
                  margin: "0 0 14px 0",
                  lineHeight: 1.55,
                  fontSize: 13,
                }}
              >
                {demo.buildWalkthrough.subtitle}
              </p>

              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "16 / 9",
                  background: "#0f172a",
                  borderRadius: "var(--radius-sm)",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                  color: "#cbd5e1",
                  textAlign: "center",
                  padding: 24,
                  marginBottom: 16,
                }}
              >
                {demo.buildWalkthrough.videoUrl ? (
                  <iframe
                    src={demo.buildWalkthrough.videoUrl}
                    title="Build walkthrough"
                    style={{ width: "100%", height: "100%", border: "none" }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <>
                    <svg
                      width="52"
                      height="52"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#94a3b8"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
                      <path d="M10 9l5 3-5 3V9z" fill="#94a3b8" />
                    </svg>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        maxWidth: 420,
                        lineHeight: 1.5,
                      }}
                    >
                      {demo.buildWalkthrough.videoPlaceholder}
                    </div>
                  </>
                )}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: 8,
                  marginBottom: 14,
                }}
                className="build-facts-grid"
              >
                {demo.buildWalkthrough.facts.map((f) => (
                  <div
                    key={f.label}
                    style={{
                      padding: "8px 10px",
                      background: "var(--surface-2)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-sm)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        color: "var(--text-muted)",
                        marginBottom: 2,
                      }}
                    >
                      {f.label}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>
                      {f.value}
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "var(--text-muted)",
                  marginBottom: 6,
                }}
              >
                APIs wired in the agent
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                {demo.buildWalkthrough.apis.map((api) => (
                  <div
                    key={api.name}
                    style={{
                      padding: "8px 10px",
                      background: "var(--surface-2)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-sm)",
                    }}
                  >
                    <code
                      style={{
                        fontSize: 11.5,
                        fontWeight: 600,
                        color: "#1e293b",
                        display: "block",
                        marginBottom: 2,
                      }}
                    >
                      {api.name}
                    </code>
                    <div
                      className="muted small"
                      style={{ fontSize: 11.5, lineHeight: 1.45 }}
                    >
                      {api.purpose}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FULL WIDTH: Purpose Text Block */}
          {demo.purpose && (
            <div
              style={{
                gridColumn: "1 / -1",
                marginTop: 8,
                padding: "16px",
                background: "var(--surface-2)",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border)",
              }}
            >
              <h4
                style={{
                  margin: "0 0 8px 0",
                  fontSize: 14,
                  color: "var(--text)",
                }}
              >
                What we do
              </h4>
              <p
                className="muted small"
                style={{ margin: "0 0 16px 0", lineHeight: 1.5 }}
              >
                {demo.purpose.whatWeDo}
              </p>

              <h4
                style={{
                  margin: "0 0 8px 0",
                  fontSize: 14,
                  color: "var(--text)",
                }}
              >
                Why it matters
              </h4>
              <p
                className="muted small"
                style={{ margin: 0, lineHeight: 1.5 }}
              >
                {demo.purpose.whyItMatters}
              </p>
            </div>
          )}

          {/* Capability at scale — the operational consequences */}
          {demo.capabilityAtScale && (
            <div
              style={{
                gridColumn: "1 / -1",
                marginTop: 8,
                padding: "20px 24px",
                background: "var(--surface-2)",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border)",
              }}
            >
              <h4
                style={{
                  margin: "0 0 8px 0",
                  fontSize: 16,
                  color: "var(--text)",
                }}
              >
                {demo.capabilityAtScale.heading}
              </h4>
              <p
                className="muted small"
                style={{ margin: "0 0 16px 0", lineHeight: 1.6 }}
              >
                {demo.capabilityAtScale.intro}
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: 12,
                }}
                className="capability-grid"
              >
                {demo.capabilityAtScale.points.map((p) => (
                  <div
                    key={p.title}
                    style={{
                      padding: "12px 14px",
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-sm)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--text)",
                        marginBottom: 4,
                      }}
                    >
                      {p.title}
                    </div>
                    <div
                      className="muted small"
                      style={{ fontSize: 12.5, lineHeight: 1.55 }}
                    >
                      {p.body}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CRM angle — the pitch to vertical SaaS vendors */}
          {demo.crmAngle && (
            <div
              style={{
                gridColumn: "1 / -1",
                marginTop: 8,
                padding: "20px 24px",
                background: "var(--surface-2)",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border)",
              }}
            >
              <h4
                style={{
                  margin: "0 0 8px 0",
                  fontSize: 16,
                  color: "var(--text)",
                }}
              >
                {demo.crmAngle.heading}
              </h4>
              {demo.crmAngle.intro && (
                <p
                  className="muted small"
                  style={{ margin: "0 0 16px 0", lineHeight: 1.6 }}
                >
                  {demo.crmAngle.intro}
                </p>
              )}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: 12,
                }}
                className="crm-angle-grid"
              >
                {demo.crmAngle.points.map((p) => (
                  <div
                    key={p.title}
                    style={{
                      padding: "12px 14px",
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-sm)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--text)",
                        marginBottom: 4,
                      }}
                    >
                      {p.title}
                    </div>
                    <div
                      className="muted small"
                      style={{ fontSize: 12.5, lineHeight: 1.55 }}
                    >
                      {p.body}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reference CRM framing — the only amber-tinted callout,
              reserved so it visually pops as "important caveat". */}
          {demo.referenceCrm && (
            <div
              style={{
                gridColumn: "1 / -1",
                marginTop: 8,
                padding: "20px 24px",
                background: "#fef3c7",
                borderRadius: "var(--radius-sm)",
                border: "1px solid #fde68a",
              }}
            >
              <h4
                style={{
                  margin: "0 0 8px 0",
                  fontSize: 16,
                  color: "#78350f",
                }}
              >
                {demo.referenceCrm.heading}
              </h4>
              <p
                className="muted small"
                style={{
                  margin: "0 0 12px 0",
                  lineHeight: 1.6,
                  color: "#78350f",
                }}
              >
                {demo.referenceCrm.body}
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  fontWeight: 500,
                  lineHeight: 1.6,
                  color: "#92400e",
                  fontStyle: "italic",
                }}
              >
                {demo.referenceCrm.callout}
              </p>
            </div>
          )}

          {/* CTA row — bottom */}
          <div
            style={{
              gridColumn: "1 / -1",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <button
              className="btn btn-primary"
              onClick={() => {
                localStorage.setItem("active_demo", id);
                window.location.assign("/owner");
              }}
            >
              Try me →
            </button>
          </div>
        </div>
      </div>

      {/* Responsive tweak */}
      <style jsx>{`
        @media (max-width: 800px) {
          .demo-hero {
            grid-template-columns: 1fr !important;
          }
          .moat-scale-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .moat-pillars-grid {
            grid-template-columns: 1fr !important;
          }
          .build-facts-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .crm-angle-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}