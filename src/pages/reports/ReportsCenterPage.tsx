import React from 'react';
import { BarChart3, Download, Filter, Calendar, Users, TrendingUp, DollarSign } from 'lucide-react';

export function ReportsCenterPage() {
  const [reportType, setReportType] = React.useState('headcount');

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-indigo-400" />
            Reports & Analytics Center
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Comprehensive workforce metrics, turnover diagnostics, and exportable compliance reports.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
            <Download className="w-4 h-4" /> Export CSV / PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>Total Headcount</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 mt-2">248</div>
          <p className="text-xs text-emerald-400 mt-1">+14 net hires this quarter</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>Attrition Rate</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 mt-2">4.2%</div>
          <p className="text-xs text-emerald-400 mt-1">2.1% lower than industry avg</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>Leave Utilization</span>
            <Calendar className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 mt-2">68.5%</div>
          <p className="text-xs text-slate-500 mt-1">Average 14.2 days per employee</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>Payroll Run Status</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 mt-2">Completed</div>
          <p className="text-xs text-emerald-400 mt-1">Processed Oct 25, 2026</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-100">Departmental Headcount Distribution</h3>
            <p className="text-xs text-slate-400">Breakdown of active employees across business units</p>
          </div>
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
            {['headcount', 'turnover', 'compensation'].map((type) => (
              <button
                key={type}
                onClick={() => setReportType(type)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${
                  reportType === type ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 pt-2">
          {[
            { dept: 'Engineering & Product', count: 96, pct: 38.7, color: 'bg-indigo-500' },
            { dept: 'Sales & Customer Success', count: 68, pct: 27.4, color: 'bg-sky-500' },
            { dept: 'Operations & People', count: 42, pct: 16.9, color: 'bg-emerald-500' },
            { dept: 'Marketing & Growth', count: 24, pct: 9.7, color: 'bg-amber-500' },
            { dept: 'Finance & Legal', count: 18, pct: 7.3, color: 'bg-purple-500' },
          ].map((item, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-200">{item.dept}</span>
                <span className="text-slate-400">{item.count} employees ({item.pct}%)</span>
              </div>
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800/60">
                <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

