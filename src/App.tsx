import { useState } from 'react';
import { AIFormProvider } from 'react-hook-form-ai';
import BasicAutofillDemo from './demos/BasicAutofillDemo';
import FieldSuggestionsDemo from './demos/FieldSuggestionsDemo';
import ChromeAIDownloadDemo from './demos/ChromeAIDownloadDemo';
import MultiProviderFallbackDemo from './demos/MultiProviderFallbackDemo';
import ExcludeFieldsDemo from './demos/ExcludeFieldsDemo';
import PartialAutofillDemo from './demos/PartialAutofillDemo';

function App() {
  const [openAIKey, setOpenAIKey] = useState('');
  const [customServerUrl, setCustomServerUrl] = useState('http://localhost:3001');

  return (
    <AIFormProvider
      providers={[
        { type: 'chrome', priority: 10 },
        ...(openAIKey ? [{ 
          type: 'openai' as const, 
          apiKey: openAIKey, 
          model: 'gpt-3.5-turbo' as const,
          priority: 5 
        }] : []),
        { 
          type: 'custom' as const, 
          apiUrl: customServerUrl,
          priority: 1 
        }
      ]}
      executionOrder={['chrome', 'openai', 'custom']}
      fallbackOnError={true}
      enabled={true}
      debounceMs={800}
    >
      <div className="app">
        <header className="header">
          <h1>🤖 React Hook Form AI</h1>
          <p>Comprehensive Feature Demonstration</p>
        </header>

        <div className="demo-card" style={{ marginBottom: '30px' }}>
          <h2>⚙️ Global Configuration</h2>
          <p className="description">
            Configure AI providers globally. These settings apply to all forms below.
          </p>
          
          <div className="form-group">
            <label>OpenAI API Key (Optional)</label>
            <input
              type="password"
              value={openAIKey}
              onChange={(e) => setOpenAIKey(e.target.value)}
              placeholder="sk-..."
            />
            <span className="hint">
              Leave empty to use Chrome AI only. Add key to enable OpenAI fallback.
            </span>
          </div>

          <div className="form-group">
            <label>Custom Server URL (Optional)</label>
            <input
              type="text"
              value={customServerUrl}
              onChange={(e) => setCustomServerUrl(e.target.value)}
              placeholder="http://localhost:3001"
            />
            <span className="hint">
              Configure your custom AI server endpoint.
            </span>
          </div>

          <div className="info-box">
            <strong>Current Provider Priority:</strong>
            <ol style={{ marginTop: '10px', marginLeft: '20px' }}>
              <li>Chrome Built-in AI (Priority: 10) <span className="badge chrome">Free</span></li>
              {openAIKey && <li>OpenAI GPT-3.5 (Priority: 5) <span className="badge openai">Fallback</span></li>}
              <li>Custom Server (Priority: 1) <span className="badge custom">Final Fallback</span></li>
            </ol>
          </div>
        </div>

        <div className="demo-grid">
          <BasicAutofillDemo />
          <FieldSuggestionsDemo />
        </div>

        <div className="demo-grid">
          <ChromeAIDownloadDemo />
          <MultiProviderFallbackDemo />
        </div>

        <div className="demo-grid">
          <ExcludeFieldsDemo />
          <PartialAutofillDemo />
        </div>
      </div>
    </AIFormProvider>
  );
}

export default App;
