import { Cpu, Plus, CheckCircle2, Clock, Settings2, RefreshCw } from 'lucide-react';

export function AutomationsPage() {
  const workflows = [
    {
      id: 'wf-1',
      name: 'New Hire Provisioning & IT Checklist',
      trigger: 'Employee Onboarding Created',
      action: 'Generate Google Workspace, Slack & Jira Accounts',
      status: 'Active',
      lastRun: '12 mins ago',
      successRate: '99.4%',
    },
    {
      id: 'wf-2',
      name: 'Probation Review Reminder',
      trigger: 'Day 85 of Employment',
      action: 'Send Manager Evaluation Form & Slack Alert',
      status: 'Active',
      lastRun: '3 hours ago',
      successRate: '100%',
    },
    {
      id: 'wf-3',
      name: 'Leave Balance Year-End Rollover',
      trigger: 'December 31st at Midnight',
      action: 'Calculate carry-over & reset sick leave accruals',
      status: 'Paused',
      lastRun: '10 months ago',
      successRate: '98.1%',
    },
    {
      id: 'wf-4',
      name: 'Offboarding Security Off-ramp',
      trigger: 'Offboarding Request Approved',
      action: 'Revoke VPN access, disable Badge & archive email',
      status: 'Active',
      lastRun: '1 day ago',
      successRate: '100%',
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Cpu className="w-7 h-7 text-indigo-400" />
            Automations Center
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Build, monitor, and configure event-driven and scheduled enterprise HR workflows.
          </p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" /> Create Workflow
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>Active Workflows</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 mt-2">3</div>
          <p className="text-xs text-slate-500 mt-1">Operational across 4 departments</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>Total Executions (30d)</span>
            <RefreshCw className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 mt-2">1,428</div>
          <p className="text-xs text-emerald-400 mt-1">↑ 12% increase from last month</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>Execution Success Rate</span>
            <Clock className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 mt-2">99.4%</div>
          <p className="text-xs text-slate-500 mt-1">0 critical failures reported</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-200">Configured Workflows</h3>
          <span className="text-xs text-slate-400">Showing {workflows.length} workflows</span>
        </div>
        <div className="divide-y divide-slate-800">
          {workflows.map((wf) => (
            <div key={wf.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-slate-100">{wf.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      wf.status === 'Active'
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/50'
                        : 'bg-amber-950/60 text-amber-400 border border-amber-800/50'
                    }`}
                  >
                    {wf.status}
                  </span>
                </div>
                <div className="text-xs text-slate-400 flex flex-wrap gap-x-4 gap-y-1">
                  <span>Trigger: <strong className="text-slate-300">{wf.trigger}</strong></span>
                  <span>Action: <strong className="text-slate-300">{wf.action}</strong></span>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right text-xs">
                  <div className="text-slate-400">Last run: {wf.lastRun}</div>
                  <div className="text-emerald-400 font-medium">Success: {wf.successRate}</div>
                </div>
                <button className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors" title="Settings">
                  <Settings2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


