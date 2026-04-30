import React from 'react';
import { RefreshCcw, HandCoins, ArrowRight, Expand, Settings, Wallet as WalletIcon } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, ReferenceLine } from 'recharts';
import { formatCurrency, cn } from '../lib/utils';
import { Transaction, Wallet } from '../types';

interface DesktopDashboardProps {
  transactions: Transaction[];
  wallets: Wallet[];
  totalBalance: number;
}

export default function DesktopDashboard({ transactions, wallets, totalBalance }: DesktopDashboardProps) {
  // Calculations
  const currentMonthTransactions = transactions; // Add filtering later
  const incomeTxs = currentMonthTransactions.filter(t => t.type === 'income');
  const expenseTxs = currentMonthTransactions.filter(t => t.type === 'expense');

  const totalIncome = incomeTxs.reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = expenseTxs.reduce((sum, t) => sum + t.amount, 0);

  // Group by category for charts
  const getTopCategories = (txs: Transaction[]) => {
    const map = new Map<string, number>();
    txs.forEach(t => map.set(t.category, (map.get(t.category) || 0) + t.amount));
    const sorted = Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
    return sorted.map(([name, value]) => ({ name, value }));
  };

  const incomeData = getTopCategories(incomeTxs);
  const expenseData = getTopCategories(expenseTxs);
  const COLORS = ['#2cd3e0', '#f4a261', '#e76f51', '#2a9d8f', '#e9c46a', '#a8dadc', '#457b9d'];
  const EXPENSE_COLORS = ['#f4a261', '#e76f51', '#2a9d8f', '#9b5de5'];

  return (
    <div className="flex gap-4 p-4 w-full h-full max-w-[1600px] mx-auto min-h-0 relative">
      
      {/* Main Grid Content */}
      <div className="flex-1 grid grid-cols-12 gap-4 auto-rows-max overflow-y-auto custom-scrollbar pr-2 pb-10">
        
        {/* Row 1: Tổng số dư & Thu */}
        <div className="col-span-12 xl:col-span-6">
          <div className="bg-[#1cb0ed] rounded-lg shadow-sm p-4 h-32 flex flex-col justify-center relative overflow-hidden">
             {/* Decorative lines could go here */}
             <div className="text-white/90 text-sm font-semibold mb-1">Tổng số dư</div>
             <div className="text-white text-3xl font-bold flex items-center gap-2">
               ***000 <span className="underline decoration-1 underline-offset-4 text-2xl">đ</span>
             </div>
          </div>
        </div>

        <div className="col-span-12 xl:col-span-6">
          <ChartCard title="Thu tiền" data={incomeData} total={totalIncome} colors={COLORS} />
        </div>

        {/* Row 2: Tổng quan & Chi */}
        <div className="col-span-12 xl:col-span-6">
           <div className="bg-white rounded-lg shadow-sm p-5 h-[340px] flex flex-col">
             <div className="flex justify-between items-center mb-4">
               <h3 className="font-bold text-slate-800">Tổng quan</h3>
               <button className="text-slate-400 hover:text-slate-600"><RefreshCcw size={16}/></button>
             </div>
             
             {/* Bar Chart Area */}
             <div className="flex-1 min-h-0 flex items-center justify-center pl-10 pr-10">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'Thu', Thu: totalIncome, Chi: 0 },
                    { name: 'Chi', Thu: 0, Chi: totalExpense }
                  ]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} barSize={32}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13}} />
                    <Bar dataKey="Thu" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Chi" stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
             </div>
             
             {/* Stats summary */}
             <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Tổng thu</span>
                  <span className="font-bold text-[#10b981]">{formatCurrency(totalIncome)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Tổng chi</span>
                  <span className="font-bold text-[#f43f5e]">{formatCurrency(totalExpense)}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold pt-1">
                  <span className="text-slate-800">Chênh lệch</span>
                  <span className="text-slate-800">{formatCurrency(totalIncome - totalExpense)}</span>
                </div>
             </div>
           </div>
        </div>

        <div className="col-span-12 xl:col-span-6">
          <ChartCard title="Chi tiền" data={expenseData} total={totalExpense} colors={EXPENSE_COLORS} />
        </div>

        {/* Row 3: Lịch & Tài khoản */}
        <div className="col-span-12 xl:col-span-8">
            <div className="bg-white rounded-lg shadow-sm p-4 h-[250px] flex flex-col">
               <div className="flex justify-between items-center mb-2 shrink-0">
                 <h3 className="font-bold text-slate-800">Lịch chi tiêu tháng</h3>
                 <button className="text-slate-400 hover:text-slate-600"><RefreshCcw size={16}/></button>
               </div>
               <div className="text-center text-sm font-semibold mb-4 shrink-0">
                  <span className="text-slate-400 cursor-pointer mr-4">«  ‹</span>
                  Tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}
                  <span className="text-slate-400 cursor-pointer ml-4">›  »</span>
               </div>
               {/* Simulating stats under calendar */}
               <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-4 mt-auto">
                 <div className="text-center">
                   <div className="text-[13px] text-slate-500 mb-1">Tổng thu</div>
                   <div className="font-bold text-emerald-500">{formatCurrency(totalIncome)}</div>
                 </div>
                 <div className="text-center border-l border-r border-slate-100">
                   <div className="text-[13px] text-slate-500 mb-1">Tổng chi</div>
                   <div className="font-bold text-rose-500">{formatCurrency(totalExpense)}</div>
                 </div>
                 <div className="text-center">
                   <div className="text-[13px] text-slate-500 mb-1">Chênh lệch</div>
                   <div className="font-bold text-slate-800">{formatCurrency(totalIncome - totalExpense)}</div>
                 </div>
               </div>
            </div>
        </div>

        <div className="col-span-12 xl:col-span-4">
             <div className="bg-white rounded-lg shadow-sm p-4 h-[250px] flex flex-col">
               <div className="flex justify-between items-center mb-4 shrink-0">
                 <h3 className="font-bold text-slate-800">Danh sách tài khoản</h3>
                 <div className="flex gap-2 text-slate-400">
                   <button className="hover:text-slate-600"><RefreshCcw size={16}/></button>
                   <button className="hover:text-slate-600"><Expand size={16}/></button>
                 </div>
               </div>
               
               <div className="flex border-b border-slate-200 mb-3 shrink-0">
                 <button className="flex-1 pb-2 border-b-2 border-[#007ace] text-[#007ace] font-semibold text-sm">Tài khoản</button>
                 <button className="flex-1 pb-2 text-slate-500 font-medium text-sm">Sổ tiết kiệm</button>
                 <button className="flex-1 pb-2 text-slate-500 font-medium text-sm">Tích lũy</button>
               </div>

               <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
                 {wallets.map(w => (
                   <div key={w.id} className="bg-slate-50 rounded-lg p-3 flex items-center gap-3 border border-slate-100">
                     <div className="w-8 h-8 bg-amber-600 rounded flex items-center justify-center shrink-0">
                       <WalletIcon size={16} className="text-white" />
                     </div>
                     <div className="flex-1 min-w-0">
                       <div className="font-semibold text-sm text-slate-800 truncate">{w.name}</div>
                     </div>
                     <div className={cn("font-bold text-sm shrink-0", w.balance >= 0 ? "text-emerald-500" : "text-rose-500")}>
                        {formatCurrency(w.balance)}
                     </div>
                   </div>
                 ))}
               </div>
             </div>
        </div>

      </div>

      {/* Far Right Sidebar: Ghi chép gần đây (Fixed Width) */}
      <div className="w-[320px] flex-shrink-0 flex flex-col gap-4 overflow-y-auto custom-scrollbar pb-10">
        <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col min-h-0 h-full">
           <div className="flex justify-between items-center mb-4 shrink-0">
             <h3 className="font-bold text-slate-800">Ghi chép gần đây</h3>
             <div className="flex gap-2 text-slate-400">
               <button className="hover:text-slate-600"><RefreshCcw size={16}/></button>
               <button className="hover:text-slate-600"><Expand size={16}/></button>
             </div>
           </div>
           
           <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1">
             {transactions.slice(0, 8).map(tx => (
               <div key={tx.id} className="p-3 bg-[#f8fbfe] rounded border border-slate-100 flex items-center gap-3">
                 <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-[#e2eff7] shrink-0">
                   <HandCoins size={20} className={tx.type === 'income' ? 'text-emerald-500' : 'text-rose-400'} />
                 </div>
                 <div className="flex-1 min-w-0">
                   <div className="flex justify-between items-start">
                     <p className="text-sm font-medium text-slate-800 truncate">{tx.category}</p>
                     <p className={cn("text-sm font-bold whitespace-nowrap", tx.type === 'income' ? 'text-emerald-500' : 'text-rose-500')}>
                       {formatCurrency(tx.amount || 0)}
                     </p>
                   </div>
                   <div className="flex justify-between items-center mt-1">
                     <p className="text-xs text-slate-500">{new Date(tx.date).toLocaleDateString('vi-VN')}</p>
                     <div className="flex items-center gap-1 bg-[#1cb0ed] text-white px-2 py-0.5 rounded text-[10px] font-semibold">
                       <span className="w-3 h-3 rounded-full bg-white/20 flex items-center justify-center text-[8px]">$</span>
                       {wallets.find(w => w.id === tx.walletId)?.name || 'Ví'}
                     </div>
                   </div>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, data, total, colors }: { title: string, data: any[], total: number, colors: string[] }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 h-[340px] flex flex-col xl:h-full min-h-[300px]">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-slate-800">{title}</h3>
        <div className="flex gap-2 text-slate-400">
          <button className="hover:text-slate-600"><RefreshCcw size={16}/></button>
          <button className="hover:text-slate-600"><Expand size={16}/></button>
        </div>
      </div>
      
      {data.length > 0 ? (
        <div className="flex-1 flex flex-col xl:flex-row items-center justify-center min-h-0 relative gap-4">
          <div className="w-[180px] h-[180px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 w-full max-w-[200px] flex flex-col justify-center space-y-3">
             {data.slice(0, 4).map((item, idx) => (
               <div key={idx} className="flex items-center justify-between text-sm">
                 <div className="flex items-center gap-2 truncate">
                   <div className="w-3 h-3 rounded-[3px] shrink-0" style={{ backgroundColor: colors[idx % colors.length] }}></div>
                   <span className="text-slate-600 truncate">{item.name}</span>
                 </div>
                 <span className="font-semibold text-slate-800 shrink-0 ml-2">
                   {total > 0 ? ((item.value / total) * 100).toFixed(2) : 0}%
                 </span>
               </div>
             ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">Chưa có dữ liệu</div>
      )}
    </div>
  );
}
