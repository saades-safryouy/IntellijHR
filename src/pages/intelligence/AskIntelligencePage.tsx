import React from 'react';
import { Bot, Send, Sparkles, Shield } from 'lucide-react';

export function AskIntelligencePage() {
  const [messages, setMessages] = React.useState([
    {
      role: 'assistant',
      content: 'Hello! I am your IntelligenceHR AI Assistant. How can I help you analyze workforce analytics, check leave policies, or generate employee insights today?',
    },
  ]);
  const [input, setInput] = React.useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `I've analyzed your query regarding "${userMsg}". Based on current active RBAC permissions and HR datasets, all compliance checks are verified. Is there anything specific about departmental headcounts or leave approval trends you would like to drill down into?`,
        },
      ]);
    }, 800);
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Bot className="w-7 h-7 text-indigo-400" />
            Ask Intelligence
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Conversational workforce analytics and policy intelligence powered by secure LLM embeddings.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-indigo-950/50 border border-indigo-800/60 px-3 py-1.5 rounded-lg text-xs text-indigo-300">
          <Shield className="w-4 h-4 text-indigo-400" />
          <span>RBAC & PII Masked</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Suggested Prompts
            </h3>
            <div className="space-y-2">
              {[
                'What is our current engineering turnover rate?',
                'Show pending leave approvals exceeding 3 days',
                'Summarize Q3 department headcount growth',
                'Explain remote work compliance guidelines',
              ].map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => setInput(prompt)}
                  className="w-full text-left text-xs bg-slate-800/60 hover:bg-slate-800 text-slate-300 p-2.5 rounded-lg border border-slate-700/50 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-xl flex flex-col h-[600px]">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-indigo-400" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-xl p-4 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-200 border border-slate-700/60'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className="p-4 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about employees, policies, or analytics..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
            >
              <Send className="w-4 h-4" /> Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

