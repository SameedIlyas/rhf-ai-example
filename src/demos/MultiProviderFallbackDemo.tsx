import { useState } from 'react';
import { useForm } from 'react-hook-form-ai';

interface RegistrationForm {
  fullName: string;
  email: string;
  username: string;
  country: string;
}

export default function MultiProviderFallbackDemo() {
  const [lastProvider, setLastProvider] = useState<string | null>(null);
  const [attemptLog, setAttemptLog] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    aiAutofill,
    aiLoading,
  } = useForm<RegistrationForm>({
    ai: {
      // This form uses global providers from AIFormProvider
      // with automatic fallback enabled
      fallbackOnError: true,
    },
  });

  const handleAutofillWithLogging = async () => {
    setAttemptLog([]);
    const startTime = Date.now();

    try {
      // Log attempt
      setAttemptLog((prev) => [...prev, '🔄 Starting autofill...']);
      setAttemptLog((prev) => [...prev, '1️⃣ Trying Chrome AI...']);

      await aiAutofill();

      const duration = Date.now() - startTime;
      setAttemptLog((prev) => [
        ...prev,
        `✅ Success! Completed in ${duration}ms`,
      ]);
      setLastProvider('chrome');
    } catch (error) {
      setAttemptLog((prev) => [
        ...prev,
        '❌ All providers failed',
        `Error: ${error}`,
      ]);
      setLastProvider(null);
    }
  };

  const onSubmit = (data: RegistrationForm) => {
    console.log('Registration submitted:', data);
    alert('Registration successful! Check console.');
  };

  return (
    <div className="demo-card">
      <h2>4️⃣ Multi-Provider Fallback</h2>
      <p className="description">
        Demonstrates automatic fallback between providers. If Chrome AI fails, it tries OpenAI, then Custom Server.
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>Full Name</label>
          <input {...register('fullName')} placeholder="Jane Smith" />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            {...register('email')}
            type="email"
            placeholder="jane@example.com"
          />
        </div>

        <div className="form-group">
          <label>Username</label>
          <input {...register('username')} placeholder="janesmith" />
        </div>

        <div className="form-group">
          <label>Country</label>
          <input {...register('country')} placeholder="United States" />
        </div>

        <div className="info-box">
          <strong>🔄 Provider Execution Order:</strong>
          <ol style={{ marginTop: '10px', marginLeft: '20px' }}>
            <li>
              Chrome Built-in AI <span className="badge chrome">Priority: 10</span>
            </li>
            <li>
              OpenAI GPT-3.5 <span className="badge openai">Priority: 5</span>
            </li>
            <li>
              Custom Server <span className="badge custom">Priority: 1</span>
            </li>
          </ol>
          <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>
            If one provider fails, the next one is tried automatically.
          </p>
        </div>

        {attemptLog.length > 0 && (
          <div className="output-box">
            <strong>Execution Log:</strong>
            {attemptLog.map((log, index) => (
              <div key={index} style={{ marginTop: '5px' }}>
                {log}
              </div>
            ))}
          </div>
        )}

        {lastProvider && (
          <div className="ai-status available">
            <strong>✅ Last successful provider:</strong>{' '}
            <span className={`badge ${lastProvider}`}>
              {lastProvider.toUpperCase()}
            </span>
          </div>
        )}

        <div className="button-group">
          <button
            type="button"
            onClick={handleAutofillWithLogging}
            disabled={aiLoading}
            className="btn-primary"
          >
            {aiLoading ? '⏳ Trying providers...' : '✨ AI Autofill with Fallback'}
          </button>
          <button type="submit" className="btn-success">
            Register
          </button>
        </div>
      </form>
    </div>
  );
}
