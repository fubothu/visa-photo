import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, checkFeedbackEnabled, isConfigured as checkIsConfigured } from '../services/firebase';
import { useLanguage } from '../contexts/LanguageContext';

export const FeedbackForm: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isEnabled, setIsEnabled] = useState(true);
    const [type, setType] = useState<'bug' | 'suggestion'>('suggestion');
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    useEffect(() => {
        // Check kill switch on mount
        checkFeedbackEnabled().then(setIsEnabled);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Rate limiting check (Only in Production)
        if (checkIsConfigured) {
            const lastSubmit = localStorage.getItem('lastFeedbackSubmit');
            if (lastSubmit) {
                const timeSince = Date.now() - parseInt(lastSubmit, 10);
                if (timeSince < 10 * 60 * 1000) { // 10 minutes
                    alert('Please wait 10 minutes between submissions.');
                    return;
                }
            }
        }

        setIsSubmitting(true);
        setStatus('idle');

        try {
            if (checkIsConfigured) {
                await addDoc(collection(db, 'feedback'), {
                    type,
                    message,
                    email,
                    timestamp: serverTimestamp(),
                    userAgent: navigator.userAgent
                });
            } else {
                // Mock submission
                console.log('Mock Submission:', { type, message, email });
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            setStatus('success');
            localStorage.setItem('lastFeedbackSubmit', Date.now().toString());
            setMessage('');
            setTimeout(() => {
                setIsOpen(false);
                setStatus('idle');
            }, 2000);
        } catch (error) {
            console.error('Error submitting feedback:', error);
            setStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isEnabled) return null;

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="btn-feedback"
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    zIndex: 100
                }}
                title="Send Feedback"
            >
                💬
            </button>

            {isOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 101
                }}>
                    <div style={{
                        background: '#1e293b',
                        padding: '2rem',
                        borderRadius: '12px',
                        width: '90%',
                        maxWidth: '400px',
                        position: 'relative',
                        color: 'white'
                    }}>
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: 'transparent',
                                border: 'none',
                                color: '#94a3b8',
                                cursor: 'pointer',
                                fontSize: '1.2rem'
                            }}
                        >
                            ✕
                        </button>

                        <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>Feedback</h2>

                        {status === 'success' ? (
                            <div style={{ color: '#4ade80', textAlign: 'center', padding: '2rem 0' }}>
                                Thank you for your feedback!
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Type</label>
                                    <select
                                        value={type}
                                        onChange={(e) => setType(e.target.value as any)}
                                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px' }}
                                    >
                                        <option value="suggestion">Suggestion</option>
                                        <option value="bug">Bug Report</option>
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Message</label>
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        required
                                        maxLength={500}
                                        rows={4}
                                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px' }}
                                        placeholder="Tell us what you think..."
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Email (Optional)</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px' }}
                                        placeholder="For follow-up"
                                    />
                                </div>

                                {status === 'error' && (
                                    <p style={{ color: '#ef4444', fontSize: '0.9rem' }}>Failed to submit. Please try again.</p>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="btn btn-primary"
                                    style={{ marginTop: '0.5rem' }}
                                >
                                    {isSubmitting ? 'Sending...' : 'Submit Feedback'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};
