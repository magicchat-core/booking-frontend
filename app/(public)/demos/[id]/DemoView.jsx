// app/(public)/demos/[id]/DemoView.jsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import VideoPlayer from "@/components/VideoPlayer";
import WorkflowVisualizer from "@/components/WorkflowVisualizer";

export default function DemoView({ demo }) {
  const [openAccordion, setOpenAccordion] = useState(0);

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', color: '#e5e5e5', fontFamily: 'system-ui, sans-serif', padding: '2rem' }}>
      
      {/* Top Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <Link href="/demos" style={{ textDecoration: 'none' }}>
          <button style={{ background: 'transparent', border: '1px solid #333', color: '#e5e5e5', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}>
            ← All demos
          </button>
        </Link>
        <Link href="/owner/inventory" style={{ textDecoration: 'none' }}>
          <button style={{ background: '#f59e0b', border: 'none', color: '#000', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
            Launch Interactive Demo →
          </button>
        </Link>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#ffffff' }}>{demo.name}</h1>
        <p style={{ color: '#a3a3a3', maxWidth: '800px', lineHeight: '1.6' }}>{demo.description}</p>
      </div>

      {/* Full-width Hero: Video + Interactive Architecture */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '2rem' }}>
        {demo.buildWalkthrough?.videoUrl && (
          <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
            <VideoPlayer url={demo.buildWalkthrough.videoUrl} />
          </div>
        )}
        {demo.workflowGraph && (
          <div style={{ width: '100%' }}>
            <WorkflowVisualizer data={demo.workflowGraph} />
          </div>
        )}
      </div>

      {/* Main Grid — Build Walkthrough | What the Agent Does */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        
        {/* Left Column: Build Walkthrough */}
        <div style={{ backgroundColor: '#121212', borderRadius: '12px', padding: '1.5rem', border: '1px solid #262626' }}>
          <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#a3a3a3', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Build Walkthrough
          </p>
          <h2 style={{ fontSize: '1.5rem', color: '#ffffff', marginBottom: '0.5rem' }}>{demo.buildWalkthrough.title}</h2>
          <p style={{ color: '#a3a3a3', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
            {demo.buildWalkthrough.subtitle}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {demo.buildWalkthrough.facts.map((fact, idx) => (
              <div key={idx} style={{ border: '1px solid #262626', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#ffffff' }}>{fact.value}</div>
                <div style={{ fontSize: '0.7rem', color: '#a3a3a3', textTransform: 'uppercase', marginTop: '0.25rem' }}>{fact.label}</div>
              </div>
            ))}
          </div>

          <div>
            <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#a3a3a3', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              APIs Wired in the Agent
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {demo.buildWalkthrough.apis.map((api, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#0a0a0a', border: '1px solid #262626', padding: '0.75rem', borderRadius: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', padding: '0.2rem 0.5rem', borderRadius: '4px', backgroundColor: api.method === 'GET' ? '#dcfce7' : api.method === 'POST' ? '#dbeafe' : '#fef3c7', color: '#000' }}>
                      {api.method}
                    </span>
                    <span style={{ fontFamily: 'monospace', color: '#e5e5e5', fontSize: '0.9rem' }}>{api.path}</span>
                  </div>
                  <span style={{ color: '#a3a3a3', fontSize: '0.8rem' }}>{api.purpose}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: What the Agent Does */}
        <div style={{ backgroundColor: '#121212', borderRadius: '12px', padding: '1.5rem', border: '1px solid #262626' }}>
          <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#a3a3a3', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            What the Agent Does
          </p>
          <h2 style={{ fontSize: '1.5rem', color: '#ffffff', marginBottom: '0.5rem' }}>Inventory workflows covered</h2>
          <p style={{ color: '#a3a3a3', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Three REST calls, one conversation. Click any step.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {demo.workflows.map((wf, idx) => (
              <div key={idx} style={{ border: '1px solid #262626', borderRadius: '8px', overflow: 'hidden' }}>
                <button 
                  onClick={() => setOpenAccordion(openAccordion === idx ? -1 : idx)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', padding: '1rem', backgroundColor: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer', textAlign: 'left' }}
                >
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: openAccordion === idx ? '#ffffff' : '#525252', marginRight: '1rem' }} />
                  <span style={{ flex: 1, fontWeight: '500' }}>{wf.title}</span>
                  <span style={{ color: '#a3a3a3' }}>{openAccordion === idx ? '▲' : '▼'}</span>
                </button>
                {openAccordion === idx && (
                  <div style={{ padding: '0 1rem 1rem 2.5rem', color: '#a3a3a3', fontSize: '0.9rem', lineHeight: '1.5' }}>
                    {wf.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================
          Bottom Section: The High-Contrast Comparison
          ========================================================= */}
      <div style={{ marginTop: '5rem', marginBottom: '3rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#ffffff', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
          What used to take months can now be done in days.
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '1.15rem', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
          You already built the engine (your mature backend). We provide the rocket fuel (the AI agent runtime). Stop rebuilding the infrastructure to fly.
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '2rem', 
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        
        {/* The Old Way (Pain Point) */}
        <div style={{ 
          backgroundColor: '#121212',
          border: '1px solid #262626', 
          borderRadius: '16px', 
          padding: '2.5rem',
          transition: 'border-color 0.2s',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
              ✕
            </div>
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff', margin: 0, fontWeight: '600' }}>
              The Old Way (Framework Trap)
            </h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <div style={{ color: '#ffffff', fontWeight: '600', marginBottom: '0.25rem' }}>Data migration required</div>
              <div style={{ color: '#a3a3a3', fontSize: '0.95rem', lineHeight: '1.5' }}>You have to sync your CRM's database to an external vector store just to make the AI work.</div>
            </div>
            <div>
              <div style={{ color: '#ffffff', fontWeight: '600', marginBottom: '0.25rem' }}>Silent failures pile up</div>
              <div style={{ color: '#a3a3a3', fontSize: '0.95rem', lineHeight: '1.5' }}>LLMs guess based on probability. When they get a price or stock count wrong, they fail silently and slowly pile up as tickets you never expected.</div>
            </div>
            <div>
              <div style={{ color: '#ffffff', fontWeight: '600', marginBottom: '0.25rem' }}>Wrapper code maintenance</div>
              <div style={{ color: '#a3a3a3', fontSize: '0.95rem', lineHeight: '1.5' }}>When your schema changes, you have to rewrite your integration code, redeploy your backend, and hope nothing breaks.</div>
            </div>
          </div>
        </div>

        {/* The Sageion Way (Solution) */}
        <div style={{ 
          backgroundColor: '#121212',
          border: '1px solid rgba(16, 185, 129, 0.3)', 
          borderRadius: '16px', 
          padding: '2.5rem',
          boxShadow: '0 0 40px rgba(16, 185, 129, 0.05)',
          transition: 'border-color 0.2s',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
              ✓
            </div>
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff', margin: 0, fontWeight: '600' }}>
              The Sageion Way (The Runtime)
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <div style={{ color: '#ffffff', fontWeight: '600', marginBottom: '0.25rem' }}>Your data stays yours</div>
              <div style={{ color: '#a3a3a3', fontSize: '0.95rem', lineHeight: '1.5' }}>We don't store personal data. We only map a <code style={{ backgroundColor: '#262626', padding: '0.1rem 0.3rem', borderRadius: '4px', fontFamily: 'monospace', color: '#e5e5e5' }}>uid</code>. You can debug explicit request/response logs via the Admin UI, but everything else remains at your API boundary.</div>
            </div>
            <div>
              <div style={{ color: '#ffffff', fontWeight: '600', marginBottom: '0.25rem' }}>Zero hallucinations</div>
              <div style={{ color: '#a3a3a3', fontSize: '0.95rem', lineHeight: '1.5' }}>We don't guess. The AI queries your existing REST APIs directly, guaranteeing that the user sees the exact live data from your database.</div>
            </div>
            <div>
              <div style={{ color: '#ffffff', fontWeight: '600', marginBottom: '0.25rem' }}>Click, don't code</div>
              <div style={{ color: '#a3a3a3', fontSize: '0.95rem', lineHeight: '1.5' }}>When your schema changes, just update the mapping in the Sageion Admin UI. No code deployments, no wrapper rewrites.</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}