'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getDemo } from '@/demos';

export default function DemoGuide() {
  const [activeDemo, setActiveDemo] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Check which demo is currently active
    const demoId = localStorage.getItem('active_demo') || 'demo1';
    const demoData = getDemo(demoId);
    
    if (demoData && demoData.guide) {
      setActiveDemo(demoData);
      // If they haven't dismissed the guide, show it automatically
      if (!localStorage.getItem(`guide_seen_${demoId}`)) {
        setIsOpen(true);
      }
    }
  }, [pathname]);

  if (!activeDemo) return null;

  // Find if there's a step matching the current page URL
  const activeStep = activeDemo.guide.steps.find(s => pathname.includes(s.targetRoute));

  const dismiss = () => {
    localStorage.setItem(`guide_seen_${activeDemo.id}`, 'true');
    setIsOpen(false);
  };

  const injectPrompt = (prompt) => {
    // ⭐ Dispatch an event that the Sageion Bridge can listen to
    const event = new CustomEvent('sageion_inject_prompt', { detail: { prompt } });
    window.dispatchEvent(event);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          position: 'fixed', bottom: 20, left: 20, zIndex: 9999, 
          background: isOpen ? '#1e293b' : '#4a7feb', 
          color: 'white', padding: '12px 16px', borderRadius: '50px', 
          border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8
        }}
      >
        {isOpen ? '✕ Close Guide' : '❓ Demo Guide'}
      </button>

      {/* The Guide Panel */}
      {isOpen && (
        <div style={{ 
          position: 'fixed', top: 80, left: 20, zIndex: 9999, width: 350, 
          background: 'white', border: '1px solid #e2e8f0', borderRadius: 8, 
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)', color: '#1a202c', overflow: 'hidden' 
        }}>
          
          <div style={{ padding: '16px', background: '#4a7feb', color: 'white' }}>
            <h3 style={{ margin: 0, fontSize: 16 }}>{activeDemo.name}</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: 12, opacity: 0.9 }}>
              Est. time: {activeDemo.guide.estimatedClicks} clicks
            </p>
          </div>

          <div style={{ padding: '16px', maxHeight: '65vh', overflowY: 'auto' }}>
            <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 16, color: '#334155' }}>
              {activeDemo.guide.workflowDetails.join(' ')}
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {activeDemo.guide.steps.map(step => {
                const isCurrent = activeStep?.id === step.id;
                return (
                  <div key={step.id} style={{ 
                    padding: 12, 
                    background: isCurrent ? '#eff6ff' : '#f8fafc', 
                    borderLeft: isCurrent ? '3px solid #4a7feb' : '3px solid transparent', 
                    borderRadius: 4 
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                      Step {step.id}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginTop: 2 }}>
                      {step.title}
                    </div>
                    <div style={{ fontSize: 13, color: '#475569', marginTop: 4, lineHeight: 1.4 }}>
                      {step.instruction}
                    </div>
                    
                    {/* Clickable Prompt Chip */}
                    {step.samplePrompt && isCurrent && (
                       <button 
                         onClick={() => injectPrompt(step.samplePrompt)}
                         style={{ 
                           marginTop: 10, padding: '8px 12px', background: '#ffffff', 
                           border: '1px solid #cbd5e1', borderRadius: 4, fontSize: 12, 
                           fontFamily: 'monospace', cursor: 'pointer', textAlign: 'left',
                           display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                           width: '100%', color: '#0f172a'
                         }}
                       >
                         <span>💬 "{step.samplePrompt}"</span>
                         <span style={{ color: '#4a7feb', fontWeight: 'bold' }}>Use →</span>
                       </button>
                    )}
                  </div>
                );
              })}
            </div>

            <button 
              onClick={dismiss} 
              style={{ 
                marginTop: 20, width: '100%', padding: '10px', background: '#f1f5f9', 
                border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13, 
                color: '#64748b', fontWeight: 500 
              }}
            >
              Don't show this again
            </button>
          </div>
        </div>
      )}
    </>
  );
}