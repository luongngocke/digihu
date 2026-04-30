import React, { useState, useEffect } from 'react';
import { ShieldCheck, Delete } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface PinLockProps {
  savedPin: string;
  onUnlock: () => void;
  onSetPin: (pin: string) => void;
}

export default function PinLock({ savedPin, onUnlock, onSetPin }: PinLockProps) {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState<'login' | 'setup' | 'setup-confirm'>(savedPin ? 'login' : 'setup');
  const [error, setError] = useState(false);

  // Vibration feedback if supported
  const triggerVibration = () => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
  };

  const currentInputValue = step === 'setup-confirm' ? confirmPin : pin;

  const handleNumber = (num: string) => {
    triggerVibration();
    if (error) setError(false);
    if (step === 'login' || step === 'setup') {
      if (pin.length < 4) setPin(prev => prev + num);
    } else {
      if (confirmPin.length < 4) setConfirmPin(prev => prev + num);
    }
  };

  const handleDelete = () => {
    triggerVibration();
    if (error) setError(false);
    if (step === 'login' || step === 'setup') {
      setPin(prev => prev.slice(0, -1));
    } else {
      setConfirmPin(prev => prev.slice(0, -1));
    }
  };

  useEffect(() => {
    if (step === 'login' && pin.length === 4) {
      if (pin === savedPin) {
        onUnlock();
      } else {
        setError(true);
        setTimeout(() => { setPin(''); setError(false); }, 500);
      }
    } else if (step === 'setup' && pin.length === 4) {
      setTimeout(() => setStep('setup-confirm'), 300);
    } else if (step === 'setup-confirm' && confirmPin.length === 4) {
      if (pin === confirmPin) {
        onSetPin(pin);
      } else {
        setError(true);
        setTimeout(() => {
          setConfirmPin('');
          setError(false);
        }, 500);
      }
    }
  }, [pin, confirmPin, step, savedPin, onUnlock, onSetPin]);

  const renderDots = () => {
    return (
      <div className="flex gap-4 justify-center my-8">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
            className={cn(
              "w-5 h-5 rounded-full transition-all duration-300",
              (error) ? "bg-rose-500" 
              : (currentInputValue.length > i) ? "bg-[#0cb0e3] scale-110" : "bg-slate-200"
            )}
          />
        ))}
      </div>
    );
  };

  const getTitle = () => {
    if (step === 'login') return 'Nhập mã PIN';
    if (step === 'setup') return 'Tạo mã PIN mới';
    return 'Xác nhận mã PIN';
  };

  const getSubtitle = () => {
    if (error) {
      return step === 'login' ? 'Mã PIN không đúng, thử lại!' : 'Mã PIN không khớp, thử lại!';
    }
    if (step === 'login') return 'Nhập để mở khóa bảo vệ dữ liệu';
    if (step === 'setup') return 'Mã PIN sẽ giúp bảo vệ ứng dụng của bạn';
    return 'Nhập lại mã PIN bạn vừa tạo';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative font-sans">
      <div className="absolute top-12 flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-[#0cb0e3]/10 rounded-full flex items-center justify-center text-[#0cb0e3]">
          <ShieldCheck size={32} />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">{getTitle()}</h1>
          <p className={cn(
            "text-sm mt-2 transition-colors",
            error ? "text-rose-500 font-bold" : "text-slate-500"
          )}>
            {getSubtitle()}
          </p>
        </div>
      </div>

      <div className="w-full max-w-xs mt-32">
        {renderDots()}

        <div className="grid grid-cols-3 gap-y-6 gap-x-6 mt-12">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumber(num.toString())}
              className="w-full aspect-square rounded-full flex items-center justify-center text-3xl font-medium text-slate-700 bg-white shadow-sm hover:bg-slate-100 active:scale-95 transition-all"
            >
              {num}
            </button>
          ))}
          <div className="w-full aspect-square"></div>
          <button
            onClick={() => handleNumber('0')}
            className="w-full aspect-square rounded-full flex items-center justify-center text-3xl font-medium text-slate-700 bg-white shadow-sm hover:bg-slate-100 active:scale-95 transition-all"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="w-full aspect-square rounded-full flex items-center justify-center text-slate-500 hover:bg-rose-50 hover:text-rose-500 active:scale-95 transition-all"
          >
            <Delete size={28} />
          </button>
        </div>
        
        {step === 'login' && (
          <div className="text-center mt-12">
            <button 
              className="text-sm font-bold text-slate-400 hover:text-slate-600 underline"
              onClick={() => {
                alert('Mã PIN đã được lưu trên Google Sheets (Trang tính Settings). Hãy mở file Google Sheets của bạn để xem hoặc xóa mã PIN nhé!');
              }}
            >
              Quên mã PIN?
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
