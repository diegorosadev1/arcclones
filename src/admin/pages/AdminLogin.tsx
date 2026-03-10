/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAdminAuthStore } from '../stores/useAdminAuthStore';
import { motion } from 'motion/react';

export function AdminLogin() {
  const [email, setEmail] = useState('admin@luxe.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, isAuthenticated } = useAdminAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erro ao realizar login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-luxury-black flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-card p-8 md:p-12 space-y-10 relative z-10"
      >
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(225,29,72,0.3)]">
              <span className="text-white font-display font-bold text-2xl">L</span>
            </div>
            <div className="text-left">
              <span className="font-display font-bold text-2xl tracking-tight block">LUXE.</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Painel Administrativo</span>
            </div>
          </div>
          <h1 className="text-3xl font-display font-bold">Acesso Restrito</h1>
          <p className="text-zinc-500 text-sm">Entre com suas credenciais de administrador.</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500 text-sm"
          >
            <AlertCircle size={18} />
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">E-mail Corporativo</label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-accent transition-colors text-white"
                placeholder="admin@luxe.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Senha de Acesso</label>
            </div>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-12 pr-12 py-4 text-sm focus:outline-none focus:border-accent transition-colors text-white"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="btn-primary w-full py-5 uppercase tracking-widest text-sm font-bold flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>Entrar no Painel <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        <div className="pt-6 border-t border-zinc-800 text-center">
          <Link to="/" className="text-xs text-zinc-500 hover:text-white transition-colors flex items-center justify-center gap-2">
            <ShieldCheck size={14} /> Voltar para a Loja Pública
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
