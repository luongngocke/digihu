/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, ArrowUpRight, ArrowDownLeft, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Wallet, TransactionType } from '../types';
import { cn } from '../lib/utils';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallets: Wallet[];
  onAdd: (data: any) => void;
}

export default function TransactionModal({ isOpen, onClose, wallets, onAdd }: TransactionModalProps) {
  const [type, setType] = useState<TransactionType>('expense');
  const [amountStr, setAmountStr] = useState('');
  const [category, setCategory] = useState('');
  const [walletId, setWalletId] = useState('');
  
  // Custom categories state
  const [categories, setCategories] = useState<string[]>(['Ăn uống', 'Đi lại', 'Mua sắm', 'Lương', 'Giải trí']);
  const [newCat, setNewCat] = useState('');
  const [showCatManager, setShowCatManager] = useState(false);

  useEffect(() => {
    if (wallets.length > 0 && !walletId) {
      setWalletId(wallets[0].id);
    }
  }, [wallets, walletId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amountStr || !category) return;
    
    onAdd({
      type,
      amount: parseFloat(amountStr),
      category,
      walletId,
      date: new Date(),
    });
    setAmountStr('');
    setCategory('');
    onClose();
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setAmountStr(val);
  };

  const formattedAmount = amountStr ? Number(amountStr).toLocaleString('vi-VN') : '';

  const addCategory = () => {
    if (newCat && !categories.includes(newCat)) {
      setCategories([...categories, newCat]);
      setCategory(newCat);
      setNewCat('');
      setShowCatManager(false);
    }
  };

  const deleteCategory = (cat: string) => {
    setCategories(categories.filter(c => c !== cat));
    if (category === cat) setCategory('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex flex-col bg-white overflow-hidden">
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Giao dịch mới</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={24} className="text-slate-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {showCatManager ? (
            <div className="p-4 md:p-6 space-y-4 animate-in fade-in slide-in-from-right-4">
              <div className="flex items-center gap-2 mb-6">
                <button onClick={() => setShowCatManager(false)} className="text-slate-500 font-medium text-sm">Quay lại</button>
                <div className="h-4 w-[1px] bg-slate-300"></div>
                <h3 className="font-bold text-slate-800">Quản lý hạng mục</h3>
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value)}
                  placeholder="Thêm hạng mục mới"
                  className="flex-1 bg-slate-50 border border-slate-200 focus:border-[#0cb0e3] rounded-lg p-3 text-sm outline-none"
                />
                <button onClick={addCategory} className="bg-[#0cb0e3] text-white px-4 rounded-lg font-bold">
                  Thêm
                </button>
              </div>

              <div className="space-y-2 mt-4">
                {categories.map((cat, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="font-medium text-slate-700">{cat}</span>
                    <button onClick={() => deleteCategory(cat)} className="text-rose-500 p-1 hover:bg-rose-50 rounded">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-6">
              <div className="flex p-1 bg-slate-100 rounded-xl gap-1">
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  className={cn(
                    "flex-1 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2",
                    type === 'expense' ? "bg-white text-rose-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
                  )}
                >
                  <ArrowDownLeft size={16} />
                  Chi phí
                </button>
                <button
                  type="button"
                  onClick={() => setType('income')}
                  className={cn(
                    "flex-1 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2",
                    type === 'income' ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
                  )}
                >
                  <ArrowUpRight size={16} />
                  Thu nhập
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Số tiền</label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formattedAmount}
                    onChange={handleAmountChange}
                    placeholder="0"
                    required
                    className={cn(
                      "w-full bg-slate-50 border border-slate-200 focus:border-[#0cb0e3] focus:bg-white rounded-xl p-4 text-3xl font-black transition-all outline-none",
                      type === 'expense' ? "text-rose-600" : "text-emerald-600"
                    )}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">đ</span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hạng mục</label>
                    <button 
                      type="button" 
                      onClick={() => setShowCatManager(true)}
                      className="text-xs font-bold text-[#0cb0e3]"
                    >
                      Sửa / Thêm
                    </button>
                  </div>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#0cb0e3] focus:bg-white rounded-xl p-3.5 text-sm font-bold outline-none transition-all appearance-none"
                  >
                    <option value="" disabled>Chọn hạng mục</option>
                    {categories.map((c, i) => (
                      <option key={i} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Chọn ví</label>
                  <select
                    value={walletId}
                    onChange={(e) => setWalletId(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#0cb0e3] focus:bg-white rounded-xl p-3.5 text-sm font-bold outline-none transition-all appearance-none"
                  >
                    <option value="" disabled>Chọn ví</option>
                    {wallets.map(w => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={!amountStr || !category || !walletId}
                  className={cn(
                    "w-full py-4 rounded-xl text-white font-bold text-base transition-all",
                    (!amountStr || !category || !walletId) 
                      ? "bg-slate-300 cursor-not-allowed" 
                      : (type === 'expense' ? "bg-rose-600 hover:bg-rose-700 active:scale-[0.98]" : "bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98]")
                  )}
                >
                  Lưu giao dịch
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </AnimatePresence>
  );
}
