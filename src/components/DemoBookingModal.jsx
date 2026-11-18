// components/DemoBookingModal.jsx
"use client";

import React, { useState } from "react";

export default function DemoBookingModal({ isOpen, onClose }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    to: "",
    cc: "",
    bcc: "",
    scheduled_time: "",
    message: "",
  });
  const [attachment, setAttachment] = useState(null);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const fd = new FormData();
    fd.append("email_type", "SANDBOX_APIS_CREDS");
    
    // Use the first email in the 'to' field as the primary
    const primaryEmail = formData.to.split(',')[0].trim();
    fd.append("email", primaryEmail);
    fd.append("to_pm", "to_pm"); 
    fd.append("name", "Demo Prospect"); 
    fd.append("phone", "N/A"); 
    
    fd.append("cc", formData.cc);
    fd.append("bcc", formData.bcc);
    fd.append("scheduled_time", formData.scheduled_time);
    fd.append("message", formData.message);

    if (attachment) {
      fd.append("attachment", attachment);
    }

    try {
      const response = await fetch("https://email2.magicchat.io/prod/send_email", {
        method: "POST",
        headers: { "x-api-key": "justanything" },
        body: fd,
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      
      alert("Meeting scheduled and details sent successfully!");
      onClose();
      setFormData({ to: "", cc: "", bcc: "", scheduled_time: "", message: "" });
      setAttachment(null);
    } catch (error) {
      console.error("❌ Error sending email:", error);
      alert("Something went wrong while scheduling the meeting.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
    }}>
      <div style={{
        backgroundColor: '#121212', width: '100%', maxWidth: '650px',
        borderRadius: '12px', border: '1px solid #333',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
        display: 'flex', flexDirection: 'column', maxHeight: '90vh'
      }}>
        
        {/* Header */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #262626', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#fff' }}>Schedule Demo Meeting</h3>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#a3a3a3' }}>Send sandbox credentials to your engineering team.</p>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#a3a3a3', fontSize: '1.5rem', cursor: 'pointer', padding: '0.5rem' }}>✕</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#e5e5e5', marginBottom: '0.4rem' }}>To (Engineer Emails)</label>
            <input required type="text" name="to" value={formData.to} onChange={handleInputChange} placeholder="engineer1@company.com, engineer2@company.com" style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #333', background: '#0a0a0a', color: '#fff', fontSize: '0.9rem' }} />
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#e5e5e5', marginBottom: '0.4rem' }}>CC</label>
              <input type="text" name="cc" value={formData.cc} onChange={handleInputChange} placeholder="Optional" style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #333', background: '#0a0a0a', color: '#fff', fontSize: '0.9rem' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#e5e5e5', marginBottom: '0.4rem' }}>BCC</label>
              <input type="text" name="bcc" value={formData.bcc} onChange={handleInputChange} placeholder="Optional" style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #333', background: '#0a0a0a', color: '#fff', fontSize: '0.9rem' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#e5e5e5', marginBottom: '0.4rem' }}>Meeting Date & Time</label>
            <input required type="datetime-local" name="scheduled_time" value={formData.scheduled_time} onChange={handleInputChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #333', background: '#0a0a0a', color: '#fff', fontSize: '0.9rem', colorScheme: 'dark' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#e5e5e5', marginBottom: '0.4rem' }}>Message / Context</label>
            <textarea required name="message" value={formData.message} onChange={handleInputChange} rows={4} placeholder="Please share the sandbox credentials or any workflows you'd like us to focus on..." style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #333', background: '#0a0a0a', color: '#fff', fontSize: '0.9rem', resize: 'vertical' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#e5e5e5', marginBottom: '0.4rem' }}>Attach Sandbox Credentials / APIS (Optional)</label>
            <input type="file" onChange={handleFileChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #333', background: '#0a0a0a', color: '#a3a3a3', fontSize: '0.9rem' }} />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: '6px', background: isSubmitting ? '#1e3a8a' : '#3b82f6', color: '#fff', fontWeight: 'bold', border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
          >
            {isSubmitting ? 'Sending...' : 'Send Meeting Invite'}
          </button>
        </form>
      </div>
    </div>
  );
}