import { useState } from 'react';
import { useForm } from 'react-hook-form-ai';

interface ProfileForm {
  username: string;
  bio: string;
  website: string;
  location: string;
}

export default function FieldSuggestionsDemo() {
  const {
    register,
    handleSubmit,
    aiSuggest,
    setValue,
  } = useForm<ProfileForm>({
    ai: {
      debounceMs: 500, // Faster suggestions
    },
  });

  const [suggestions, setSuggestions] = useState<Record<string, string>>({});
  const [loadingField, setLoadingField] = useState<string | null>(null);

  const getSuggestion = async (fieldName: keyof ProfileForm) => {
    setLoadingField(fieldName);
    try {
      const suggestion = await aiSuggest(fieldName);
      if (suggestion) {
        setSuggestions((prev) => ({ ...prev, [fieldName]: suggestion }));
      }
    } catch (error) {
      console.error(`Failed to get suggestion for ${fieldName}:`, error);
    } finally {
      setLoadingField(null);
    }
  };

  const acceptSuggestion = (fieldName: keyof ProfileForm) => {
    const suggestion = suggestions[fieldName];
    if (suggestion) {
      setValue(fieldName, suggestion);
      setSuggestions((prev) => {
        const updated = { ...prev };
        delete updated[fieldName];
        return updated;
      });
    }
  };

  const dismissSuggestion = (fieldName: keyof ProfileForm) => {
    setSuggestions((prev) => {
      const updated = { ...prev };
      delete updated[fieldName];
      return updated;
    });
  };

  const onSubmit = (data: ProfileForm) => {
    console.log('Profile submitted:', data);
    alert('Profile saved! Check console for data.');
  };

  return (
    <div className="demo-card">
      <h2>2️⃣ Field-Level AI Suggestions</h2>
      <p className="description">
        Get AI suggestions for individual fields. Type something, then click "Suggest" to get AI-powered improvements.
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>Username</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              {...register('username')}
              placeholder="johndoe123"
              style={{ flex: 1 }}
            />
            <button
              type="button"
              onClick={() => getSuggestion('username')}
              disabled={loadingField === 'username'}
              className="btn-secondary btn-small"
            >
              {loadingField === 'username' ? '...' : '✨ Suggest'}
            </button>
          </div>
          {suggestions.username && (
            <div className="suggestion-box">
              <strong>💡 AI Suggestion:</strong>
              <div className="suggestion-text">{suggestions.username}</div>
              <div className="suggestion-actions">
                <button
                  type="button"
                  onClick={() => acceptSuggestion('username')}
                  className="btn-success btn-small"
                >
                  ✓ Accept
                </button>
                <button
                  type="button"
                  onClick={() => dismissSuggestion('username')}
                  className="btn-secondary btn-small"
                >
                  ✗ Dismiss
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Bio</label>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <textarea
              {...register('bio')}
              placeholder="Tell us about yourself..."
              rows={4}
              style={{ flex: 1 }}
            />
            <button
              type="button"
              onClick={() => getSuggestion('bio')}
              disabled={loadingField === 'bio'}
              className="btn-secondary btn-small"
            >
              {loadingField === 'bio' ? '...' : '✨ Improve'}
            </button>
          </div>
          {suggestions.bio && (
            <div className="suggestion-box">
              <strong>💡 Improved Version:</strong>
              <div className="suggestion-text">{suggestions.bio}</div>
              <div className="suggestion-actions">
                <button
                  type="button"
                  onClick={() => acceptSuggestion('bio')}
                  className="btn-success btn-small"
                >
                  ✓ Accept
                </button>
                <button
                  type="button"
                  onClick={() => dismissSuggestion('bio')}
                  className="btn-secondary btn-small"
                >
                  ✗ Dismiss
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Website</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              {...register('website')}
              placeholder="https://example.com"
              style={{ flex: 1 }}
            />
            <button
              type="button"
              onClick={() => getSuggestion('website')}
              disabled={loadingField === 'website'}
              className="btn-secondary btn-small"
            >
              {loadingField === 'website' ? '...' : '✨ Suggest'}
            </button>
          </div>
          {suggestions.website && (
            <div className="suggestion-box">
              <strong>💡 AI Suggestion:</strong>
              <div className="suggestion-text">{suggestions.website}</div>
              <div className="suggestion-actions">
                <button
                  type="button"
                  onClick={() => acceptSuggestion('website')}
                  className="btn-success btn-small"
                >
                  ✓ Accept
                </button>
                <button
                  type="button"
                  onClick={() => dismissSuggestion('website')}
                  className="btn-secondary btn-small"
                >
                  ✗ Dismiss
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Location</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              {...register('location')}
              placeholder="San Francisco, CA"
              style={{ flex: 1 }}
            />
            <button
              type="button"
              onClick={() => getSuggestion('location')}
              disabled={loadingField === 'location'}
              className="btn-secondary btn-small"
            >
              {loadingField === 'location' ? '...' : '✨ Suggest'}
            </button>
          </div>
          {suggestions.location && (
            <div className="suggestion-box">
              <strong>💡 AI Suggestion:</strong>
              <div className="suggestion-text">{suggestions.location}</div>
              <div className="suggestion-actions">
                <button
                  type="button"
                  onClick={() => acceptSuggestion('location')}
                  className="btn-success btn-small"
                >
                  ✓ Accept
                </button>
                <button
                  type="button"
                  onClick={() => dismissSuggestion('location')}
                  className="btn-secondary btn-small"
                >
                  ✗ Dismiss
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="button-group">
          <button type="submit" className="btn-success">
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
}
