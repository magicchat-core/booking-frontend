"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

const DEMOS = {
  demo1: {
    id: "demo1",
    name: "Demo 1 — Inventory & Purchase Orders",
    description:
      "Walk through: view stock → raise a PO → approve → stock updates.",
    status: "active",
    purpose: {
      whatWeDo:
        "We streamline your entire supply chain. From real-time stock alerts to automated PO generation, we handle the busy work so you can focus on running the kitchen.",
      whyItMatters:
        "Running out of ingredients during a dinner rush is costly. This workflow prevents stockouts, eliminates manual data entry errors, and keeps your inventory perfectly synced with your suppliers.",
    },
    workflows: [
      {
        title: "View stock / low-stock alerts",
        content:
          "Easily see what is running low. The dashboard highlights items below their threshold in red, so you know exactly what needs to be reordered before you run out.",
        video: "/videos/inventory-stock.mp4",
      },
      {
        title: "Raise a purchase order",
        content:
          "Select a supplier and the materials you need. The system generates a pending PO that you can track. No more manual spreadsheets or lost emails.",
        video: "/videos/raise-po.mp4",
      },
      {
        title: "Approve order & update inventory",
        content:
          "Once the order arrives, click approve. The system automatically adds the received quantities to your live inventory, keeping your stock counts perfectly accurate in real-time.",
        video: "/videos/approve-po.mp4",
      },
    ],
  },
  demo2: {
    id: "demo2",
    name: "Demo 2 — Cloud Kitchen",
    description: "Delivery-only kitchen with order dispatch.",
    status: "active",
    purpose: {
      whatWeDo:
        "A streamlined interface designed for high-volume delivery operations.",
      whyItMatters:
        "Keep riders moving and orders hot without the dine-in overhead.",
    },
    workflows: [
      {
        title: "Coming soon",
        content: "This feature is currently in development.",
        video: null,
      },
    ],
  },
  demo3: {
    id: "demo3",
    name: "Demo 3 — Café",
    description: "Quick-serve café with menu availability.",
    status: "paused",
    purpose: {
      whatWeDo: "Fast, simple point-of-sale integration for walk-up cafes.",
      whyItMatters:
        "Reduce wait times and keep the morning rush moving smoothly.",
    },
    workflows: [
      {
        title: "Coming soon",
        content: "This feature is currently in development.",
        video: null,
      },
    ],
  },
};

// ============================================================
// Demo Detail Wrapper
// ============================================================
export default function DemoDetail() {
  const { id } = useParams();
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
        <Link href="/demos" className="btn btn-ghost">
          ← Back to demos
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
        <div style={{ textAlign: "centerF" }}>
          <h1 style={{ margin: 0, fontSize: 28 }}>{demo.name}</h1>
          <p className="muted" style={{ marginTop: 6 }}>
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
          {/* Left: Workflows Accordion */}
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
                          <span style={{ color: "var(--text-muted)" }}>
                            {/* {i + 1}. */}
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

          {/* Right: Dynamic Video Placeholder + CTA */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Video Box */}
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
              }}
            >
              {currentVideo ? (
                <video
                  key={currentVideo}
                  src={currentVideo}
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

          {/* FULL WIDTH: Purpose Text Block */}

          {demo.purpose && (
            <div
              style={{
                gridColumn: "1 / -1", // <--- This makes it span full width
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
              <p className="muted small" style={{ margin: 0, lineHeight: 1.5 }}>
                {demo.purpose.whyItMatters}
              </p>
            </div>
          )}
          <div
            style={{
              gridColumn: "1 / -1",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <button
              style={{ minWidth: 140 }}
              className="btn btn-primary"
              onClick={() => router.push("/owner")}
            >
              Try me
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
        }
      `}</style>
    </div>
  );
}
