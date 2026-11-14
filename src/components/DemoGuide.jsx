'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getDemo } from '@/demos';
import api from '@/api/client';

export default function DemoGuide() {
  const [activeDemo, setActiveDemo] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState(null);
  const [setupStatus, setSetupStatus] = useState('idle'); 
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

  if (!activeDemo || !activeDemo.guide) return null;

  const guide = activeDemo.guide;
  const workflows = guide.workflows || [{
    id: "default",
    title: "Main Workflow",
    description: "Follow these steps to test the demo.",
    estimatedClicks: guide.estimatedClicks || 3,
    steps: guide.steps || []
  }];

  const currentWorkflowId = selectedWorkflowId || workflows[0]?.id;
  const selectedWorkflow = workflows.find(w => w.id === currentWorkflowId);
  const activeStep = selectedWorkflow?.steps.find(s => pathname.includes(s.targetRoute));

  const dismiss = () => {
    localStorage.setItem(`guide_seen_${activeDemo.id}`, 'true');
    setIsOpen(false);
  };

  const injectPrompt = (prompt) => {
    const event = new CustomEvent('sageion_inject_prompt', { detail: { prompt } });
    window.dispatchEvent(event);
  };

  const handleSetup = async () => {
    setSetupStatus('loading');
    try {
      await api.post(`/demos/${activeDemo.id}/setup`);
      setSetupStatus('success');
      // Reload the page so the user immediately sees the new stock levels
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      console.error('Setup failed:', err);
      alert('Failed to set up demo: ' + (err.response?.data?.error || err.message));
      setSetupStatus('idle');
    }
  };

  return (
    <>
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

      {isOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9998,
          background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '24px'
        }}>
          
          <div style={{ 
            width: '100%', maxWidth: '1200px', height: '85vh',
            background: '#ffffff', borderRadius: '16px', 
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', 
            display: 'flex', overflow: 'hidden',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            
            <div style={{ 
              width: '350px', flexShrink: 0,
              background: '#f8fafc', borderRight: '1px solid #e2e8f0',
              display: 'flex', flexDirection: 'column'
            }}>
              <div style={{ padding: '32px 24px', flex: 1, overflowY: 'auto' }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#3b82f6', marginBottom: 8 }}>
                  Interactive Demo
                </div>
                <h2 style={{ margin: '0 0 16px 0', fontSize: 22, fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
                  {guide.title || activeDemo.name}
                </h2>
                
                <div style={{ 
                  background: '#ffffff', border: '1px solid #e2e8f0', 
                  padding: '16px', borderRadius: '8px', marginBottom: 32,
                  fontSize: 13, lineHeight: 1.6, color: '#475569'
                }}>
                  {guide.genericInfo || guide.header}
                </div>

                <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: 12 }}>
                  Available Workflows
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {workflows.map(wf => {
                    const isSelected = currentWorkflowId === wf.id;
                    return (
                      <button
                        key={wf.id}
                        onClick={() => setSelectedWorkflowId(wf.id)}
                        style={{
                          textAlign: 'left', padding: '12px 16px', 
                          background: isSelected ? '#eff6ff' : 'transparent',
                          border: isSelected ? '1px solid #bfdbfe' : '1px solid transparent',
                          borderLeft: isSelected ? '4px solid #3b82f6' : '4px solid transparent',
                          borderRadius: '6px', cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ fontSize: 14, fontWeight: 600, color: isSelected ? '#1e3a8a' : '#475569', marginBottom: 2 }}>
                          {wf.title}
                        </div>
                        <div style={{ fontSize: 12, color: isSelected ? '#3b82f6' : '#94a3b8' }}>
                          {wf.estimatedClicks} steps
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div style={{ padding: '24px', borderTop: '1px solid #e2e8f0', background: '#ffffff' }}>
                <button 
                  onClick={dismiss} 
                  style={{ 
                    width: '100%', padding: '12px', background: '#f1f5f9', 
                    border: 'none', borderRadius: '8px', cursor: 'pointer', 
                    fontSize: 14, color: '#475569', fontWeight: 600
                  }}
                >
                  Don't show this again
                </button>
              </div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#ffffff' }}>
              
              <div style={{ padding: '32px 40px', borderBottom: '1px solid #e2e8f0' }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: 24, fontWeight: 700, color: '#0f172a' }}>
                  {selectedWorkflow?.title}
                </h3>
                <p style={{ margin: 0, fontSize: 15, color: '#64748b', lineHeight: 1.5 }}>
                  {selectedWorkflow?.description}
                </p>
              </div>

              <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
                <div style={{ position: 'relative', maxWidth: '700px' }}>
                  
                  <div style={{ 
                    position: 'absolute', left: 19, top: 10, bottom: 20, 
                    width: 2, background: '#e2e8f0', zIndex: 0 
                  }} />

                  {selectedWorkflow?.steps.map((step, idx) => {
                    const isCurrent = activeStep?.id === step.id;
                    return (
                      <div key={step.id} style={{ 
                        position: 'relative', zIndex: 1,
                        display: 'flex', gap: 24, marginBottom: 32 
                      }}>
                        
                        <div style={{ 
                          width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 16, fontWeight: 700,
                          background: isCurrent ? '#3b82f6' : '#ffffff',
                          color: isCurrent ? '#ffffff' : '#94a3b8',
                          border: isCurrent ? '4px solid #dbeafe' : '2px solid #cbd5e1',
                          boxShadow: isCurrent ? '0 0 0 4px rgba(59, 130, 246, 0.1)' : 'none',
                          transition: 'all 0.3s ease',
                          transform: isCurrent ? 'scale(1.1)' : 'scale(1)'
                        }}>
                          {step.id}
                        </div>

                        <div style={{ flex: 1, paddingTop: 8 }}>
                          <div style={{ 
                            fontSize: 18, fontWeight: 700, 
                            color: isCurrent ? '#0f172a' : '#64748b', 
                            marginBottom: 6 
                          }}>
                            {step.title}
                          </div>
                          <div style={{ 
                            fontSize: 15, lineHeight: 1.6, 
                            color: isCurrent ? '#334155' : '#94a3b8' 
                          }}>
                            {step.instruction}
                          </div>

                          {step.id === 1 && selectedWorkflow.setupRequired && (
                            <div style={{ marginTop: 16 }}>
                              {setupStatus === 'success' ? (
                                <div style={{ padding: '12px 16px', background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', borderRadius: 8, fontSize: 14, fontWeight: 600 }}>
                                  ✅ Demo state prepared successfully! Reloading...
                                </div>
                              ) : (
                                <button
                                  onClick={handleSetup}
                                  disabled={setupStatus === 'loading'}
                                  style={{
                                    padding: '12px 24px', background: '#3b82f6', color: 'white',
                                    border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600,
                                    cursor: setupStatus === 'loading' ? 'not-allowed' : 'pointer',
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                                  }}
                                >
                                  {setupStatus === 'loading' ? 'Preparing...' : '⚡ Auto-Setup Demo State'}
                                </button>
                              )}
                            </div>
                          )}
                          
                          {step.samplePrompt && (
                             <button 
                               onClick={() => injectPrompt(step.samplePrompt)}
                               style={{ 
                                 marginTop: 16, padding: '14px 20px', 
                                 background: '#f0fdf4', border: '1px solid #bbf7d0', 
                                 borderRadius: 8, fontSize: 15, color: '#166534',
                                 cursor: 'pointer', textAlign: 'left', width: '100%',
                                 display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                 transition: 'all 0.2s ease', boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                                 fontFamily: 'ui-monospace, monospace'
                               }}
                               onMouseOver={(e) => { e.currentTarget.style.background = '#dcfce7'; e.currentTarget.style.borderColor = '#86efac'; }}
                               onMouseOut={(e) => { e.currentTarget.style.background = '#f0fdf4'; e.currentTarget.style.borderColor = '#bbf7d0'; }}
                             >
                               <span>💬 "{step.samplePrompt}"</span>
                               <span style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 6 }}>
                                 Click to use <span style={{ fontSize: 18 }}>→</span>
                               </span>
                             </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}