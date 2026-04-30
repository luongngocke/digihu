import React, { useState, useEffect } from 'react';
import { X, User as UserIcon, Image, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { api } from '../services/api';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  avatar: string;
  onUpdate: (userName: string, avatar: string) => void;
}

export default function ProfileModal({ isOpen, onClose, userName, avatar, onUpdate }: ProfileModalProps) {
  const [name, setName] = useState(userName);
  const [img, setImg] = useState(avatar);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setName(userName);
    setImg(avatar);
  }, [userName, avatar, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (name !== userName) {
        await api.updateSetting('userName', name);
      }
      if (img !== avatar) {
        await api.updateSetting('avatar', img);
      }
      onUpdate(name, img);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Lỗi lưu thông tin');
    } finally {
      setIsLoading(false);
    }
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
          className="relative bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden p-8"
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Hồ sơ</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-2xl transition-colors">
              <X size={24} className="text-slate-400" />
            </button>
          </div>

          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-100 bg-slate-100 flex items-center justify-center">
              {img ? (
                <img src={img} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <UserIcon size={40} className="text-slate-400" />
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Tên hiển thị</label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nhập tên của bạn"
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-[#0cb0e3] focus:bg-white rounded-2xl p-4 text-sm font-bold outline-none transition-all pl-12"
                />
                <UserIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Liên kết ảnh đại diện</label>
              <div className="relative">
                <input
                  type="text"
                  value={img}
                  onChange={(e) => setImg(e.target.value)}
                  placeholder="URL hình ảnh (https://...)"
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-[#0cb0e3] focus:bg-white rounded-2xl p-4 text-sm font-bold outline-none transition-all pl-12"
                />
                <Image size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full py-4 rounded-2xl text-white font-black text-lg transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-2",
                isLoading ? "bg-slate-400" : "bg-[#0cb0e3] shadow-[#0cb0e3]/20"
              )}
            >
              <Save size={20} />
              {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
