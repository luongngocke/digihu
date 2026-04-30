/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  HandCoins, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  CheckCircle2, 
  User,
  Clock,
  ArrowRight,
  Calendar
} from 'lucide-react';
import { Debt } from '../types';
import { cn, formatCurrency } from '../lib/utils';
import { format } from 'date-fns';
import { motion } from 'motion/react';

interface DebtsViewProps {
  debts: Debt[];
  onAddClick: () => void;
}

export default function DebtsView({ debts, onAddClick }: DebtsViewProps) {
  const totalLend = debts.filter(d => d.type === 'lend').reduce((sum, d) => sum + d.amount, 0);
  const totalBorrow = debts.filter(d => d.type === 'borrow').reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="space-y-4 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Ghi nợ & Cho vay</h2>
          <p className="text-sm text-slate-500 font-medium">Theo dõi các khoản tiền đang lưu thông bên ngoài</p>
        </div>
        <button 
            onClick={onAddClick}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl text-sm font-black transition-all flex items-center gap-2 shadow-xl shadow-indigo-100"
        >
          <Plus size={20} />
          Ghi nợ mới
        </button>
      </div>

      {/* Debt Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 bg-slate-50">
        <div className="bg-rose-600 rounded-3xl md:rounded-[2.5rem] p-8 text-white shadow-xl shadow-rose-100 flex justify-between items-center relative overflow-hidden">
             <div className="absolute top-[-20%] left-[-10%] opacity-10">
                <TrendingDown size={120} />
            </div>
            <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-2">Bạn đang nợ</p>
                <p className="text-4xl font-black font-mono tracking-tighter">{formatCurrency(totalBorrow)}</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-md">
                <TrendingDown size={32} />
            </div>
        </div>
        <div className="bg-emerald-600 rounded-3xl md:rounded-[2.5rem] p-8 text-white shadow-xl shadow-emerald-100 flex justify-between items-center relative overflow-hidden">
            <div className="absolute top-[-20%] left-[-10%] opacity-10">
                <TrendingUp size={120} />
            </div>
            <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-2">Người khác nợ bạn</p>
                <p className="text-4xl font-black font-mono tracking-tighter">{formatCurrency(totalLend)}</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-md">
                <TrendingUp size={32} />
            </div>
        </div>
      </div>

      {/* Active Debts List */}
      <div className="space-y-4">
        <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 uppercase tracking-tight ml-2 mt-4 md:mt-0">
            <Clock size={18} className="text-indigo-500" />
            Các khoản đang hoạt động
        </h3>
        
        <div className="grid grid-cols-1 gap-4 bg-slate-50">
            {debts.map((debt, i) => (
                <motion.div 
                    key={debt.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white border border-slate-200 rounded-2xl md:rounded-[2rem] p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow group"
                >
                    <div className="flex items-center gap-6 w-full md:w-auto">
                        <div className={cn(
                            "w-16 h-16 rounded-[1.5rem] flex items-center justify-center font-black text-2xl shadow-lg transition-transform group-hover:scale-110",
                            debt.type === 'borrow' ? "bg-rose-100 text-rose-600 shadow-rose-50" : "bg-emerald-100 text-emerald-600 shadow-emerald-50"
                        )}>
                            <User size={28} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-lg font-black text-slate-800 tracking-tight">{debt.person}</h4>
                                <span className={cn(
                                    "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                                    debt.type === 'borrow' ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
                                )}>
                                    {debt.type === 'borrow' ? 'Khoản nợ' : 'Cho vay'}
                                </span>
                            </div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Calendar size={12} />
                                Ngày tạo: {format(new Date(debt.date), 'dd/MM/yyyy')}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Số dư còn lại</p>
                            <p className={cn(
                                "text-2xl font-black font-mono tracking-tighter",
                                debt.type === 'borrow' ? "text-rose-600" : "text-emerald-600"
                            )}>
                                {formatCurrency(debt.amount)}
                            </p>
                        </div>
                        <button className="bg-slate-50 hover:bg-slate-100 p-4 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all active:scale-95">
                            <ArrowRight size={24} />
                        </button>
                    </div>
                </motion.div>
            ))}
        </div>
      </div>

      {/* Done State Button */}
      <div className="pt-8 border-t border-slate-100 flex justify-center">
            <button className="flex items-center gap-2 text-slate-400 hover:text-emerald-500 transition-colors font-bold text-sm">
                <CheckCircle2 size={18} />
                Xem các khoản đã tất toán
            </button>
      </div>
    </div>
  );
}
