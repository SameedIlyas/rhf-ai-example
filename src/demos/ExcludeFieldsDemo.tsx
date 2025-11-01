import { useForm } from 'react-hook-form-ai';

interface AccountForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  creditCard: string;
  ssn: string;
  displayName: string;
}

export default function ExcludeFieldsDemo() {

  const {
    register,
    handleSubmit,
    aiAutofill,
    aiLoading,
    watch,
    formState: { errors },
  } = useForm<AccountForm>({
    ai: {
      enabled: true,
      excludeFields: ['password', 'confirmPassword', 'creditCard', 'ssn'],
      debounceMs: 800,
    },
  });

  const formValues = watch();

  const onSubmit = (data: AccountForm) => {
    console.log('Account created:', {
      ...data,
      password: '***REDACTED***',
      confirmPassword: '***REDACTED***',
      creditCard: '***REDACTED***',
      ssn: '***REDACTED***',
    });
    alert('Account created! Check console (sensitive data redacted).');
  };

  return (
    <div className="demo-card">
      <h2>5️⃣ Exclude Sensitive Fields</h2>
      <p className="description">
        Demonstrates field exclusion for security. Password, credit card, and SSN fields are excluded from AI processing.
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>Username ✅ AI Enabled</label>
          <input {...register('username')} placeholder="johndoe" />
          <span className="hint">This field will be autofilled by AI</span>
        </div>

        <div className="form-group">
          <label>Email ✅ AI Enabled</label>
          <input
            {...register('email', {
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email',
              },
            })}
            type="email"
            placeholder="john@example.com"
          />
          {errors.email && <span className="error">{errors.email.message}</span>}
          <span className="hint">This field will be autofilled by AI</span>
        </div>

        <div className="form-group">
          <label>Display Name ✅ AI Enabled</label>
          <input {...register('displayName')} placeholder="John Doe" />
          <span className="hint">This field will be autofilled by AI</span>
        </div>

        <div className="form-group">
          <label>Password 🔒 Excluded</label>
          <input
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters',
              },
            })}
            type="password"
            placeholder="Enter secure password"
          />
          {errors.password && <span className="error">{errors.password.message}</span>}
          <span className="hint" style={{ color: '#e53e3e' }}>
            🔒 Excluded from AI for security
          </span>
        </div>

        <div className="form-group">
          <label>Confirm Password 🔒 Excluded</label>
          <input
            {...register('confirmPassword', {
              required: 'Please confirm password',
            })}
            type="password"
            placeholder="Confirm password"
          />
          {errors.confirmPassword && (
            <span className="error">{errors.confirmPassword.message}</span>
          )}
          <span className="hint" style={{ color: '#e53e3e' }}>
            🔒 Excluded from AI for security
          </span>
        </div>

        <div className="form-group">
          <label>Credit Card 🔒 Excluded</label>
          <input
            {...register('creditCard')}
            type="text"
            placeholder="1234 5678 9012 3456"
            maxLength={19}
          />
          <span className="hint" style={{ color: '#e53e3e' }}>
            🔒 Excluded from AI for security
          </span>
        </div>

        <div className="form-group">
          <label>SSN 🔒 Excluded</label>
          <input
            {...register('ssn')}
            type="text"
            placeholder="XXX-XX-XXXX"
            maxLength={11}
          />
          <span className="hint" style={{ color: '#e53e3e' }}>
            🔒 Excluded from AI for security
          </span>
        </div>

        <div className="info-box">
          <strong>🔒 Security Configuration:</strong>
          <p style={{ marginTop: '10px' }}>
            The following fields are excluded from AI processing:
          </p>
          <ul style={{ marginTop: '8px', marginLeft: '20px' }}>
            <li>password</li>
            <li>confirmPassword</li>
            <li>creditCard</li>
            <li>ssn</li>
          </ul>
          <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>
            These fields will never be sent to any AI provider, ensuring sensitive data stays secure.
          </p>
        </div>

        <div className="button-group">
          <button
            type="button"
            onClick={() => aiAutofill()}
            disabled={aiLoading}
            className="btn-primary"
          >
            {aiLoading ? '⏳ Filling...' : '✨ AI Autofill (Safe Fields Only)'}
          </button>
          <button type="submit" className="btn-success">
            Create Account
          </button>
        </div>
      </form>

      <div className="output-box" style={{ marginTop: '20px' }}>
        <strong>Current Form State:</strong>
        <pre>
          {JSON.stringify(
            {
              ...formValues,
              password: formValues.password ? '***HIDDEN***' : '',
              confirmPassword: formValues.confirmPassword ? '***HIDDEN***' : '',
              creditCard: formValues.creditCard ? '***HIDDEN***' : '',
              ssn: formValues.ssn ? '***HIDDEN***' : '',
            },
            null,
            2
          )}
        </pre>
      </div>
    </div>
  );
}
