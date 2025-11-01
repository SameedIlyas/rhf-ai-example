import { useState } from 'react';
import { useForm } from 'react-hook-form-ai';

interface ContactForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
}

export default function BasicAutofillDemo() {
  const [submittedData, setSubmittedData] = useState<ContactForm | null>(null);

  const {
    register,
    handleSubmit,
    aiAutofill,
    aiLoading,
    aiAvailability,
    formState: { errors },
  } = useForm<ContactForm>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      jobTitle: '',
    },
  });

  const onSubmit = (data: ContactForm) => {
    setSubmittedData(data);
    console.log('Form submitted:', data);
  };

  const handleAutofill = async () => {
    try {
      await aiAutofill();
    } catch (error) {
      console.error('Autofill failed:', error);
      alert('AI autofill failed. Please try again or fill manually.');
    }
  };

  return (
    <div className="demo-card">
      <h2>1️⃣ Basic AI Autofill</h2>
      <p className="description">
        Demonstrates the core autofill feature. Click "AI Autofill" to populate all fields with realistic data.
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>First Name *</label>
          <input
            {...register('firstName', { required: 'First name is required' })}
            placeholder="John"
          />
          {errors.firstName && <span className="error">{errors.firstName.message}</span>}
        </div>

        <div className="form-group">
          <label>Last Name *</label>
          <input
            {...register('lastName', { required: 'Last name is required' })}
            placeholder="Doe"
          />
          {errors.lastName && <span className="error">{errors.lastName.message}</span>}
        </div>

        <div className="form-group">
          <label>Email *</label>
          <input
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            type="email"
            placeholder="john.doe@example.com"
          />
          {errors.email && <span className="error">{errors.email.message}</span>}
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input
            {...register('phone')}
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div className="form-group">
          <label>Company</label>
          <input
            {...register('company')}
            placeholder="Acme Corp"
          />
        </div>

        <div className="form-group">
          <label>Job Title</label>
          <input
            {...register('jobTitle')}
            placeholder="Software Engineer"
          />
        </div>

        <div className={`ai-status ${aiAvailability?.available ? 'available' : 'unavailable'}`}>
          <strong>AI Status:</strong> {aiAvailability?.status || 'Checking...'}
          {aiAvailability?.needsDownload && ' (Download required)'}
        </div>

        <div className="button-group">
          <button
            type="button"
            onClick={handleAutofill}
            disabled={aiLoading || !aiAvailability?.available}
            className="btn-primary"
          >
            {aiLoading ? '⏳ Filling...' : '✨ AI Autofill'}
          </button>
          <button type="submit" className="btn-success">
            Submit Form
          </button>
        </div>
      </form>

      {submittedData && (
        <div className="output-box">
          <strong>Submitted Data:</strong>
          <pre>{JSON.stringify(submittedData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
