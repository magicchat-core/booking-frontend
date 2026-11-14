'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getDemo } from '@/demos';

export default function DemoGuide() {
  const [activeDemo, setActiveDemo] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const demoId = localStorage.getItem('active_demo') || 'demo1';
    const demoData = getDemo(demoId);
    
    if (demoData && demoData.guide) {
      setActiveDemo(demoData);
      if (!localStorage.getItem(`guide_seen_${demoId}`)) {
        setIsOpen(true);
      }
    }
  }, [pathname]);

  if (!activeDemo) return null;

  const activeStep = activeDemo.guide.steps.find(s => pathname.includes(s.targetRoute));

  const dismiss = () => {
    localStorage.setItem(`guide_seen_${activeDemo.id}`, 'true');
    setIsOpen(false);
  };

  const injectPrompt = (prompt) => {
    const event = new CustomEvent('sageion_inject_prompt', { detail: { prompt } });
    window.dispatchEvent(event);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          position: 'fixed', bottom: 24, left: 24, zIndex: 9999, 
          background: isOpen ? '#0f172a' : '#3b82f6', 
          color: 'white', padding: '12px 20px', borderRadius: '50px', 
          border: 'none', cursor: 'pointer', boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
          fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8,
          transition: 'all 0.2s ease-in-out'
        }}
      >
        {isOpen ? '✕ Close Guide' : '✨ Open Demo Guide'}
      </button>

      {/* The Guide Panel */}
      {isOpen && (
        <div style={{ 
          position: 'fixed', top: 80, left: 24, zIndex: 9999, width: 400, 
          background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 16, 
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)', color: '#1e293b', 
          overflow: 'hidden', display: 'flex', flexDirection: 'column',
          maxHeight: 'calc(100vh - 120px)'
        }}>
          
          {/* Header */}
          <div style={{ 
            padding: '20px 24px', 
            background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', 
            color: 'white' 
          }}>
            <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.8, marginBottom: 4 }}>
              Interactive Workflow
            </div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{activeDemo.name}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: 12, opacity: 0.9 }}>
              <span>⏱ ~2 mins</span>
              <span>•</span>
              <span>{activeDemo.guide.estimatedClicks} steps</span>
            </div>
          </div>

          <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
            
            {/* Context / Business Problem Box */}
            <div style={{ 
              background: '#f8fafc', borderLeft: '4px solid #3b82f6', 
              padding: '16px', borderRadius: '0 8px 8px 0', marginBottom: 24,
              fontSize: 13, lineHeight: 1.6, color: '#475569'
            }}>
              <strong style={{ color: '#1e293b', display: 'block', marginBottom: 4, fontSize: 12, textTransform: 'uppercase' }}>
                The Business Context
              </strong>
              {activeDemo.guide.workflowDetails.map((detail, idx) => (
                <p key={idx} style={{ margin: idx === 0 ? 0 : '8px 0 0 0' }}>
                  {detail}
                </p>
              ))}
            </div>
            
            {/* Timeline Steps */}
            <div style={{ position: 'relative' }}>
              {/* Vertical connecting line */}
              <div style={{ 
                position: 'absolute', left: 15, top: 10, bottom: 20, 
                width: 2, background: '#e2e8f0', zIndex: 0 
              }} />

              {activeDemo.guide.steps.map((step, idx) => {
                const isCurrent = activeStep?.id === step.id;
                return (
                  <div key={step.id} style={{ 
                    position: 'relative', zIndex: 1,
                    display: 'flex', gap: 16, marginBottom: 24 
                  }}>
                    
                    {/* Step Circle */}
                    <div style={{ 
                      width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, fontWeight: 700,
                      background: isCurrent ? '#3b82f6' : '#f1f5f9',
                      color: isCurrent ? '#ffffff' : '#94a3b8',
                      border: isCurrent ? '4px solid #dbeafe' : '2px solid #e2e8f0',
                      boxShadow: isCurrent ? '0 0 0 4px rgba(59, 130, 246, 0.1)' : 'none',
                      transition: 'all 0.3s ease',
                      transform: isCurrent ? 'scale(1.1)' : 'scale(1)'
                    }}>
                      {step.id}
                    </div>

                    {/* Step Content */}
                    <div style={{ flex: 1, paddingTop: 4 }}>
                      <div style={{ 
                        fontSize: 14, fontWeight: 700, 
                        color: isCurrent ? '#1e293b' : '#64748b', 
                        marginBottom: 4 
                      }}>
                        {step.title}
                      </div>
                      <div style={{ 
                        fontSize: 13, lineHeight: 1.5, 
                        color: isCurrent ? '#475569' : '#94a3b8' 
                      }}>
                        {step.instruction}
                      </div>
                      
                      {/* Interactive Prompt Chip */}
                      {step.samplePrompt && (
                         <button 
                           onClick={() => injectPrompt(step.samplePrompt)}
                           style={{ 
                             marginTop: 12, padding: '10px 14px', 
                             background: '#f0fdf4', border: '1px solid #bbf7d0', 
                             borderRadius: 8, fontSize: 13, color: '#166534',
                             cursor: 'pointer', textAlign: 'left', width: '100%',
                             display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                             transition: 'all 0.2s ease',
                             fontFamily: 'ui-monospace, monospace'
                           }}
                           onMouseOver={(e) => e.currentTarget.style.background = '#dcfce7'}
                           onMouseOut={(e) => e.currentTarget.style.background = '#f0fdf4'}
                         >
                           <span>💬 "{step.samplePrompt}"</span>
                           <span style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 4 }}>
                             Use <span style={{ fontSize: 16 }}>→</span>
                           </span>
                         </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
            <button 
              onClick={dismiss} 
              style={{ 
                width: '100%', padding: '10px', background: 'transparent', 
                border: '1px solid #cbd5e1', borderRadius: 6, cursor: 'pointer', 
                fontSize: 13, color: '#64748b', fontWeight: 500, transition: 'all 0.2s'
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = '#e2e8f0'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              Dismiss Guide
            </button>
          </div>
        </div>
      )}
    </>
  );
}