import React from 'react';
import { Plus, Wallet as WalletIcon, MoreVertical, ChevronRight, PiggyBank, Landmark, Shield, TrendingUp, HandCoins } from 'lucide-react';
import { Wallet } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { motion } from 'motion/react';

interface WalletsViewProps {
  wallets: Wallet[];
  onAddClick: () => void;
}

export default function WalletsView({ wallets, onAddClick }: WalletsViewProps) {
  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);

  return (
    <div className="w-full max-w-4xl mx-auto md:bg-transparent pb-10">
      {/* Mobile Structure */}
      <div className="md:hidden">
        {/* Mobile Top Header (Blue Gradient) */}
        <div className="bg-gradient-to-b from-[#0cb0e3] to-[#00a6e6] px-4 pt-10 pb-16 shadow-sm rounded-b-[1.5rem]">
          <h1 className="text-white font-bold text-lg mb-4 text-center">Tài khoản của tôi</h1>
          <div className="bg-white/20 border border-white/30 rounded-xl p-4 flex justify-between items-center backdrop-blur-sm shadow-inner">
            <div>
              <p className="text-white/90 text-xs font-semibold mb-1">Tổng số dư</p>
              <div className="flex items-center gap-2">
                <span className="text-[22px] font-bold text-white tracking-tight leading-none">{formatCurrency(totalBalance)}</span>
              </div>
            </div>
            <button onClick={onAddClick} className="w-8 h-8 rounded-full bg-white text-[#0cb0e3] flex items-center justify-center font-bold shadow-lg">
              <Plus size={20} />
            </button>
          </div>
        </div>

        <div className="-mt-8 px-4 space-y-6 relative z-10">
          {/* Tài khoản chi tiêu */}
          <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-4 border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-slate-800 text-[15px]">Tài khoản chi tiêu <span className="text-slate-400 font-normal">({wallets.length})</span></h2>
              <ChevronRight size={18} className="text-slate-400" />
            </div>
            <div className="space-y-4">
              {wallets.map((wallet, index) => (
                <div key={wallet.id} className={cn("flex items-center justify-between group", index < wallets.length - 1 && "border-b border-slate-50 pb-4")}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-slate-50" style={{ backgroundColor: '#eef8fb' }}>
                      <WalletIcon size={20} className="text-[#0cb0e3]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 text-[14px]">{wallet.name}</h3>
                      <p className={`text-[13px] font-bold ${wallet.balance >= 0 ? 'text-slate-500' : 'text-rose-500'}`}>
                        {formatCurrency(wallet.balance)}
                      </p>
                    </div>
                  </div>
                  <button className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 transition-colors">
                    <MoreVertical size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <SectionCard 
            title="Quản lý sổ tiết kiệm" 
            bgColor="bg-emerald-50" 
            iconBg="bg-white" 
            icon={PiggyBank} 
            iconColor="text-[#0cb0e3]"
            titleCard="Tạo sổ tiết kiệm"
            desc="Tiết kiệm cho tương lai"
          />

          <SectionCard 
            title="Sổ tích lũy" 
            bgColor="bg-white" 
            iconBg="bg-[#f0f9ff]" 
            icon={HandCoins} 
            iconColor="text-[#f4a261]"
            titleCard="Tạo sổ tích lũy"
            desc="Tích lũy cho mục tiêu của bạn"
          />

          <SectionCard 
            title="Quản lý tài sản" 
            badge="Beta"
            bgColor="bg-white" 
            iconBg="bg-amber-50" 
            icon={TrendingUp} 
            iconColor="text-amber-600"
            titleCard="Tạo tài khoản tài sản"
            desc="Quản lý bất động sản, kim loại quý..."
          />
        </div>
      </div>

      {/* Desktop Structure */}
      <div className="hidden md:block">
        <div className="flex justify-between items-center bg-white p-6 rounded-t-xl border-b border-slate-200">
          <div>
             <h2 className="text-xl font-bold text-slate-800">Tài khoản & Nguồn tiền</h2>
             <p className="text-sm text-slate-500 mt-1">Quản lý các tài khoản chi tiêu và tích lũy của bạn</p>
          </div>
          <button 
            onClick={onAddClick}
            className="flex items-center gap-2 bg-[#007ace] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#0088cc] transition-colors"
          >
            <Plus size={18} />
            Thêm tài khoản
          </button>
        </div>

        <div className="bg-white p-6 rounded-b-xl shadow-sm min-h-[500px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wallets.map((wallet, i) => (
              <motion.div 
                key={wallet.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-slate-50 rounded-xl border border-slate-200 p-5 flex flex-col justify-between group hover:border-[#0cb0e3] transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-[#0cb0e3] shrink-0 shadow-sm border border-slate-100">
                    <WalletIcon size={24} />
                  </div>
                  <button className="text-slate-300 hover:text-slate-500 transition-colors p-1 rounded-md hover:bg-slate-200">
                    <MoreVertical size={18} />
                  </button>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-600 mb-1 text-sm">{wallet.name}</h3>
                  <p className={`text-xl font-bold tracking-tight ${wallet.balance >= 0 ? 'text-slate-800' : 'text-rose-500'}`}>
                    {formatCurrency(wallet.balance)}
                  </p>
                </div>
              </motion.div>
            ))}
            
            <button 
              onClick={onAddClick}
              className="border-2 border-dashed border-slate-200 rounded-xl p-5 flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-[#007ace] hover:text-[#007ace] transition-all group min-h-[140px]"
            >
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-[#e8f2f9] transition-colors">
                    <Plus size={24} />
                </div>
                <span className="font-semibold text-sm">Thêm tài khoản</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionCard({ title, badge, bgColor, iconBg, icon: Icon, iconColor, titleCard, desc }: any) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2 px-1">
        <h2 className="font-bold text-slate-800 text-[15px]">{title}</h2>
        {badge && <span className="text-[10px] bg-rose-100 text-rose-500 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">{badge}</span>}
      </div>
      <div className={cn("rounded-2xl p-4 flex justify-between items-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 cursor-pointer", bgColor)}>
        <div className="flex items-center gap-3">
          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shadow-sm", iconBg)}>
            <Icon size={24} className={iconColor} strokeWidth={2} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-[14px]">{titleCard}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
          </div>
        </div>
        <ChevronRight size={18} className="text-slate-400" />
      </div>
    </div>
  );
}
