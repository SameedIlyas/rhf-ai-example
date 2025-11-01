import { useState } from 'react';
import { useForm } from 'react-hook-form-ai';

interface ShippingForm {
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Address
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  
  // Additional
  deliveryInstructions: string;
}

export default function PartialAutofillDemo() {
  const [lastFilledSection, setLastFilledSection] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    aiAutofill,
    aiLoading,
    watch,
  } = useForm<ShippingForm>();

  const formValues = watch();

  const fillPersonalInfo = async () => {
    setLastFilledSection('personal');
    try {
      await aiAutofill(['firstName', 'lastName', 'email', 'phone']);
    } catch (error) {
      console.error('Failed to fill personal info:', error);
    }
  };

  const fillAddress = async () => {
    setLastFilledSection('address');
    try {
      await aiAutofill(['street', 'city', 'state', 'zipCode', 'country']);
    } catch (error) {
      console.error('Failed to fill address:', error);
    }
  };

  const fillAll = async () => {
    setLastFilledSection('all');
    try {
      await aiAutofill();
    } catch (error) {
      console.error('Failed to fill form:', error);
    }
  };

  const onSubmit = (data: ShippingForm) => {
    console.log('Shipping info submitted:', data);
    alert('Order placed! Check console.');
  };

  return (
    <div className="demo-card">
      <h2>6️⃣ Partial Field Autofill</h2>
      <p className="description">
        Demonstrates selective autofill. Fill specific sections or all fields at once.
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Personal Information Section */}
        <div style={{ marginBottom: '25px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ color: '#667eea', margin: 0 }}>Personal Information</h3>
            <button
              type="button"
              onClick={fillPersonalInfo}
              disabled={aiLoading}
              className="btn-secondary btn-small"
            >
              {aiLoading && lastFilledSection === 'personal' ? '⏳' : '✨'} Fill This Section
            </button>
          </div>

          <div className="form-group">
            <label>First Name</label>
            <input {...register('firstName')} placeholder="John" />
          </div>

          <div className="form-group">
            <label>Last Name</label>
            <input {...register('lastName')} placeholder="Doe" />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input {...register('email')} type="email" placeholder="john@example.com" />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input {...register('phone')} placeholder="+1 (555) 123-4567" />
          </div>
        </div>

        {/* Address Section */}
        <div style={{ marginBottom: '25px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ color: '#667eea', margin: 0 }}>Shipping Address</h3>
            <button
              type="button"
              onClick={fillAddress}
              disabled={aiLoading}
              className="btn-secondary btn-small"
            >
              {aiLoading && lastFilledSection === 'address' ? '⏳' : '✨'} Fill This Section
            </button>
          </div>

          <div className="form-group">
            <label>Street Address</label>
            <input {...register('street')} placeholder="123 Main St" />
          </div>

          <div className="form-group">
            <label>City</label>
            <input {...register('city')} placeholder="San Francisco" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group">
              <label>State</label>
              <input {...register('state')} placeholder="CA" />
            </div>

            <div className="form-group">
              <label>ZIP Code</label>
              <input {...register('zipCode')} placeholder="94102" />
            </div>
          </div>

          <div className="form-group">
            <label>Country</label>
            <input {...register('country')} placeholder="United States" />
          </div>
        </div>

        {/* Additional Section */}
        <div style={{ marginBottom: '25px' }}>
          <h3 style={{ color: '#667eea', marginBottom: '15px' }}>Additional Information</h3>

          <div className="form-group">
            <label>Delivery Instructions (Optional)</label>
            <textarea
              {...register('deliveryInstructions')}
              placeholder="Leave at front door..."
              rows={3}
            />
          </div>
        </div>

        <div className="info-box">
          <strong>💡 Partial Autofill Usage:</strong>
          <p style={{ marginTop: '10px' }}>
            You can autofill specific fields by passing an array of field names:
          </p>
          <pre style={{ background: '#2d3748', color: '#e2e8f0', padding: '10px', borderRadius: '4px', marginTop: '10px', fontSize: '0.85rem' }}>
{`// Fill only personal info
await aiAutofill(['firstName', 'lastName', 'email', 'phone']);

// Fill only address
await aiAutofill(['street', 'city', 'state', 'zipCode', 'country']);

// Fill everything
await aiAutofill();`}
          </pre>
        </div>

        <div className="button-group">
          <button
            type="button"
            onClick={fillAll}
            disabled={aiLoading}
            className="btn-primary"
          >
            {aiLoading && lastFilledSection === 'all' ? '⏳ Filling All...' : '✨ Fill Entire Form'}
          </button>
          <button type="submit" className="btn-success">
            Place Order
          </button>
        </div>
      </form>

      {Object.keys(formValues).some(key => formValues[key as keyof ShippingForm]) && (
        <div className="output-box" style={{ marginTop: '20px' }}>
          <strong>Current Form Data:</strong>
          <pre>{JSON.stringify(formValues, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
