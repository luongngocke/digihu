/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Filter as FilterIcon, 
  Download,
  TrendingUp,
  TrendingDown,
  PieChart as PieIcon,
  BarChart as BarIcon
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { format, subDays, startOfDay, endOfDay, isWithinInterval } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Transaction, Wallet, TransactionType } from '../types';
import { cn, formatCurrency } from '../lib/utils';
import { motion } from 'motion/react';

interface ReportsProps {
  transactions: Transaction[];
  wallets: Wallet[];
}

export default function Reports({ transactions, wallets }: ReportsProps) {
  const [dateRange, setDateRange] = useState({
    start: subDays(new Date(), 30),
    end: new Date()
  });
  const [categoryFilter, setCategoryFilter] = useState<TransactionType | 'all'>('all');
  const [walletFilter, setWalletFilter] = useState<string>('all');

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const dateMatch = isWithinInterval(new Date(t.date), {
        start: startOfDay(dateRange.start),
        end: endOfDay(dateRange.end)
      });
      const categoryMatch = categoryFilter === 'all' || t.type === categoryFilter;
      const walletMatch = walletFilter === 'all' || t.walletId === walletFilter;
      return dateMatch && categoryMatch && walletMatch;
    });
  }, [transactions, dateRange, categoryFilter, walletFilter]);

  const summary = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      income,
      expenses,
      net: income - expenses
    };
  }, [filteredTransactions]);

  const chartData = useMemo(() => {
    const data: Record<string, { name: string, income: number, expense: number }> = {};
    filteredTransactions.forEach(t => {
      const day = format(new Date(t.date), 'dd/MM');
      if (!data[day]) {
        data[day] = { name: day, income: 0, expense: 0 };
      }
      if (t.type === 'income') data[day].income += t.amount;
      else data[day].expense += t.amount;
    });
    return Object.values(data).sort((a, b) => {
        // Simple sort by day of month for the mock display
        return parseInt(a.name.split('/')[0]) - parseInt(b.name.split('/')[0]);
    });
  }, [filteredTransactions]);

  const pieData = useMemo(() => {
    const categories: Record<string, number> = {};
    filteredTransactions
      .filter(t => categoryFilter === 'all' ? t.type === 'expense' : true)
      .forEach(t => {
        categories[t.category] = (categories[t.category] || 0) + t.amount;
      });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [filteredTransactions, categoryFilter]);

  const COLORS = ['#4f46e5', '#10b981', '#f43f5e', '#f59e0b', '#8b5cf6', '#06b6d4'];

  const exportToCSV = () => {
    const headers = ['ID', 'Ngày', 'Hạng mục', 'Loại', 'Số tiền', 'Ví'];
    const rows = filteredTransactions.map(t => [
      t.id,
      format(t.date, 'dd/MM/yyyy'),
      t.category,
      t.type === 'income' ? 'Thu' : 'Chi',
      t.amount,
      wallets.find(w => w.id === t.walletId)?.name || ''
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [headers, ...rows].map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `bao-cao-tai-chinh-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Phân tích tài chính</h2>
          <p className="text-sm text-slate-500 font-medium tracking-tight">Chi tiết thu chi và xu hướng dòng tiền</p>
        </div>
        <button 
          onClick={exportToCSV}
          className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 hover:bg-slate-50 shadow-sm"
        >
          <Download size={16} /> Xuất dữ liệu
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Loại giao dịch</label>
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="w-full bg-slate-50 border-none rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-100 transition-all appearance-none cursor-pointer"
          >
            <option value="all">Tất cả thu chi</option>
            <option value="income">Chỉ thu nhập</option>
            <option value="expense">Chỉ chi phí</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Chọn ví</label>
          <select 
            value={walletFilter}
            onChange={(e) => setWalletFilter(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-100 transition-all appearance-none cursor-pointer"
          >
            <option value="all">Tất cả ví</option>
            {wallets.map(w => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5 flex flex-col justify-end">
          <div className="flex gap-2">
            <button 
                onClick={() => setDateRange({ start: subDays(new Date(), 7), end: new Date() })}
                className="flex-1 bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 px-2 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all"
            >
                7 ngày qua
            </button>
            <button 
                onClick={() => setDateRange({ start: subDays(new Date(), 30), end: new Date() })}
                className="flex-1 bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 px-2 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all"
            >
                30 ngày qua
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 bg-slate-50">
        <motion.div 
            whileHover={{ y: -4 }}
            className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl md:rounded-[2rem] flex flex-col justify-between"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <TrendingUp size={20} />
            </div>
            <span className="text-[10px] font-black uppercase text-emerald-600 tracking-tighter">Tổng thu nhập</span>
          </div>
          <p className="text-2xl font-black text-emerald-800 font-mono tracking-tighter">{formatCurrency(summary.income)}</p>
        </motion.div>

        <motion.div 
            whileHover={{ y: -4 }}
            className="bg-rose-50 border border-rose-100 p-6 rounded-2xl md:rounded-[2rem] flex flex-col justify-between"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-rose-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rose-200">
              <TrendingDown size={20} />
            </div>
            <span className="text-[10px] font-black uppercase text-rose-600 tracking-tighter">Tổng chi phí</span>
          </div>
          <p className="text-2xl font-black text-rose-800 font-mono tracking-tighter">{formatCurrency(summary.expenses)}</p>
        </motion.div>

        <motion.div 
            whileHover={{ y: -4 }}
            className="bg-indigo-600 p-6 rounded-2xl md:rounded-[2rem] flex flex-col justify-between text-white shadow-xl shadow-indigo-100"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center text-white backdrop-blur-md">
              <PieIcon size={20} />
            </div>
            <span className="text-[10px] font-black uppercase text-indigo-100 tracking-tighter">Số dư ròng</span>
          </div>
          <p className="text-2xl font-black font-mono tracking-tighter">{summary.net >= 0 ? '+' : ''}{formatCurrency(summary.net)}</p>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 bg-slate-50">
        <div className="bg-white p-6 rounded-2xl md:rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col min-h-[400px]">
          <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
            <BarIcon size={18} className="text-indigo-500" />
            Biểu đồ xu hướng
          </h3>
          <div className="flex-1 w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} 
                />
                <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
                    tickFormatter={(val) => `${val / 1000}k`}
                />
                <Tooltip 
                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl md:rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col min-h-[400px]">
          <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
            <PieIcon size={18} className="text-indigo-500" />
            Cơ cấu chi tiêu
          </h3>
          <div className="flex-1 w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
                {pieData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span className="text-[10px] font-bold text-slate-600 truncate">{entry.name}</span>
                    </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
