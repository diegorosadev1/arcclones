/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Github, Chrome, Eye, EyeOff } from 'lucide-react';
import { useStore } from '../store/useStore';
import { motion } from 'motion/react';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { setUser, addNotification } = useStore();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      addNotification('Por favor, preencha todos os campos', 'error');
      return;
    }

    // Simulate register
    setUser({
      id: 'u1',
      name: name,
      email: email,
      addresses: [],
      orders: [],
      wishlist: [],
    });
    
    addNotification('Conta criada com sucesso!', 'success');
    navigate('/account');
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-card p-8 md:p-12 space-y-10"
      >
        <div className="text-center space-y-4">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
              <span className="text-white font-display font-bold text-xl">L</span>
            </div>
            <span className="font-display font-bold text-2xl tracking-tight">ARC CLONES.</span>
          </Link>
          <h1 className="text-3xl font-display font-bold">Crie sua conta</h1>
          <p className="text-zinc-500 text-sm">Junte-se à nossa comunidade exclusiva de luxo.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Nome Completo</label>
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                placeholder="Ex: João Silva"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">E-mail</label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Senha</label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-12 pr-12 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                placeholder="••••••••"
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

          <button type="submit" className="btn-primary w-full py-4 uppercase tracking-widest text-sm font-bold">
            Criar Conta <ArrowRight size={18} />
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-widest">
            <span className="bg-luxury-card px-4 text-zinc-500">Ou cadastre-se com</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="btn-outline py-3 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest">
            <Chrome size={16} /> Google
          </button>
          <button className="btn-outline py-3 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest">
            <Github size={16} /> GitHub
          </button>
        </div>

        <p className="text-center text-sm text-zinc-500">
          Já tem uma conta? <Link to="/login" className="text-accent font-bold hover:underline">Entre agora</Link>
        </p>
      </motion.div>
    </div>
  );
}
