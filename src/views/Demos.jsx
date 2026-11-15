"use client";

import Link from "next/link";
import { getAllDemos } from "@/demos";

export default function Demos() {
  const demos = getAllDemos();

  const features = [
    {
      icon: "⏱️",
      title: "10-Minute Setup",
      desc: "Stop building AI infrastructure from scratch. Wire up a production-grade workflow in a single afternoon.",
    },
    {
      icon: "💸",
      title: "Zero AI Hires Required",
      desc: "Your existing product team can build and launch this. No machine learning engineers, no new AI team needed.",
    },
    {
      icon: "🛡️",
      title: "Zero Maintenance Debt",
      desc: "We sit completely outside your codebase. Change your database or your UI—your AI won't break.",
    },
    {
      icon: "🖥️",
      title: "Live Admin Agility",
      desc: "Change 99% of agent logic, thresholds, and prompts live via our Admin UI. No code deployments required.",
    },
    {
      icon: "🎨",
      title: "Generative UI",
      desc: "If your API needs a date range, the AI generates a calendar picker right in the chat. No frontend dev required.",
    },
    {
      icon: "📈",
      title: "Instant Fan-Out",
      desc: "Maintain one base agent and instantly deploy it to 10,000 downstream tenants with fully isolated data.",
    },
    {
      icon: "💰",
      title: "Built-in Billing Engine",
      desc: "We track usage per tenant. Add your profit margin and automatically bill your customers. Turn AI into a profit center.",
    },
    {
      icon: "🚀",
      title: "Skip the Custom Build Rabbit Hole",
      desc: "Think you need to build your own AI agent in-house? Don't waste months of R&D. Prove the ROI with our runtime before you write a single line of custom AI code.",
    },
    {
      icon: "🧠",
      title: "Zero Hallucinations",
      desc: "We don't rely on an LLM's memory. The agent is grounded in your actual API responses, ensuring 100% accuracy and truth-based answers.",
    },
    {
      icon: "🔒",
      title: "Zero-Retention Privacy",
      desc: "We don't pull your data into our system. Everything runs at the boundary. Data is only saved if explicitly configured via the Admin UI for debugging.",
    },
    {
      icon: "🕵️‍♂️",
      title: "Full Node-Level Traceability",
      desc: "Complete visibility into every workflow. See exactly which node was hit, the payload sent, and the response returned for a perfect audit trail.",
    },
    {
      icon: "🎯",
      title: "Your APIs as the Source of Truth",
      desc: "The AI doesn't guess. It fetches live data directly from your REST endpoints, guaranteeing users only see what they are authorized to see.",
    },
  ];

  return (
    <div style={{ padding: "clamp(24px, 5vw, 64px)", maxWidth: "1200px", margin: "0 auto", color: "#f8fafc" }}>
      
      {/* ⭐ 1. HERO SECTION: The Hook */}
      <div style={{ textAlign: "center", marginBottom: "56px", marginTop: "32px" }}>
        <div style={{ 
          display: "inline-block", padding: "6px 14px", 
          background: "rgba(59, 130, 246, 0.15)",
          color: "#60a5fa", fontWeight: "700", fontSize: "12px", 
          borderRadius: "100px", marginBottom: "20px", letterSpacing: "0.05em",
          border: "1px solid rgba(59, 130, 246, 0.3)"
        }}>
          THE SAGEION RUNTIME
        </div>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: "800", margin: "0 0 20px 0", color: "#f8fafc", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
          Stop building AI infrastructure.<br/>Start shipping AI features.
        </h1>
        <p style={{ margin: "0 auto", fontSize: "18px", color: "#94a3b8", maxWidth: "720px", lineHeight: "1.6" }}>
          The framework trap requires months of engineering and brittle code. Sageion gives you a production runtime in minutes. Pick a live workflow below to see it in action.
        </p>
      </div>

      {/* ⭐ 2. VALUE PROPS: The 12-Card Grid */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", 
        gap: "20px", 
        marginBottom: "64px" 
      }}>
        {features.map((prop, i) => (
          <div key={i} style={{ 
            padding: "24px", 
            background: "#1e293b",
            border: "1px solid #334155", 
            borderRadius: "12px", 
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.2)",
          }}>
            <div style={{ fontSize: "28px", marginBottom: "14px" }}>{prop.icon}</div>
            <div style={{ fontSize: "16px", fontWeight: "700", color: "#f8fafc", marginBottom: "8px" }}>
              {prop.title}
            </div>
            <div style={{ fontSize: "14px", color: "#94a3b8", lineHeight: "1.6" }}>
              {prop.desc}
            </div>
          </div>
        ))}
      </div>

      {/* ⭐ 3. DEMO CARDS: The Interactive Offer */}
      <div style={{ marginBottom: "80px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#f8fafc", margin: 0 }}>
            Explore the Interactive Workflows
          </h2>
          <div style={{ height: "1px", background: "#334155", flex: 1 }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {demos.map((d) => (
            <Link
              key={d.id}
              href={`/demos/${d.id}`}
              style={{ textDecoration: "none", display: "block" }}
            >
              <div style={{ 
                background: "#1e293b", border: "1px solid #334155", borderRadius: "12px", 
                padding: "28px", transition: "all 0.2s ease", cursor: "pointer",
                display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
              }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = "#3b82f6"; e.currentTarget.style.boxShadow = "0 12px 24px rgba(59,130,246,0.15)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = "#334155"; e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{ flex: 1, minWidth: "280px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
                    <h3 style={{ fontSize: "22px", fontWeight: "700", color: "#f8fafc", margin: 0 }}>
                      {d.name}
                    </h3>
                    {d.status === "active" && (
                      <span style={{ fontSize: "12px", padding: "3px 10px", background: "rgba(16, 185, 129, 0.15)", color: "#34d399", fontWeight: "700", borderRadius: "100px", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                        Live Sandbox
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: "15px", color: "#94a3b8", margin: 0, lineHeight: "1.6", maxWidth: "700px" }}>
                    {d.description}
                  </p>
                </div>
                
                <div style={{ 
                  flexShrink: 0, display: "flex", alignItems: "center", gap: "8px", 
                  color: "#ffffff", fontWeight: "600", fontSize: "15px", 
                  background: "#3b82f6", padding: "12px 24px", borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(59,130,246,0.3)"
                }}>
                  Launch Demo →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ⭐ 4. THE TWO-PART BOTTOM SELL */}
      <div style={{ 
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)", 
        borderRadius: "20px", padding: "clamp(32px, 5vw, 56px)", 
        border: "1px solid #334155",
        boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
      }}>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", 
          gap: "48px",
          alignItems: "center"
        }}>
          
          {/* Left Column: The Immediate Hook (Custom Demo) */}
          <div>
            <h2 style={{ fontSize: "clamp(24px, 3vw, 32px)", fontWeight: "800", margin: "0 0 16px 0", color: "#f8fafc", lineHeight: 1.2 }}>
              Want this for your CRM?
            </h2>
            <p style={{ fontSize: "16px", color: "#cbd5e1", margin: "0 0 24px 0", lineHeight: "1.6" }}>
              We built this against a reference CRM, but yours can look exactly like your product. Share sandbox credentials for one flow, and we'll build a live, customized demo in <strong>7–14 days</strong>.
            </p>
            <a 
              href="mailto:founders@sageion.com"
              style={{ 
                background: "#3b82f6", color: "#ffffff", padding: "14px 28px", 
                borderRadius: "8px", fontWeight: "700", fontSize: "16px", 
                textDecoration: "none", display: "inline-block",
                boxShadow: "0 4px 12px rgba(59,130,246,0.3)", transition: "all 0.2s"
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              Book a 15-Min Demo →
            </a>
            <div style={{ fontSize: "13px", color: "#64748b", marginTop: "12px", fontWeight: "500" }}>
              No integration sprint. No AI team required.
            </div>
          </div>

          {/* Vertical Divider (hidden on mobile) */}
          <div style={{ display: "none", width: "1px", height: "100%", background: "rgba(255,255,255,0.1)", margin: "0 auto" }} className="desktop-divider" />

          {/* Right Column: The Long-Term Goldmine (White-label) */}
          <div>
            <div style={{ 
              display: "inline-block", padding: "4px 12px", background: "rgba(59,130,246,0.2)", 
              color: "#60a5fa", fontWeight: "700", fontSize: "12px", 
              borderRadius: "100px", marginBottom: "16px", letterSpacing: "0.05em"
            }}>
              THE GOLDMINE ADD-ON
            </div>
            <h3 style={{ fontSize: "20px", fontWeight: "700", margin: "0 0 12px 0", color: "#f8fafc" }}>
              Turn your CRM into an AI profit center.
            </h3>
            <p style={{ fontSize: "15px", color: "#cbd5e1", margin: 0, lineHeight: "1.6" }}>
              We provide the runtime, the generative UI, and the per-tenant billing engine. You simply add your profit margin and immediately start selling this as a premium white-label add-on to your restaurant customers.
            </p>
          </div>

        </div>
      </div>

      <style jsx>{`
        @media (min-width: 768px) {
          .desktop-divider {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}