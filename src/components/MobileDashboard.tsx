import React from 'react';
import { 
  Wallet as WalletIcon, TrendingUp, ChevronRight,
  Bell, RefreshCcw, Eye, Settings, Grid, PiggyBank,
  Landmark, Briefcase, Percent, Shield
} from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';
import { Transaction, Wallet } from '../types';

export default function MobileDashboard({ transactions, wallets, totalBalance, userName, avatar, setIsProfileModalOpen, setCurrentView }: any) {
  const totalIncome = transactions.filter((t: Transaction) => t.type === 'income').reduce((sum: number, t: Transaction) => sum + t.amount, 0);
  const totalExpense = transactions.filter((t: Transaction) => t.type === 'expense').reduce((sum: number, t: Transaction) => sum + t.amount, 0);

  return (
    <div className="animate-in fade-in duration-500 pb-8 relative font-sans pt-safe">
      <div className="absolute top-0 left-0 right-0 h-[280px] bg-gradient-to-b from-[#0cb0e3] to-[#00a6e6] z-0 rounded-b-[1.5rem] shadow-sm"></div>
      
      <div className="relative z-10 space-y-5 pt-8 max-w-lg mx-auto">
        <header className="flex justify-between items-center px-4 w-full">
          <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setIsProfileModalOpen(true)}>
            <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white font-bold bg-white/20 uppercase text-sm overflow-hidden">
              {avatar ? <img src={avatar} alt="Avatar" className="w-full h-full object-cover" /> : userName.charAt(0)}
            </div>
            <div className="leading-tight">
              <p className="text-white/90 text-xs font-medium">Xin chào!</p>
              <p className="text-white font-bold text-base">{userName}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-white">
            <RefreshCcw size={22} strokeWidth={2} />
            <Bell size={22} strokeWidth={2} />
          </div>
        </header>

        <div className="px-4">
          <div className="bg-white rounded-xl shadow-sm p-4 w-full flex flex-col justify-center gap-2">
            <div className="flex justify-between items-center text-slate-800">
              <span className="font-bold text-base">Tổng số dư</span>
              <ChevronRight size={20} className="text-slate-400 font-light" />
            </div>
            <div className="flex items-center gap-2">
              <span className={cn("text-[26px] font-bold tracking-tight", totalBalance >= 0 ? "text-emerald-500" : "text-rose-500")}>
                {formatCurrency(totalBalance)}
              </span>
              <Eye size={20} className="text-slate-700" strokeWidth={2} />
            </div>
          </div>
        </div>

        <div className="px-4">
          <div className="bg-white rounded-xl shadow-sm px-2 py-5 w-full grid grid-cols-4 gap-y-6 gap-x-0">
            <DashboardAction icon={WalletIcon} label="Tài khoản chi tiêu" color="text-[#0cb0e3]" onClick={() => setCurrentView('wallets')} />
            <DashboardAction icon={TrendingUp} label="Quản lý tài sản" color="text-amber-600" onClick={() => alert('Đang phát triển')} />
            <DashboardAction icon={PiggyBank} label="Quản lý sổ tiết kiệm" color="text-[#0cb0e3]" onClick={() => alert('Đang phát triển')} />
            <DashboardAction icon={Landmark} label="Kết nối ngân hàng" color="text-[#0cb0e3]" onClick={() => alert('Đang phát triển')} />
            <DashboardAction icon={Briefcase} label="Du lịch" color="text-[#0cb0e3]" onClick={() => alert('Đang phát triển')} />
            <DashboardAction icon={Percent} label="Chia tiền" color="text-[#0cb0e3]" onClick={() => alert('Đang phát triển')} />
            <DashboardAction icon={Shield} label="Bảo hiểm" color="text-blue-600" badge="Mới" onClick={() => alert('Đang phát triển')} />
            <DashboardAction icon={Grid} label="Tất cả" color="text-slate-500" onClick={() => alert('Đang phát triển')} />
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <h2 className="text-[17px] font-bold text-slate-900 px-4">Dành riêng cho bạn</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 px-4 custom-scrollbar snap-x">
             <div className="min-w-[170px] bg-emerald-50 rounded-2xl p-4 flex flex-col relative overflow-hidden snap-start cursor-pointer hover:opacity-90">
               <p className="text-[13px] font-bold text-slate-800 z-10 leading-snug w-[80%]">Bạn muốn tạo tài khoản tài sản?</p>
               <p className="text-sm font-bold text-[#0cb0e3] mt-4 z-10">Bắt đầu ngay</p>
               <div className="absolute right-[-10px] bottom-[-5px] text-5xl">💰</div>
             </div>
             <div className="min-w-[170px] bg-[#fdf2fa] rounded-2xl p-4 flex flex-col relative overflow-hidden snap-start cursor-pointer hover:opacity-90">
               <p className="text-[13px] font-bold text-slate-800 z-10 leading-snug w-[80%]">Tính Thuế TNCN như thế nào?</p>
               <div className="absolute right-[-20px] bottom-[-20px] text-fuchsia-300 opacity-20 text-[100px] leading-none">≈</div>
             </div>
          </div>
        </div>

        <div className="px-4 space-y-3 pb-8">
          <div className="flex justify-between items-center">
            <h2 className="text-[17px] font-bold text-slate-900">Tình hình thu chi</h2>
            <div className="flex items-center gap-2">
              <button className="p-[3px] rounded-md border border-slate-200 bg-white">
                <Settings size={16} className="text-slate-500" strokeWidth={2.5}/>
              </button>
              <button className="flex items-center gap-1 border border-slate-200 rounded-md px-2 py-1 bg-white text-[13px]">
                Tháng này
                <ChevronRight size={14} className="rotate-90 text-slate-400" strokeWidth={2.5} />
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-5 w-full">
            <div className="flex items-start gap-4">
              <div className="w-16 h-[110px] flex items-end justify-between border-b-[1.5px] border-slate-200 pb-1 flex-shrink-0">
                <div className="w-0.5 h-0 bg-emerald-500 mx-auto rounded-t-sm"></div>
                <div className="w-8 h-[95%] bg-rose-500 mx-auto rounded-t-sm"></div>
              </div>
              <div className="flex-1 flex flex-col gap-4 py-1">
                 <div className="flex justify-between items-center text-[13px]">
                   <span className="text-slate-500">Thu</span>
                   <span className="font-bold text-emerald-600">{formatCurrency(totalIncome)}</span>
                 </div>
                 <div className="flex justify-between items-center text-[13px]">
                   <span className="text-slate-500">Chi</span>
                   <span className="font-bold text-rose-500">{formatCurrency(totalExpense)}</span>
                 </div>
                 <div className="flex justify-between items-center text-[13px] border-t border-slate-100 pt-3">
                   <span className="text-slate-500">Chênh lệch</span>
                   <span className={cn("font-bold", totalIncome - totalExpense >= 0 ? "text-emerald-600" : "text-rose-600")}>
                     {totalIncome - totalExpense > 0 ? "+" : ""}{formatCurrency(totalIncome - totalExpense)}
                   </span>
                 </div>
              </div>
            </div>

            <div className="flex items-center gap-5 mt-6 pt-5">
               <div className="w-20 h-20 rounded-full border-[18px] border-emerald-400 border-r-rose-500 border-b-rose-500 border-l-amber-400 flex-shrink-0"></div>
               <div className="flex-1 space-y-[10px]">
                 <div className="flex justify-between text-xs items-center">
                   <div className="flex items-center gap-2 text-slate-500"><div className="w-3.5 h-3.5 rounded-[4px] bg-amber-400" /> Cước xe</div>
                   <span className="font-bold">41,84 %</span>
                 </div>
                 <div className="flex justify-between text-xs items-center">
                   <div className="flex items-center gap-2 text-slate-500"><div className="w-3.5 h-3.5 rounded-[4px] bg-rose-500" /> Ăn uống</div>
                   <span className="font-bold">41,14 %</span>
                 </div>
                 <div className="flex justify-between text-xs items-center">
                   <div className="flex items-center gap-2 text-slate-500"><div className="w-3.5 h-3.5 rounded-[4px] bg-emerald-400" /> Dịch vụ sinh hoạt</div>
                   <span className="font-bold">17,02 %</span>
                 </div>
               </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button onClick={() => setCurrentView('transactions')} className="border border-slate-200 px-5 py-2.5 rounded-[0.8rem] text-xs font-bold text-slate-800 hover:bg-slate-50 transition w-full sm:w-auto text-center">
                Lịch sử ghi chép
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardAction({ icon: Icon, label, color, badge, onClick }: { icon: any, label: string, color: string, badge?: string, onClick?: () => void }) {
  return (
    <button className="flex flex-col items-center gap-2 group relative" onClick={onClick}>
      {badge && <span className="absolute -top-3 -right-2 bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full z-10">{badge}</span>}
      <div className="w-12 h-12 flex items-center justify-center bg-slate-50 group-hover:bg-slate-100 rounded-full transition-colors">
        <Icon size={24} className={color} strokeWidth={2} />
      </div>
      <span className="text-[11px] text-slate-700 font-medium text-center leading-tight max-w-[64px]">{label}</span>
    </button>
  );
}
