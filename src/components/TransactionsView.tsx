/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus,
  Calendar,
  Wallet as WalletIcon
} from 'lucide-react';
import { Transaction, Wallet } from '../types';
import { cn, formatCurrency } from '../lib/utils';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { motion } from 'motion/react';

interface TransactionsViewProps {
  transactions: Transaction[];
  wallets: Wallet[];
  onAddClick: () => void;
}

export default function TransactionsView({ transactions, wallets, onAddClick }: TransactionsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const categoryStr = t.category || '';
      const noteStr = t.note || '';
      const term = searchTerm.toLowerCase();
      const matchesSearch = categoryStr.toLowerCase().includes(term) || 
                           noteStr.toLowerCase().includes(term);
      const matchesType = typeFilter === 'all' || t.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [transactions, searchTerm, typeFilter]);

  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-4 md:px-0 pt-4 md:pt-0">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Lịch sử giao dịch</h2>
          <p className="text-sm text-slate-500 font-medium">Quản lý chi tiết tất cả các dòng tiền của bạn</p>
        </div>
        <button 
          onClick={onAddClick}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl text-sm font-black transition-all flex items-center gap-2 shadow-xl shadow-indigo-100 active:scale-95"
        >
          <Plus size={20} />
          Giao dịch mới
        </button>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-8 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Tìm kiếm giao dịch, ghi chú..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-4 text-sm font-bold shadow-sm focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
          />
        </div>
        <div className="md:col-span-4 flex gap-2">
          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="flex-1 bg-white border border-slate-200 rounded-xl px-6 py-4 text-sm font-bold shadow-sm outline-none appearance-none cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <option value="all">Tất cả loại</option>
            <option value="income">Thu nhập (+)</option>
            <option value="expense">Chi phí (-)</option>
          </select>
          <button className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm text-slate-400 hover:text-indigo-600 transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Ngày</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Hạng mục / Ghi chú</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Ví sử dụng</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Số tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredTransactions.map((t, i) => (
                <motion.tr 
                  key={t.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex flex-col items-center justify-center text-slate-500">
                        <span className="text-[10px] font-black leading-none">{format(t.date, 'MM')}</span>
                        <span className="text-sm font-black leading-none mt-0.5">{format(t.date, 'dd')}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div>
                      <p className="text-sm font-black text-slate-800 tracking-tight">{t.category}</p>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">{t.note}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                     <span className="inline-flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full text-[10px] font-black text-slate-600 uppercase tracking-tighter">
                        <WalletIcon size={12} />
                        {wallets.find(w => w.id === t.walletId)?.name}
                     </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className={cn(
                      "inline-flex items-center gap-2 text-sm font-black font-mono tracking-tighter",
                      t.type === 'income' ? "text-emerald-600" : "text-rose-600"
                    )}>
                      {t.type === 'income' ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredTransactions.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
            <Search size={40} className="mb-4 opacity-20" />
            <p className="font-bold">Không tìm thấy giao dịch nào</p>
            <p className="text-xs">Hãy thử đổi bộ lọc hoặc thêm giao dịch mới</p>
          </div>
        )}
      </div>
    </div>
  );
}
