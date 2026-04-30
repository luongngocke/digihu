import React, { useState } from 'react';
import { 
  LayoutDashboard, Wallet as WalletIcon, PenTool, ClipboardList, Building2,
  PieChart, Wrench, ChevronDown, HeadphonesIcon, ChevronLeft, Home, LayoutGrid, Plus
} from 'lucide-react';
import { cn } from '../lib/utils';
import { SidebarView } from '../components/SidebarViewTypes';

interface SidebarProps {
  currentView: SidebarView;
  onViewChange: (view: SidebarView) => void;
  onAddClick: () => void;
}

const mobileNavItems = [
  { id: 'dashboard', label: 'Tổng quan', icon: Home },
  { id: 'wallets', label: 'Tài khoản', icon: WalletIcon },
  { id: 'reports', label: 'Báo cáo', icon: PieChart },
  { id: 'debts', label: 'Khác', icon: LayoutGrid },
] as const;

export default function Sidebar({ currentView, onViewChange, onAddClick }: SidebarProps) {
  const [isRecordExpanded, setIsRecordExpanded] = useState(false);

  return (
    <>
      <aside className="md:hidden z-50 bg-[#00a8e8] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] flex flex-row fixed bottom-0 left-0 right-0 pb-safe">
        <nav className="flex-1 flex flex-row justify-around px-2 py-2 items-center">
          {mobileNavItems.slice(0, 2).map((item) => (
            <button key={item.id} onClick={() => onViewChange(item.id as SidebarView)} className="flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-xl transition-all flex-shrink-0 min-w-[64px] group">
              <item.icon size={26} className={cn("block mb-1", currentView === item.id || (currentView === 'transactions' && item.id === 'dashboard') ? "text-white" : "text-white/70")} strokeWidth={currentView === item.id ? 2.5 : 2} />
              <span className={cn("text-[10px] tracking-tight leading-none", currentView === item.id ? "font-bold text-white" : "font-normal mt-0.5 text-white/70")}>{item.label}</span>
            </button>
          ))}
          
          <div className="relative -top-6">
            <button onClick={onAddClick} className="w-14 h-14 rounded-full bg-white text-[#00a8e8] shadow-[0_8px_16px_rgba(0,0,0,0.1)] flex flex-col items-center justify-center gap-1.5 transition-transform active:scale-95">
              <Plus size={28} strokeWidth={2.5} />
              <span className="text-[10px] tracking-tight font-black absolute -bottom-5 text-white">Ghi chép</span>
            </button>
          </div>

          {mobileNavItems.slice(2, 4).map((item) => (
            <button key={item.id} onClick={() => onViewChange(item.id as SidebarView)} className="flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-xl transition-all flex-shrink-0 min-w-[64px] group">
              <item.icon size={26} className={cn("block mb-1", currentView === item.id ? "text-white" : "text-white/70")} strokeWidth={currentView === item.id ? 2.5 : 2} />
              <span className={cn("text-[10px] tracking-tight leading-none", currentView === item.id ? "font-bold text-white" : "font-normal mt-0.5 text-white/70")}>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <aside className="hidden md:flex w-[260px] flex-shrink-0 bg-white border-r border-slate-200 flex-col h-screen relative z-20">
        <div className="h-16 flex items-center px-4 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center font-bold text-white text-xl">M</div>
            <span className="font-bold text-[#007ace] text-lg tracking-tight">Sổ Thu Chi MISA</span>
          </div>
        </div>

        <div className="p-4 shrink-0">
          <button onClick={onAddClick} className="w-full bg-[#0088cc] hover:bg-[#007ace] text-white rounded-[4px] h-10 flex items-center justify-between px-4 transition-colors font-semibold">
            <div className="flex items-center gap-2"><span className="text-xl leading-none">+</span><span>Thêm ghi chép</span></div>
            <ChevronDown size={16} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 space-y-0.5 custom-scrollbar pb-4">
          <SidebarItem icon={LayoutDashboard} label="Trang chủ" isActive={currentView === 'dashboard'} onClick={() => onViewChange('dashboard')} />
          <SidebarItem icon={WalletIcon} label="Tài khoản" isActive={currentView === 'wallets'} onClick={() => onViewChange('wallets')} />
          <div>
            <button onClick={() => setIsRecordExpanded(!isRecordExpanded)} className={cn("w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-[#f0f6fa] transition-colors", isRecordExpanded && "bg-[#e2eff7] text-[#007ace] font-semibold")}>
              <div className="flex items-center gap-3"><PenTool size={18} className={isRecordExpanded ? "text-[#007ace]" : "text-slate-500"} /><span>Ghi chép</span></div>
              <ChevronDown size={16} className={cn("transition-transform", isRecordExpanded && "rotate-180")} />
            </button>
            {isRecordExpanded && (
              <div className="mt-1 space-y-1 relative before:absolute before:left-[23px] before:top-0 before:bottom-0 before:w-px before:bg-slate-200">
                <SubItem label="Ghi chép thu chi" onClick={onAddClick} />
                <SubItem label="Ghi chép hàng loạt" />
                <SubItem label="Nhập bằng excel" />
              </div>
            )}
          </div>
          <SidebarItem icon={ClipboardList} label="Lịch sử ghi chép" isActive={currentView === 'transactions'} onClick={() => onViewChange('transactions')} />
          <SidebarItem icon={Building2} label="Kết nối ngân hàng" onClick={() => alert('Đang phát triển')} />
          <SidebarItem icon={PieChart} label="Báo cáo" isActive={currentView === 'reports'} onClick={() => onViewChange('reports')} />
          <div>
            <button onClick={() => alert('Đang phát triển')} className={cn("w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-[#f0f6fa] transition-colors")}>
              <div className="flex items-center gap-3"><Wrench size={18} className="text-slate-500" /><span>Tiện ích</span></div>
              <ChevronDown size={16} className="transition-transform" />
            </button>
          </div>
        </nav>

        <div className="border-t border-slate-200 p-2 shrink-0 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"><HeadphonesIcon size={18} /><span>Hỗ trợ khách hàng</span></button>
          <button className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"><div className="flex items-center gap-3"><ChevronLeft size={18} /><span>Thu gọn</span></div></button>
        </div>
      </aside>
    </>
  );
}

function SidebarItem({ icon: Icon, label, isActive, onClick }: { icon: any, label: string, isActive?: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={cn("w-full flex items-center gap-3 px-4 py-2.5 rounded-[4px] text-sm transition-colors border-l-4", isActive ? "bg-[#eaf4fa] text-[#007ace] font-semibold border-[#007ace]" : "text-slate-700 hover:bg-[#f0f6fa] border-transparent")}>
      <Icon size={18} className={isActive ? "text-[#007ace]" : "text-slate-500"} /><span>{label}</span>
    </button>
  );
}

function SubItem({ label, onClick }: { label: string, onClick?: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center py-2 px-10 text-[13px] text-slate-600 hover:text-[#007ace] hover:bg-slate-50 rounded-lg transition-colors relative">
      <span className="w-1 h-1 rounded-full bg-slate-400 absolute left-[21.5px]"></span>{label}
    </button>
  );
}
