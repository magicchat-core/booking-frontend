"use client";

import Link from "next/link";
import { useState } from "react";
import { getAllDemos } from "@/demos";
import DemoBookingModal from "@/components/DemoBookingModal";

export default function Demos() {
  const demos = getAllDemos();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const features = [
    {
      icon: "⏱️",
      title: "10-Minute Setup",
      desc: "Stop building AI infrastructure from scratch. Get a production-grade workflow live in a single afternoon.",
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
      title: "Deterministic Rendering Engine",
      desc: "No LLM is in the data path. The agent extracts intent, fetches live data from your backend, and passes it through your pre-defined templates to render the UI. 100% deterministic, 0% hallucination.",
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
      
      {/* ⭐ 1. HERO SECTION */}
      <div style={{ textAlign: "center", marginBottom: "56px", marginTop: "32px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ 
          display: "inline-block", padding: "6px 14px", 
          background: "rgba(59, 130, 246, 0.15)",
          color: "#60a5fa", fontWeight: "700", fontSize: "12px", 
          borderRadius: "100px", marginBottom: "20px", letterSpacing: "0.05em",
          border: "1px solid rgba(59, 130, 246, 0.3)"
        }}>
          THE SAGEION RUNTIME
        </div>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: "800", margin: "0 0 20px 0", color: "#f8fafc", letterSpacing: "-0.02em", lineHeight: 1.1, maxWidth: "900px" }}>
          Stop building AI infrastructure.<br/>Start shipping AI features on your <span style={{ color: "#60a5fa" }}>existing backend APIs</span>.
        </h1>
        
        <p style={{ margin: "0 auto 24px auto", fontSize: "18px", color: "#94a3b8", maxWidth: "760px", lineHeight: "1.6" }}>
          This is a reference demo on a smaller CRM. It's built to let you experience how AI agents work — with the same principles as yours — so you can see exactly how this fits your own projects.
          <br/><br/>
          Save your team's energy, time, and money. Sageion acts as a <span style={{ color: "#60a5fa", fontWeight: "600" }}>hollow wrapper</span> around your existing logic, meaning you make the <span style={{ color: "#34d399", fontWeight: "600" }}>absolute least changes</span> (always in a separate branch) and <span style={{ color: "#fbbf24", fontWeight: "600" }}>avoid any vendor lock-in</span>. You keep control of the AI layer, and can <span style={{ color: "#c084fc", fontWeight: "600" }}>pause, resume, or tear it down at will</span>.
          <br/><br/>
          <span style={{ display: "inline-block", marginTop: "12px", padding: "12px 16px", background: "rgba(59, 130, 246, 0.1)", borderRadius: "8px", border: "1px dashed rgba(59, 130, 246, 0.4)", color: "#e2e8f0", fontSize: "16px" }}>
            💡 <strong style={{ color: "#f8fafc" }}>The hidden goldmine:</strong> Those mature endpoints sitting at 30% traffic? They're about to become the conversational features your business has always wanted — with zero extra backend effort.
          </span>
        </p>

        {/* Color-coded feature badges */}
        <div style={{ 
          display: "flex", 
          flexWrap: "wrap", 
          gap: "12px", 
          justifyContent: "center", 
          maxWidth: "900px",
          margin: "0 auto"
        }}>
          <div style={{ background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.3)", borderRadius: "8px", padding: "8px 16px", fontSize: "14px", color: "#cbd5e1", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#60a5fa", fontWeight: "bold" }}>✓</span> Hollow wrapper (no framework ingestion)
          </div>
          <div style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: "8px", padding: "8px 16px", fontSize: "14px", color: "#cbd5e1", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#34d399", fontWeight: "bold" }}>✓</span> Least changes (always a separate branch)
          </div>
          <div style={{ background: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.3)", borderRadius: "8px", padding: "8px 16px", fontSize: "14px", color: "#cbd5e1", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#fbbf24", fontWeight: "bold" }}>✓</span> No vendor lock-in
          </div>
          <div style={{ background: "rgba(168, 85, 247, 0.1)", border: "1px solid rgba(168, 85, 247, 0.3)", borderRadius: "8px", padding: "8px 16px", fontSize: "14px", color: "#cbd5e1", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#c084fc", fontWeight: "bold" }}>✓</span> Deterministic rendering (no LLM in data path)
          </div>
        </div>
      </div>

      {/* ⭐ 2. NEW HIGHLIGHT SECTION: Win-Win-Win */}
      <div style={{ 
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)", 
        borderRadius: "20px", padding: "clamp(32px, 5vw, 56px)", 
        border: "1px solid #334155",
        boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
        marginBottom: "80px"
      }}>
        
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h2 style={{ fontSize: "clamp(24px, 3vw, 32px)", fontWeight: "800", margin: "0 0 16px 0", color: "#f8fafc", lineHeight: 1.2 }}>
            You already have the fuel. We'll add the rocket.
          </h2>
          <p style={{ fontSize: "16px", color: "#cbd5e1", maxWidth: "800px", margin: "0 auto", lineHeight: "1.6" }}>
            Your mature Restaurant CRM backend is the fuel. We give you the AI brain that turns it into an AI agent — one runtime that supports thousands of customized experiences for different customers, all without changing the core business logic of your existing APIs or UI. Together, we create a <strong style={{ color: "#60a5fa" }}>Win-Win-Win</strong> ecosystem that turns your platform into a premium AI profit center.
          </p>
        </div>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
          gap: "24px",
          marginBottom: "40px"
        }}>
          {/* Win 1 */}
          <div style={{ padding: "24px", background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: "12px" }}>
            <div style={{ fontSize: "24px", marginBottom: "12px" }}>🚀</div>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#f8fafc", marginBottom: "8px" }}>Win for You</h3>
            <p style={{ fontSize: "14px", color: "#cbd5e1", lineHeight: "1.5" }}>
              Skip the custom AI build. You provide the APIs, we provide the runtime. Turn your <span style={{ color: "#60a5fa", fontWeight: "600" }}>dormant, low-traffic APIs</span> into premium white-label AI features — add your margin and start billing.
            </p>
          </div>

          {/* Win 2 */}
          <div style={{ padding: "24px", background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "12px" }}>
            <div style={{ fontSize: "24px", marginBottom: "12px" }}>🍽️</div>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#f8fafc", marginBottom: "8px" }}>Win for End Users</h3>
            <p style={{ fontSize: "14px", color: "#cbd5e1", lineHeight: "1.5" }}>
              They get a <span style={{ color: "#34d399", fontWeight: "600" }}>deterministic AI agent (Zero Hallucinations)</span> that performs all agent actions set by the CRM provider, just from a chat interface. Data comes straight from your backend and is rendered via your templates — no LLM decides the output.
            </p>
          </div>

          {/* Win 3 */}
          <div style={{ padding: "24px", background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "12px" }}>
            <div style={{ fontSize: "24px", marginBottom: "12px" }}>⚙️</div>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#f8fafc", marginBottom: "8px" }}>Win for Sageion</h3>
            <p style={{ fontSize: "14px", color: "#cbd5e1", lineHeight: "1.5" }}>
              We power the ecosystem. As your restaurants scale their AI usage, our infrastructure scales with them, making the runtime <span style={{ color: "#fbbf24", fontWeight: "600" }}>more intelligent and robust</span>.
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", flexWrap: "wrap", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "32px" }}>
          <p style={{ margin: 0, fontSize: "16px", color: "#e2e8f0", fontWeight: "500" }}>
            Want to see this running against your actual CRM?
          </p>
          <button 
            onClick={() => setIsBookingModalOpen(true)}
            style={{ 
              background: "#3b82f6", color: "#ffffff", padding: "12px 24px", 
              borderRadius: "8px", fontWeight: "700", fontSize: "15px", 
              border: "none", cursor: "pointer", transition: "all 0.2s",
              boxShadow: "0 4px 12px rgba(59,130,246,0.3)"
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            Book a 15-Min Demo →
          </button>
        </div>
      </div>

      {/* ⭐ 3. DEMO CARDS */}
      <div style={{ marginBottom: "80px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#f8fafc", margin: 0 }}>
            Explore the Interactive Workflows
          </h2>
          <div style={{ height: "1px", background: "#334155", flex: 1 }} />
        </div>

        <p style={{ fontSize: "15px", color: "#cbd5e1", marginBottom: "16px", maxWidth: "800px", lineHeight: "1.6" }}>
          Notice how these workflows take standard CRUD APIs (checking stock, creating a PO) and chain them together into a valuable AI agent. These APIs already had UIs somewhere in your CRM. What's new is that now they can be invoked through a <strong style={{ color: "#f8fafc" }}>single chat interface</strong>—by simply asking a question or clicking a link—without navigating your entire CRM.
        </p>
        
        {/* Refined Human-in-the-Loop notice box */}
        <div style={{ 
          background: "rgba(59, 130, 246, 0.05)", 
          border: "1px solid rgba(59, 130, 246, 0.2)", 
          borderLeft: "4px solid #3b82f6",
          padding: "16px 20px", 
          borderRadius: "0 8px 8px 0", 
          marginBottom: "32px",
          maxWidth: "800px",
          display: "flex",
          gap: "12px",
          alignItems: "flex-start"
        }}>
          <div style={{ background: "#3b82f6", color: "#fff", borderRadius: "50%", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold", flexShrink: 0, marginTop: "2px" }}>
            i
          </div>
          <p style={{ fontSize: "14px", color: "#cbd5e1", margin: 0, lineHeight: "1.6" }}>
            <strong style={{ color: "#f8fafc" }}>Note:</strong> Some workflows ask you to sign up or log in. This allows the agent to call authenticated APIs with your permissions, hand the run back to you mid-workflow (this demo CRM does that by email: approve, pay, submit a code — whatever the step needs), and keep your CRM data isolated to you. You're the <span style={{ color: "#60a5fa", fontWeight: "600" }}>human-in-the-loop node</span>: finish your step and the agent carries on.
          </p>
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

      {/* ⭐ 4. VALUE PROPS */}
      <div style={{ marginBottom: "64px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#f8fafc", margin: 0 }}>
            Why it works
          </h2>
          <div style={{ height: "1px", background: "#334155", flex: 1 }} />
        </div>
        
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", 
          gap: "20px" 
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
      </div>

      {/* ⭐ RENDER THE MODAL */}
      <DemoBookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
      />

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