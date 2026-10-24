import React from 'react';
import { Settings, Shield, Cpu, CheckCircle } from 'lucide-react';

export function AdvancedSettingsPage() {
  const [saved, setSaved] = React.useState(false);
  const [aiEnabled, setAiEnabled] = React.useState(true);
  const [strictRbac, setStrictRbac] = React.useState(true);
  const [twoFactor, setTwoFactor] = React.useState(true);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Settings className="w-7 h-7 text-indigo-400" />
            Advanced Settings & Security
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Configure global enterprise parameters, AI assistant permissions, and compliance guardrails.
          </p>
        </div>
        <button
          onClick={handleSave}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
        >
          {saved && <CheckCircle className="w-4 h-4 text-emerald-300" />}
          {saved ? 'Saved Successfully' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
            <Shield className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-slate-100">Security & Compliance Guardrails</h3>
          </div>
          <div className="space-y-4 pt-1">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-slate-200">Strict Role-Based Access Control (RBAC)</h4>
                <p className="text-xs text-slate-400">Enforce strict department boundaries and PII field redaction for non-admin users.</p>
              </div>
              <input
                type="checkbox"
                checked={strictRbac}
                onChange={(e) => setStrictRbac(e.target.checked)}
                className="w-5 h-5 accent-indigo-600 rounded bg-slate-950 border-slate-800"
              />
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-slate-800/60">
              <div>
                <h4 className="text-sm font-medium text-slate-200">Mandatory Two-Factor Authentication (2FA)</h4>
                <p className="text-xs text-slate-400">Require all HR personnel and managers to authenticate with TOTP or hardware keys.</p>
              </div>
              <input
                type="checkbox"
                checked={twoFactor}
                onChange={(e) => setTwoFactor(e.target.checked)}
                className="w-5 h-5 accent-indigo-600 rounded bg-slate-950 border-slate-800"
              />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-slate-100">IntelligenceHR Assistant Configuration</h3>
          </div>
          <div className="space-y-4 pt-1">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-slate-200">Enable Ask Intelligence AI Assistant</h4>
                <p className="text-xs text-slate-400">Allow users to query HR policies and workforce analytics through conversational AI.</p>
              </div>
              <input
                type="checkbox"
                checked={aiEnabled}
                onChange={(e) => setAiEnabled(e.target.checked)}
                className="w-5 h-5 accent-indigo-600 rounded bg-slate-950 border-slate-800"
              />
            </div>
            <div className="pt-3 border-t border-slate-800/60 space-y-2">
              <label className="text-sm font-medium text-slate-200 block">LLM Embeddings Provider</label>
              <select className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 w-full max-w-md focus:outline-none focus:border-indigo-500">
                <option>OpenAI GPT-4o (Secure Enterprise Tenant)</option>
                <option>Anthropic Claude 3.5 Sonnet</option>
                <option>Local Llama 3.3 70B (Air-gapped)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

