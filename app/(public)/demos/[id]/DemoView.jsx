// app/(public)/demos/[id]/DemoView.jsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import WorkflowVisualizer from "@/components/WorkflowVisualizer";

export default function DemoView({ demo }) {
  const [openAccordion, setOpenAccordion] = useState(0);

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', color: '#e5e5e5', fontFamily: 'system-ui, sans-serif', padding: '2rem' }}>
      
      {/* Top Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        
        {/* Back to All Demos */}
        <Link href="/demos" style={{ textDecoration: 'none' }}>
          <button style={{ background: 'transparent', border: '1px solid #333', color: '#e5e5e5', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}>
            ← All demos
          </button>
        </Link>

        {/* Launch Interactive Demo */}
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

      {/* ⭐ Full-width interactive architecture hero */}
      {demo.workflowGraph && (
        <div style={{ marginBottom: '2rem' }}>
          <WorkflowVisualizer data={demo.workflowGraph} />
        </div>
      )}

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

          {/* Facts Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {demo.buildWalkthrough.facts.map((fact, idx) => (
              <div key={idx} style={{ border: '1px solid #262626', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#ffffff' }}>{fact.value}</div>
                <div style={{ fontSize: '0.7rem', color: '#a3a3a3', textTransform: 'uppercase', marginTop: '0.25rem' }}>{fact.label}</div>
              </div>
            ))}
          </div>

          {/* APIs Wired */}
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

      {/* Bottom Section: Purpose */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', backgroundColor: '#121212', borderRadius: '12px', padding: '1.5rem', border: '1px solid #262626' }}>
        <div>
          <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#a3a3a3', marginBottom: '0.5rem', fontWeight: 'bold' }}>What We Do</p>
          <p style={{ color: '#e5e5e5', fontSize: '0.9rem', lineHeight: '1.6' }}>{demo.purpose.whatWeDo}</p>
        </div>
        <div>
          <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#a3a3a3', marginBottom: '0.5rem', fontWeight: 'bold' }}>Why It Matters</p>
          <p style={{ color: '#e5e5e5', fontSize: '0.9rem', lineHeight: '1.6' }}>{demo.purpose.whyItMatters}</p>
        </div>
      </div>

    </div>
  );
}