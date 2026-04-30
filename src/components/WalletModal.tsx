/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Wallet as WalletIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: any) => void;
}

export default function WalletModal({ isOpen, onClose, onAdd }: WalletModalProps) {
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [type, setType] = useState('Bank');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      name,
      balance: parseFloat(balance),
      type,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden p-8"
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Thêm ví mới</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-2xl transition-colors">
              <X size={24} className="text-slate-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Tên ví / Tài khoản</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Techcombank"
                required
                className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-[1.5rem] p-4 text-sm font-bold outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Số dư ban đầu</label>
              <div className="relative">
                <input
                  type="number"
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                  placeholder="0"
                  required
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-[1.5rem] p-6 text-3xl font-black text-slate-800 transition-all outline-none"
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-300">VND</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Loại hình</label>
              <div className="grid grid-cols-3 gap-3">
                {['Bank', 'Cash', 'E-Wallet'].map((t) => (
                    <button
                        key={t}
                        type="button"
                        onClick={() => setType(t)}
                        className={cn(
                            "py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2",
                            type === t ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100" : "bg-slate-50 text-slate-500 border-transparent hover:bg-slate-100"
                        )}
                    >
                        {t}
                    </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-5 rounded-[1.5rem] bg-indigo-600 text-white font-black text-lg transition-all shadow-xl shadow-indigo-100 active:scale-[0.98]"
            >
              Tạo ví ngay
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
