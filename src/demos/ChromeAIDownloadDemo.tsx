import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form-ai';

interface MessageForm {
  subject: string;
  message: string;
  recipient: string;
}

export default function ChromeAIDownloadDemo() {
  const {
    register,
    handleSubmit,
    aiAutofill,
    aiLoading,
    aiAvailability,
    refreshAvailability,
    aiDownloadProgress,
  } = useForm<MessageForm>({
    ai: {
      providers: [{ type: 'chrome', priority: 10 }],
      autoCheckAvailability: true,
    },
  });

  const [_downloadStarted, setDownloadStarted] = useState(false);

  // Poll availability during download
  useEffect(() => {
    if (aiAvailability?.status === 'downloading') {
      const interval = setInterval(async () => {
        await refreshAvailability();
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [aiAvailability?.status, refreshAvailability]);

  const handleAutofillClick = async () => {
    if (aiAvailability?.needsDownload) {
      setDownloadStarted(true);
    }

    try {
      await aiAutofill();
    } catch (error) {
      console.error('Autofill failed:', error);
    }
  };

  const renderAIStatus = () => {
    if (!aiAvailability) {
      return (
        <div className="ai-status">
          <strong>🔍 Checking AI availability...</strong>
        </div>
      );
    }

    switch (aiAvailability.status) {
      case 'readily':
        return (
          <div className="ai-status available">
            <strong>✅ Chrome AI Ready</strong>
            <p style={{ marginTop: '8px', fontSize: '0.9rem' }}>
              AI model is downloaded and ready to use!
            </p>
          </div>
        );

      case 'downloadable':
        return (
          <div className="ai-status">
            <strong>📥 Download Required</strong>
            <p style={{ marginTop: '8px', fontSize: '0.9rem' }}>
              Chrome AI requires a one-time model download (~1-2GB).
              Click "Download & Autofill" to start.
            </p>
          </div>
        );

      case 'downloading':
        return (
          <div className="ai-status downloading">
            <strong>⏬ Downloading AI Model...</strong>
            {aiDownloadProgress !== null && (
              <>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${aiDownloadProgress}%` }}
                  >
                    {Math.round(aiDownloadProgress)}%
                  </div>
                </div>
                <p style={{ fontSize: '0.85rem', marginTop: '8px' }}>
                  Please keep this tab open. This is a one-time download.
                </p>
              </>
            )}
          </div>
        );

      case 'unavailable':
        return (
          <div className="ai-status unavailable">
            <strong>❌ Chrome AI Unavailable</strong>
            <p style={{ marginTop: '8px', fontSize: '0.9rem' }}>
              Chrome AI is not available in this browser.
            </p>
            <p style={{ fontSize: '0.85rem', marginTop: '8px' }}>
              Requirements: Chrome 127+ with AI features enabled at{' '}
              <code>chrome://flags/#optimization-guide-on-device-model</code>
            </p>
          </div>
        );

      case 'error':
        return (
          <div className="ai-status unavailable">
            <strong>⚠️ Error Checking Availability</strong>
            <button
              type="button"
              onClick={() => refreshAvailability()}
              className="btn-secondary btn-small"
              style={{ marginTop: '10px' }}
            >
              🔄 Retry
            </button>
          </div>
        );

      default:
        return (
          <div className="ai-status">
            <strong>Unknown Status:</strong> {aiAvailability.status}
          </div>
        );
    }
  };

  const onSubmit = (data: MessageForm) => {
    console.log('Message sent:', data);
    alert('Message sent! Check console.');
  };

  return (
    <div className="demo-card">
      <h2>3️⃣ Chrome AI Download Handling</h2>
      <p className="description">
        Demonstrates proper handling of Chrome AI model download with progress tracking.
        First-time users will see download UI.
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>Recipient</label>
          <input {...register('recipient')} placeholder="john@example.com" />
        </div>

        <div className="form-group">
          <label>Subject</label>
          <input {...register('subject')} placeholder="Meeting Request" />
        </div>

        <div className="form-group">
          <label>Message</label>
          <textarea
            {...register('message')}
            placeholder="Your message here..."
            rows={5}
          />
        </div>

        {renderAIStatus()}

        <div className="button-group">
          <button
            type="button"
            onClick={handleAutofillClick}
            disabled={aiLoading || aiAvailability?.status === 'unavailable'}
            className="btn-primary"
          >
            {aiLoading
              ? '⏳ Processing...'
              : aiAvailability?.needsDownload
              ? '📥 Download & Autofill'
              : '✨ AI Autofill'}
          </button>
          <button type="submit" className="btn-success">
            Send Message
          </button>
        </div>
      </form>

      <div className="info-box" style={{ marginTop: '20px' }}>
        <strong>💡 Download Flow:</strong>
        <ol style={{ marginTop: '10px', marginLeft: '20px', lineHeight: '1.8' }}>
          <li>First visit: Status shows "downloadable"</li>
          <li>User clicks button: Download starts automatically</li>
          <li>Progress bar shows download percentage</li>
          <li>After download: Status changes to "readily"</li>
          <li>Future visits: No download needed!</li>
        </ol>
      </div>
    </div>
  );
}
