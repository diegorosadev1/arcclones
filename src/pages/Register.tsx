/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Github,
  Chrome,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useStore } from "../store/useStore";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { motion } from "motion/react";

export function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addNotification } = useStore();
  const { user, profile, isAdmin, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user && profile) {
      navigate(isAdmin ? "/admin" : "/", { replace: true });
    }
  }, [user, profile, isAdmin, authLoading, navigate]);

  if (user && !profile && !authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-luxury-black px-6">
        <div className="w-full max-w-md glass-card p-8 text-center space-y-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto opacity-50" />
          <div className="space-y-2">
            <h2 className="text-2xl font-display font-bold">Sessão Ativa</h2>
            <p className="text-zinc-500">
              Você já está autenticado, mas não conseguimos carregar seu perfil.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <Link to="/account" className="btn-primary py-3">
              Ir para Minha Conta
            </Link>
            <button onClick={() => signOut()} className="btn-outline py-3">
              Sair para Criar Outra Conta
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      addNotification("Por favor, preencha todos os campos", "error");
      return;
    }

    if (password.length < 6) {
      addNotification("A senha deve ter pelo menos 6 caracteres", "error");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (authError) {
        if (authError.message.includes("User already registered")) {
          throw new Error("Este e-mail já está cadastrado.");
        }
        throw authError;
      }

      if (data.user) {
        // Create profile record
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            id: data.user.id,
            name,
            email,
            role: "customer",
          },
        ]);

        if (profileError) {
          console.error("Profile creation error:", profileError);
        }

        addNotification(
          "Conta criada com sucesso! Por favor, faça login.",
          "success",
        );
        navigate("/login");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      addNotification(error.message || "Erro ao criar conta", "error");
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-luxury-black">
        <Loader2 className="w-12 h-12 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-card p-8 md:p-12 space-y-10"
      >
        <div className="text-center space-y-4">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/assets/img/logo.png"
              alt="ARC CLONES"
              className="w-auto h-50 object-contain"
            />
          </Link>
          <h1 className="text-3xl font-display font-bold">Crie sua conta</h1>
          <p className="text-zinc-500 text-sm">
            Junte-se à nossa comunidade exclusiva de luxo.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
              Nome Completo
            </label>
            <div className="relative">
              <User
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
              />
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
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
              E-mail
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
              />
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
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
              Senha
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
              />
              <input
                type={showPassword ? "text" : "password"}
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

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-4 uppercase tracking-widest text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin mx-auto" />
            ) : (
              <>
                Criar Conta <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-widest">
            <span className="bg-luxury-card px-4 text-zinc-500">
              Ou cadastre-se com
            </span>
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
          Já tem uma conta?{" "}
          <Link to="/login" className="text-accent font-bold hover:underline">
            Entre agora
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
