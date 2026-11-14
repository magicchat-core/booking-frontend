"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getDemo } from "@/demos"; // ⭐ Import the dynamic registry

// ============================================================
// Small helpers — kept inline so the file stays single-file
// ============================================================
const METHOD_COLOR = {
  GET: { bg: "#dcfce7", fg: "#166534", border: "#bbf7d0" },
  POST: { bg: "#dbeafe", fg: "#1e40af", border: "#bfdbfe" },
  PATCH: { bg: "#fef3c7", fg: "#92400e", border: "#fde68a" },
  PUT: { bg: "#fef3c7", fg: "#92400e", border: "#fde68a" },
  DELETE: { bg: "#fee2e2", fg: "#991b1b", border: "#fecaca" },
};

function MethodPill({ method }) {
  const c = METHOD_COLOR[method] || METHOD_COLOR.GET;
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.04em",
        borderRadius: 4,
        background: c.bg,
        color: c.fg,
        border: `1px solid ${c.border}`,
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        flexShrink: 0,
        minWidth: 52,
        textAlign: "center",
      }}
    >
      {method}
    </span>
  );
}

// ============================================================
// Demo Detail Wrapper
// ============================================================
export default function DemoDetail({ id }) {
  const router = useRouter();
  
  // ⭐ Fetch the demo dynamically from our new folder structure
  const demo = getDemo(id); 

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

  const tryMe = () => {
    localStorage.setItem("active_demo", id);
    window.location.assign("/owner");
  };

  return (
    <div style={{ padding: "clamp(24px, 4vw, 64px)" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        {/* ============================================
            A. HEADER — title, tagline, top CTA
            ============================================ */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 16,
            marginBottom: 28,
            flexWrap: "wrap",
          }}
        >
          <div>
            <Link
              href="/demos"
              className="btn btn-ghost"
              style={{
                fontSize: 13,
                padding: "6px 0",
                marginBottom: 8,
                display: "inline-block",
              }}
            >
              ← All demos
            </Link>
            <h1
              style={{
                margin: 0,
                fontSize: "clamp(22px, 3vw, 30px)",
                lineHeight: 1.2,
                letterSpacing: "-0.01em",
              }}
            >
              {demo.name}
            </h1>
            <p
              className="muted"
              style={{
                margin: "8px 0 0 0",
                fontSize: 15,
                lineHeight: 1.5,
                maxWidth: 720,
              }}
            >
              {demo.description}
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={tryMe}
            style={{
              padding: "12px 24px",
              fontSize: 15,
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            Try me →
          </button>
        </div>

        {/* ============================================
            B. HERO — Video (left) + Workflows (right)
            ============================================ */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.25fr) minmax(0, 1fr)",
            gap: 24,
            marginBottom: 32,
          }}
          className="hero-grid"
        >
          {/* B1 — VIDEO COLUMN */}
          {demo.buildWalkthrough && (
            <div
              style={{
                padding: "20px",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                boxShadow: "var(--shadow)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ marginBottom: 14 }}>
                <div
                  style={{
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    fontWeight: 700,
                    color: "var(--text-muted)",
                    marginBottom: 4,
                  }}
                >
                  Build walkthrough
                </div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: 18,
                    lineHeight: 1.3,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {demo.buildWalkthrough.title}
                </h2>
                <p
                  className="muted"
                  style={{
                    margin: "6px 0 0 0",
                    fontSize: 13,
                    lineHeight: 1.5,
                  }}
                >
                  {demo.buildWalkthrough.subtitle}
                </p>
              </div>

              {/* Video placeholder */}
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
                  gap: 10,
                  color: "#cbd5e1",
                  textAlign: "center",
                  padding: 20,
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
                      width="48"
                      height="48"
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
                        fontSize: 12.5,
                        fontWeight: 500,
                        maxWidth: 380,
                        lineHeight: 1.5,
                        color: "#94a3b8",
                      }}
                    >
                      {demo.buildWalkthrough.videoPlaceholder}
                    </div>
                  </>
                )}
              </div>

              {/* Facts as pills */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                  gap: 8,
                  marginBottom: 16,
                }}
                className="facts-grid"
              >
                {demo.buildWalkthrough.facts.map((f) => (
                  <div
                    key={f.label}
                    style={{
                      padding: "8px 10px",
                      background: "var(--surface-2)",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--border)",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "var(--text)",
                        lineHeight: 1.1,
                      }}
                    >
                      {f.value.split(" ")[0]}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        color: "var(--text-muted)",
                        marginTop: 3,
                      }}
                    >
                      {f.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* API list */}
              <div
                style={{
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  marginBottom: 8,
                }}
              >
                APIs wired in the agent
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {demo.buildWalkthrough.apis.map((api) => (
                  <div
                    key={api.path}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "8px 10px",
                      background: "var(--surface-2)",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <MethodPill method={api.method} />
                    <code
                      style={{
                        fontSize: 11.5,
                        fontFamily:
                          "ui-monospace, SFMono-Regular, Menlo, monospace",
                        color: "var(--text)",
                        flex: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {api.path}
                    </code>
                    <span
                      className="muted"
                      style={{
                        fontSize: 11,
                        flexShrink: 0,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {api.purpose}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* B2 — WORKFLOWS COLUMN */}
          <div
            style={{
              padding: "20px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              boxShadow: "var(--shadow)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ marginBottom: 14 }}>
              <div
                style={{
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  marginBottom: 4,
                }}
              >
                What the agent does
              </div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 18,
                  lineHeight: 1.3,
                  letterSpacing: "-0.01em",
                }}
              >
                Inventory workflows covered
              </h2>
              <p
                className="muted"
                style={{
                  margin: "6px 0 0 0",
                  fontSize: 13,
                  lineHeight: 1.5,
                }}
              >
                Three REST calls, one conversation. Click any step.
              </p>
            </div>

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
                        padding: "12px 14px",
                        background: isOpen
                          ? "var(--surface-2)"
                          : "var(--surface)",
                        border: "none",
                        cursor: "pointer",
                        fontSize: 13.5,
                        fontWeight: 500,
                        textAlign: "left",
                        color: "var(--text)",
                        transition: "background 0.15s",
                      }}
                    >
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            background: isOpen
                              ? "var(--text)"
                              : "var(--surface-2)",
                            color: isOpen
                              ? "var(--surface)"
                              : "var(--text-muted)",
                            fontSize: 10.5,
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          {i + 1}
                        </span>
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
                          width="14"
                          height="14"
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
                          padding: "0 14px 14px 44px",
                          fontSize: 13,
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

        {/* ============================================
            C. PURPOSE — two-column "What we do / Why it matters"
            ============================================ */}
        {demo.purpose && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 20,
              padding: "20px 24px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              boxShadow: "var(--shadow)",
              marginBottom: 32,
            }}
            className="purpose-grid"
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  marginBottom: 6,
                }}
              >
                What we do
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: "var(--text)",
                }}
              >
                {demo.purpose.whatWeDo}
              </p>
            </div>
            <div
              className="purpose-divider"
              style={{ borderLeft: "1px solid var(--border)", paddingLeft: 20 }}
            >
              <div
                style={{
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  marginBottom: 6,
                }}
              >
                Why it matters
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: "var(--text)",
                }}
              >
                {demo.purpose.whyItMatters}
              </p>
            </div>
          </div>
        )}

        {/* ============================================
            D. MOAT BANNER — the "so what"
            ============================================ */}
        {demo.moat && (
          <div
            style={{
              marginBottom: 32,
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
                marginBottom: 8,
              }}
            >
              {demo.moat.eyebrow}
            </div>
            <h2
              style={{
                margin: "0 0 10px 0",
                fontSize: "clamp(20px, 2.5vw, 26px)",
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
                fontSize: 14.5,
                lineHeight: 1.6,
                color: "#3730a3",
                maxWidth: 800,
              }}
            >
              {demo.moat.subhead}
            </p>

            {/* Funnel */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto 1fr auto 1fr auto 1fr",
                alignItems: "center",
                gap: 10,
                marginBottom: 24,
              }}
              className="funnel-grid"
            >
              {(() => {
                const d = demo.moat.scaleDiagram;
                const items = [d.base, d.inherited, d.overrides, d.pushes];
                const arrows = ["→", "→", "→"];
                const nodes = [];
                items.forEach((item, i) => {
                  nodes.push(
                    <div
                      key={`n-${i}`}
                      style={{
                        padding: "12px 14px",
                        background: "#ffffff",
                        border: "1px solid #c7d2fe",
                        borderRadius: "var(--radius-sm)",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 22,
                          fontWeight: 700,
                          color: "#1e1b4b",
                          lineHeight: 1.1,
                        }}
                      >
                        {item.count}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "#4f46e5",
                          marginTop: 4,
                          lineHeight: 1.35,
                        }}
                      >
                        {item.label}
                      </div>
                    </div>,
                  );
                  if (i < arrows.length) {
                    nodes.push(
                      <div
                        key={`a-${i}`}
                        style={{
                          fontSize: 18,
                          color: "#6366f1",
                          fontWeight: 600,
                        }}
                      >
                        {arrows[i]}
                      </div>,
                    );
                  }
                });
                return nodes;
              })()}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 14,
              }}
              className="pillars-grid"
            >
              {demo.moat.pillars.map((p) => (
                <div
                  key={p.step}
                  style={{
                    padding: "14px 16px",
                    background: "#ffffff",
                    border: "1px solid #c7d2fe",
                    borderRadius: "var(--radius-sm)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      color: "#6366f1",
                      marginBottom: 4,
                    }}
                  >
                    {p.step}
                  </div>
                  <div
                    style={{
                      fontSize: 13.5,
                      fontWeight: 600,
                      color: "#1e1b4b",
                      marginBottom: 4,
                    }}
                  >
                    {p.title}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
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

        {/* ============================================
            E. CONNECTORS — extension story
            ============================================ */}
        {demo.connectorsSection && (
          <div
            style={{
              marginBottom: 32,
              padding: "28px 32px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
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
                color: "var(--text-muted)",
                marginBottom: 8,
              }}
            >
              {demo.connectorsSection.eyebrow}
            </div>
            <h2
              style={{
                margin: "0 0 10px 0",
                fontSize: "clamp(20px, 2.5vw, 24px)",
                lineHeight: 1.3,
                letterSpacing: "-0.01em",
                color: "var(--text)",
                maxWidth: 820,
              }}
            >
              {demo.connectorsSection.headline}
            </h2>
            <p
              className="muted"
              style={{
                margin: "0 0 16px 0",
                fontSize: 14,
                lineHeight: 1.65,
                maxWidth: 900,
              }}
            >
              {demo.connectorsSection.subhead}
            </p>
            <p
              style={{
                margin: "0 0 24px 0",
                fontSize: 13.5,
                lineHeight: 1.65,
                color: "var(--text)",
                maxWidth: 900,
              }}
            >
              {demo.connectorsSection.lead}
            </p>

            {/* Categories grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 12,
                marginBottom: 24,
              }}
              className="connector-cat-grid"
            >
              {demo.connectorsSection.categories.map((cat) => (
                <div
                  key={cat.name}
                  style={{
                    padding: "14px 16px",
                    background: "var(--surface-2)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-sm)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 6,
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{cat.icon}</span>
                    <span
                      style={{
                        fontSize: 13.5,
                        fontWeight: 600,
                        color: "var(--text)",
                      }}
                    >
                      {cat.name}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--text-muted)",
                      fontFamily:
                        "ui-monospace, SFMono-Regular, Menlo, monospace",
                      marginBottom: 8,
                      lineHeight: 1.5,
                    }}
                  >
                    {cat.examples}
                  </div>
                  <div
                    style={{
                      fontSize: 12.5,
                      lineHeight: 1.6,
                      color: "var(--text)",
                    }}
                  >
                    {cat.detail}
                  </div>
                </div>
              ))}
            </div>

            {/* Chaining diagram */}
            <div
              style={{
                padding: "18px 20px",
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: "var(--text)",
                  marginBottom: 6,
                }}
              >
                {demo.connectorsSection.chaining.title}
              </div>
              <p
                className="muted"
                style={{
                  margin: "0 0 14px 0",
                  fontSize: 13,
                  lineHeight: 1.6,
                }}
              >
                {demo.connectorsSection.chaining.body}
              </p>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {demo.connectorsSection.chaining.diagram.map((row, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 12px",
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-sm)",
                      flexWrap: "wrap",
                    }}
                  >
                    <code
                      style={{
                        fontSize: 12,
                        fontFamily:
                          "ui-monospace, SFMono-Regular, Menlo, monospace",
                        color: "var(--text)",
                        flex: 1,
                        minWidth: 200,
                      }}
                    >
                      {row.node}
                    </code>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: "0.04em",
                        padding: "2px 8px",
                        borderRadius: 4,
                        background: "#dcfce7",
                        color: "#166534",
                        border: "1px solid #bbf7d0",
                      }}
                    >
                      {row.status}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        color: "var(--text-muted)",
                        fontFamily:
                          "ui-monospace, SFMono-Regular, Menlo, monospace",
                      }}
                    >
                      {row.connector}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Auth + positioning */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 16,
              }}
              className="connector-meta-grid"
            >
              <div>
                <div
                  style={{
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    fontWeight: 700,
                    color: "var(--text-muted)",
                    marginBottom: 6,
                  }}
                >
                  Auth & isolation
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    lineHeight: 1.65,
                    color: "var(--text)",
                  }}
                >
                  {demo.connectorsSection.auth}
                </p>
              </div>
              <div>
                <div
                  style={{
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    fontWeight: 700,
                    color: "var(--text-muted)",
                    marginBottom: 6,
                  }}
                >
                  Why it's a runtime, not a framework
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    lineHeight: 1.65,
                    color: "var(--text)",
                  }}
                >
                  {demo.connectorsSection.positioning}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ============================================
            F. PITCH — YC one-liner
            ============================================ */}
        {demo.pitch && (
          <div
            style={{
              marginBottom: 32,
              padding: "20px 24px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderLeft: "3px solid #4a7feb",
              borderRadius: "var(--radius)",
              boxShadow: "var(--shadow)",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 16,
                fontWeight: 600,
                color: "var(--text)",
                lineHeight: 1.4,
              }}
            >
              “{demo.pitch.oneLiner}”
            </p>
            <p
              className="muted"
              style={{
                margin: "10px 0 0 0",
                fontSize: 13.5,
                lineHeight: 1.6,
                color: "var(--text-muted)",
              }}
            >
              {demo.pitch.whyNow}
            </p>
          </div>
        )}

        {/* ============================================
            G. CAPABILITY AT SCALE
            ============================================ */}
        {demo.capabilityAtScale && (
          <div
            style={{
              marginBottom: 32,
              padding: "20px 24px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              boxShadow: "var(--shadow)",
            }}
          >
            <div
              style={{
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                fontWeight: 700,
                color: "var(--text-muted)",
                marginBottom: 6,
              }}
            >
              Operate at scale
            </div>
            <h3
              style={{
                margin: "0 0 8px 0",
                fontSize: 18,
                lineHeight: 1.3,
                letterSpacing: "-0.01em",
              }}
            >
              {demo.capabilityAtScale.heading}
            </h3>
            <p
              className="muted"
              style={{
                margin: "0 0 16px 0",
                fontSize: 13.5,
                lineHeight: 1.6,
              }}
            >
              {demo.capabilityAtScale.intro}
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 14,
              }}
              className="cap-grid"
            >
              {demo.capabilityAtScale.points.map((p) => (
                <div key={p.title}>
                  <div
                    style={{
                      fontSize: 13.5,
                      fontWeight: 600,
                      color: "var(--text)",
                      marginBottom: 4,
                    }}
                  >
                    {p.title}
                  </div>
                  <div
                    className="muted"
                    style={{
                      fontSize: 13,
                      lineHeight: 1.6,
                      color: "var(--text-muted)",
                    }}
                  >
                    {p.body}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================
            H. CRM ANGLE — slate banner
            ============================================ */}
        {demo.crmAngle && (
          <div
            style={{
              marginBottom: 32,
              padding: "24px 28px",
              background: "#0f172a",
              borderRadius: "var(--radius)",
              boxShadow: "var(--shadow)",
              color: "#e2e8f0",
            }}
          >
            <div
              style={{
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontWeight: 700,
                color: "#94a3b8",
                marginBottom: 8,
              }}
            >
              For CRM vendors
            </div>
            <h3
              style={{
                margin: "0 0 8px 0",
                fontSize: 20,
                lineHeight: 1.3,
                color: "#f1f5f9",
                letterSpacing: "-0.01em",
              }}
            >
              {demo.crmAngle.heading}
            </h3>
            {demo.crmAngle.intro && (
              <p
                style={{
                  margin: "0 0 20px 0",
                  fontSize: 13.5,
                  lineHeight: 1.6,
                  color: "#94a3b8",
                  maxWidth: 820,
                }}
              >
                {demo.crmAngle.intro}
              </p>
            )}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 16,
              }}
              className="crm-grid"
            >
              {demo.crmAngle.points.map((p) => (
                <div
                  key={p.title}
                  style={{
                    padding: "14px 16px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "var(--radius-sm)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 13.5,
                      fontWeight: 600,
                      color: "#f1f5f9",
                      marginBottom: 4,
                    }}
                  >
                    {p.title}
                  </div>
                  <div
                    style={{
                      fontSize: 12.5,
                      lineHeight: 1.6,
                      color: "#94a3b8",
                    }}
                  >
                    {p.body}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================
            I. REFERENCE CRM — amber caveat box
            ============================================ */}
        {demo.referenceCrm && (
          <div
            style={{
              marginBottom: 32,
              padding: "24px 28px",
              background: "#fffbeb",
              borderRadius: "var(--radius)",
              border: "1px solid #fde68a",
              borderLeft: "3px solid #f59e0b",
            }}
          >
            {demo.referenceCrm.eyebrow && (
              <div
                style={{
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  fontWeight: 700,
                  color: "#92400e",
                  marginBottom: 6,
                }}
              >
                {demo.referenceCrm.eyebrow}
              </div>
            )}
            <h3
              style={{
                margin: "0 0 10px 0",
                fontSize: 18,
                lineHeight: 1.3,
                color: "#78350f",
                letterSpacing: "-0.01em",
              }}
            >
              {demo.referenceCrm.heading}
            </h3>
            <p
              style={{
                margin: "0 0 14px 0",
                fontSize: 14,
                lineHeight: 1.6,
                color: "#78350f",
              }}
            >
              {demo.referenceCrm.body}
            </p>

            {demo.referenceCrm.offer && (
              <div
                style={{
                  padding: "14px 16px",
                  background: "#ffffff",
                  border: "1px solid #fde68a",
                  borderRadius: "var(--radius-sm)",
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    fontWeight: 700,
                    color: "#b45309",
                    marginBottom: 4,
                  }}
                >
                  What we need from you
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13.5,
                    lineHeight: 1.6,
                    color: "#78350f",
                  }}
                >
                  {demo.referenceCrm.offer}
                </p>
              </div>
            )}

            {demo.referenceCrm.callout && (
              <p
                style={{
                  margin: "0 0 8px 0",
                  fontSize: 13.5,
                  fontWeight: 500,
                  lineHeight: 1.6,
                  color: "#92400e",
                  fontStyle: "italic",
                }}
              >
                {demo.referenceCrm.callout}
              </p>
            )}

            {demo.referenceCrm.footnote && (
              <p
                style={{
                  margin: 0,
                  fontSize: 12.5,
                  lineHeight: 1.5,
                  color: "#a16207",
                  paddingTop: 8,
                  borderTop: "1px dashed #fcd34d",
                }}
              >
                {demo.referenceCrm.footnote}
              </p>
            )}
          </div>
        )}

        {/* ============================================
            J. FINAL CTA — bottom anchor
            ============================================ */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            padding: "32px 24px",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            boxShadow: "var(--shadow)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: "var(--text)",
            }}
          >
            See it running live
          </div>
          <p
            className="muted"
            style={{
              margin: 0,
              fontSize: 13.5,
              lineHeight: 1.5,
              maxWidth: 460,
            }}
          >
            Open the interactive demo and talk to the agent that these three
            APIs power.
          </p>
          <button
            className="btn btn-primary"
            onClick={tryMe}
            style={{
              padding: "14px 32px",
              fontSize: 15,
              fontWeight: 600,
              marginTop: 4,
            }}
          >
            Try me →
          </button>
        </div>
      </div>

      {/* Responsive tweak */}
      <style jsx>{`
        @media (max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
          }
          .purpose-grid {
            grid-template-columns: 1fr !important;
          }
          .purpose-divider {
            border-left: none !important;
            padding-left: 0 !important;
            border-top: 1px solid var(--border) !important;
            padding-top: 20px !important;
          }
          .cap-grid {
            grid-template-columns: 1fr !important;
          }
          .crm-grid {
            grid-template-columns: 1fr !important;
          }
          .connector-cat-grid {
            grid-template-columns: 1fr !important;
          }
          .connector-meta-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 700px) {
          .facts-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
          .funnel-grid {
            grid-template-columns: 1fr !important;
            gap: 8px !important;
          }
          .pillars-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}