import React, { useState, useEffect } from 'react';
import { RefreshCcw, Bell, Settings, ChevronDown, Loader2 } from 'lucide-react';
import { cn, formatCurrency } from './lib/utils';
import { Wallet, Transaction, Debt } from './types';
import TransactionModal from './components/TransactionModal';
import WalletModal from './components/WalletModal';
import DebtModal from './components/DebtModal';
import Sidebar from './components/Sidebar';
import { SidebarView } from './components/SidebarViewTypes';
import Reports from './components/Reports';
import TransactionsView from './components/TransactionsView';
import WalletsView from './components/WalletsView';
import DebtsView from './components/DebtsView';
import PinLock from './components/PinLock';
import DesktopDashboard from './components/DesktopDashboard';
import MobileDashboard from './components/MobileDashboard';
import { api } from './services/api';
import ProfileModal from './components/ProfileModal';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [savedPin, setSavedPin] = useState(() => localStorage.getItem('app_savedPin') || '');
  const [userName, setUserName] = useState(() => localStorage.getItem('app_userName') || 'Người dùng');
  const [avatar, setAvatar] = useState(() => localStorage.getItem('app_avatar') || '');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const [wallets, setWallets] = useState<Wallet[]>(() => {
    try { const cached = localStorage.getItem('app_wallets'); return cached ? JSON.parse(cached) : []; } catch { return []; }
  });
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const cached = localStorage.getItem('app_transactions');
      if (cached) return JSON.parse(cached).map((t: any) => ({ ...t, date: new Date(t.date) }));
      return [];
    } catch { return []; }
  });
  const [debts, setDebts] = useState<Debt[]>(() => {
    try {
      const cached = localStorage.getItem('app_debts');
      if (cached) return JSON.parse(cached).map((d: any) => ({ ...d, date: new Date(d.date) }));
      return [];
    } catch { return []; }
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isDebtModalOpen, setIsDebtModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<SidebarView>('dashboard');
  
  const hasCachedData = wallets.length > 0 || transactions.length > 0 || debts.length > 0;
  const [isLoading, setIsLoading] = useState(!hasCachedData);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    if (isDataLoaded) return;
    async function fetchData() {
      if (!hasCachedData) setIsLoading(true);
      try {
        const data = await api.getData();
        if (data.pin !== undefined) { setSavedPin(data.pin); localStorage.setItem('app_savedPin', data.pin); }
        if (data.userName) { setUserName(data.userName); localStorage.setItem('app_userName', data.userName); }
        if (data.avatar) { setAvatar(data.avatar); localStorage.setItem('app_avatar', data.avatar); }
        
        if (data.wallets) {
          const parsedWallets = data.wallets.map((w: any) => ({
            ...w,
            balance: Number(w.balance),
            isDefault: w.isDefault === true || w.isDefault === 'TRUE'
          }));
          setWallets(parsedWallets);
          localStorage.setItem('app_wallets', JSON.stringify(parsedWallets));
        }
        if (data.transactions) {
          const parsedTransactions = data.transactions.map((t: any) => ({
             ...t,
             amount: Number(t.amount),
             date: new Date(t.date),
          })).sort((a: Transaction, b: Transaction) => b.date.getTime() - a.date.getTime());
          setTransactions(parsedTransactions);
          localStorage.setItem('app_transactions', JSON.stringify(parsedTransactions));
        }
        if (data.debts) {
          const parsedDebts = data.debts.map((d: any) => ({
            ...d,
            amount: Number(d.amount),
            date: new Date(d.date)
          })).sort((a: Debt, b: Debt) => b.date.getTime() - a.date.getTime());
          setDebts(parsedDebts);
          localStorage.setItem('app_debts', JSON.stringify(parsedDebts));
        }
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setIsLoading(false);
        setIsDataLoaded(true);
      }
    }
    fetchData();
  }, [isDataLoaded, hasCachedData]);

  useEffect(() => {
    localStorage.setItem('app_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('app_wallets', JSON.stringify(wallets));
  }, [wallets]);

  useEffect(() => {
    localStorage.setItem('app_debts', JSON.stringify(debts));
  }, [debts]);

  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);

  const handleAddTransaction = async (data: any) => {
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      note: data.note || wallets.find(w => w.id === data.walletId)?.name || '',
    };
    
    setTransactions([newTransaction, ...transactions]);
    
    let updatedBalance = 0;
    setWallets(wallets.map(w => {
      if (w.id === data.walletId) {
        updatedBalance = data.type === 'income' ? w.balance + data.amount : w.balance - data.amount;
        return { ...w, balance: updatedBalance };
      }
      return w;
    }));

    try {
      await api.addTransaction({
        ...newTransaction,
        date: newTransaction.date.toISOString(),
      });
      if (updatedBalance !== 0 || data.amount === 0) {
        await api.updateWalletBalance(data.walletId, updatedBalance);
      }
    } catch(err) {
      console.error(err);
      alert('Lỗi lưu giao dịch vào Sheet');
    }
  };

  const handleAddWallet = async (data: any) => {
    const newWallet: Wallet = { id: Math.random().toString(36).substr(2, 9), ...data };
    setWallets([...wallets, newWallet]);
    try {
      await api.addWallet(newWallet);
    } catch(err) {
      console.error(err);
      alert('Lỗi thêm tài khoản');
    }
  };

  const handleAddDebt = async (data: any) => {
    const newDebt: Debt = { id: Math.random().toString(36).substr(2, 9), ...data };
    setDebts([newDebt, ...debts]);
    try {
      await api.addDebt({ ...newDebt, date: newDebt.date.toISOString() });
    } catch(err) {
      console.error(err);
      alert('Lỗi thêm khoản nợ');
    }
  };

  if (isLoading && !hasCachedData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#e8f2f9] relative font-sans">
        <Loader2 className="w-10 h-10 animate-spin text-[#007ace]" />
        <p className="mt-4 font-bold text-slate-500">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <PinLock 
        savedPin={savedPin} 
        onUnlock={() => setIsAuthenticated(true)} 
        onSetPin={async (pin) => {
          localStorage.setItem('app_pin', pin);
          setSavedPin(pin);
          setIsAuthenticated(true);
          try {
            await api.updateSetting('pin', pin);
          } catch(e) {
             console.error("Failed to save PIN", e);
          }
        }} 
      />
    );
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <>
            <div className="hidden md:block h-full">
              <DesktopDashboard transactions={transactions} wallets={wallets} totalBalance={totalBalance} />
            </div>
            <div className="block md:hidden">
              <MobileDashboard 
                transactions={transactions} 
                wallets={wallets} 
                totalBalance={totalBalance} 
                userName={userName} 
                avatar={avatar} 
                setIsProfileModalOpen={setIsProfileModalOpen} 
                setCurrentView={setCurrentView} 
              />
            </div>
          </>
        );
      case 'transactions':
        return (
          <div className="md:p-6 p-4">
            <TransactionsView 
              transactions={transactions} 
              wallets={wallets} 
              onAddClick={() => setIsModalOpen(true)} 
            />
          </div>
        );
      case 'wallets':
        return (
          <div className="md:p-6 min-h-full">
            <WalletsView wallets={wallets} onAddClick={() => setIsWalletModalOpen(true)} />
          </div>
        );
      case 'reports':
        return (
          <div className="p-6">
            <Reports transactions={transactions} wallets={wallets} />
          </div>
        );
      case 'debts':
        return (
          <div className="md:p-6 p-4">
            <DebtsView debts={debts} onAddClick={() => setIsDebtModalOpen(true)} />
          </div>
        );
      default:
        return <div>View not implemented</div>;
    }
  };

  const getViewTitle = () => {
    switch(currentView) {
      case 'dashboard': return 'Trang chủ';
      case 'transactions': return 'Lịch sử ghi chép';
      case 'wallets': return 'Tài khoản';
      case 'reports': return 'Báo cáo';
      case 'debts': return 'Khác';
      default: return '';
    }
  };

  return (
    <div className="flex bg-[#f8fafc] md:bg-[#e8f2f9] h-screen overflow-hidden font-sans text-slate-800">
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        onAddClick={() => setIsModalOpen(true)} 
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="hidden md:flex h-[60px] bg-white flex items-center justify-between px-6 border-b border-slate-200 shrink-0 shadow-sm z-10">
           <div className="flex items-center gap-4 flex-1">
             <h2 className="text-lg font-bold text-slate-800 tracking-tight">{getViewTitle()}</h2>
           </div>
           
           <div className="flex items-center gap-6">
             <div className="hidden md:flex items-center gap-3">
               <button className="p-2 text-slate-400 hover:text-slate-600 border border-slate-200 rounded-[4px] bg-white">
                 <RefreshCcw size={16} />
               </button>
               <button className="p-2 text-slate-400 hover:text-slate-600 border border-slate-200 rounded-[4px] bg-white">
                 <Settings size={16} />
               </button>
               <div className="flex items-center gap-2 border border-slate-200 px-3 py-1.5 rounded-[4px] bg-white cursor-pointer hover:bg-slate-50">
                 <span className="text-sm text-slate-600">Thời gian:</span>
                 <span className="text-sm font-semibold">Tháng này</span>
                 <ChevronDown size={16} className="text-slate-400 ml-2" />
               </div>
             </div>

             <div className="w-px h-6 bg-slate-200 mx-2 hidden md:block"></div>

             <div className="flex items-center gap-4">
               <span className="text-sm text-slate-600 hidden md:block">Xin chào <span className="font-bold text-slate-800">{userName}</span> 👋</span>
               <button className="text-slate-400 hover:text-slate-600 relative">
                 <Bell size={20} />
                 <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
               </button>
               <button 
                 className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm hover:opacity-80 transition-opacity"
                 onClick={() => setIsProfileModalOpen(true)}
               >
                 {avatar ? (
                   <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                 ) : (
                   <span className="font-bold text-slate-600 uppercase">{userName.charAt(0)}</span>
                 )}
               </button>
             </div>
           </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto md:pb-0 pb-[80px]">
          {renderContent()}
        </main>
      </div>

      <TransactionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        wallets={wallets}
        onAdd={handleAddTransaction}
      />

      <WalletModal 
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onAdd={handleAddWallet}
      />

      <DebtModal 
        isOpen={isDebtModalOpen}
        onClose={() => setIsDebtModalOpen(false)}
        onAdd={handleAddDebt}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userName={userName}
        avatar={avatar}
        onUpdate={(name, img) => {
          setUserName(name);
          setAvatar(img);
        }}
      />
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}
