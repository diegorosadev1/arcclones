/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  User,
  Search,
  Menu,
  X,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useStore } from "../store/useStore";
import { useWishlistStore } from "../store/useWishlistStore";
import { useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-luxury-black text-white">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  const { cart } = useStore();
  const { profile, user, isAdmin, signOut, loading } = useAuth();
  const { wishlist } = useWishlistStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = Boolean(user);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      setIsMobileMenuOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Header logout error:", error);
    }
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Loja", path: "/catalog" },
    { name: "Relógios", path: "/catalog?category=Watches" },
    { name: "Bolsas", path: "/catalog?category=Shoulder Bags" },
    { name: "Acessórios", path: "/catalog?category=Jewelry" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        isScrolled
          ? "bg-luxury-black/90 backdrop-blur-md border-b border-zinc-800"
          : "bg-transparent",
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <button
          className="lg:hidden text-zinc-100"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu size={24} />
        </button>

        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img
            src="/assets/img/logo.png"
            alt="ARC CLONES"
            className="w-auto h-35 object-contain"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive =
              link.path === "/"
                ? location.pathname === "/"
                : location.pathname === link.path.split("?")[0];

            return (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-accent",
                  isActive ? "text-accent" : "text-zinc-400",
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4 sm:gap-6">
          <button className="hidden md:block text-zinc-400 hover:text-accent transition-colors">
            <Search size={20} />
          </button>

          <Link
            to={isAuthenticated ? "/wishlist" : "/login"}
            className="relative text-zinc-400 hover:text-accent transition-colors"
          >
            <Heart size={20} />
            {wishlist.length > 0 && isAuthenticated && (
              <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>

          <Link
            to="/cart"
            className="relative text-zinc-400 hover:text-accent transition-colors"
          >
            <ShoppingCart size={20} />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cart.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            )}
          </Link>

          {loading ? (
            <div className="flex items-center justify-center w-[92px] h-[36px] rounded-full border border-zinc-700 bg-zinc-800/50">
              <Loader2 size={16} className="animate-spin text-accent" />
            </div>
          ) : isAuthenticated ? (
            <div className="flex items-center gap-3">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="hidden sm:flex items-center gap-2 text-accent hover:text-accent/80 transition-colors px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20"
                  title="Painel Administrativo"
                >
                  <ShieldCheck size={18} />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Admin
                  </span>
                </Link>
              )}

              <div className="group relative">
                <Link
                  to="/account"
                  className="flex items-center gap-2 bg-zinc-800/50 hover:bg-zinc-800 px-3 py-1.5 rounded-full transition-all border border-zinc-700 min-w-[92px] justify-center"
                >
                  <User size={18} className="text-accent" />
                  <span className="hidden sm:block text-xs font-medium text-white">
                    {profile?.name?.split(" ")[0] || "Conta"}
                  </span>
                </Link>

                <div className="absolute right-0 mt-2 w-48 bg-luxury-card border border-zinc-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-2">
                    <Link
                      to="/account"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                      <User size={16} /> Minha Conta
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors mt-1"
                    >
                      <LogOut size={16} /> Sair
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Link to="/login" className="btn-primary py-2 px-5 text-sm">
              Entrar
            </Link>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[80%] max-w-xs bg-luxury-black z-[70] p-6 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2"
                >
                  <img
                    src="/assets/img/logo.png"
                    alt="ARC CLONES"
                    className="w-auto h-10 object-contain"
                  />
                </Link>

                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-zinc-400"
                >
                  <X size={24} />
                </button>
              </div>

              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between py-3 border-b border-zinc-800 text-zinc-300 hover:text-accent transition-colors"
                  >
                    {link.name}
                    <ChevronRight size={16} />
                  </Link>
                ))}
              </nav>

              <div className="mt-auto pt-8 space-y-3">
                {loading ? (
                  <div className="flex items-center justify-center w-full h-[44px] rounded-xl border border-zinc-700 bg-zinc-800/50">
                    <Loader2 size={18} className="animate-spin text-accent" />
                  </div>
                ) : isAuthenticated ? (
                  <>
                    <Link
                      to="/account"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="btn-outline w-full"
                    >
                      Minha Conta
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="btn-outline w-full"
                      >
                        Painel Admin
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="btn-primary w-full"
                    >
                      Sair
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="btn-primary w-full"
                  >
                    Entrar na Conta
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-luxury-card border-t border-zinc-800 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/assets/img/logo.png"
              alt="ARC CLONES"
              className="w-auto h-12 object-contain"
            />
          </Link>
          <p className="text-zinc-400 text-sm leading-relaxed">
            A sua boutique especializada em acessórios premium. Qualidade,
            elegância e exclusividade em cada detalhe.
          </p>
          <div className="flex items-center gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-accent transition-colors cursor-pointer"
              >
                <div className="w-4 h-4 bg-zinc-400 rounded-sm" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display font-bold text-lg mb-6">Categorias</h4>
          <ul className="space-y-4">
            <li>
              <Link
                to="/catalog?category=Watches"
                className="text-zinc-400 hover:text-accent text-sm transition-colors"
              >
                Relógios
              </Link>
            </li>
            <li>
              <Link
                to="/catalog?category=Shoulder Bags"
                className="text-zinc-400 hover:text-accent text-sm transition-colors"
              >
                Bolsas
              </Link>
            </li>
            <li>
              <Link
                to="/catalog?category=Glasses"
                className="text-zinc-400 hover:text-accent text-sm transition-colors"
              >
                Óculos
              </Link>
            </li>
            <li>
              <Link
                to="/catalog?category=Jewelry"
                className="text-zinc-400 hover:text-accent text-sm transition-colors"
              >
                Joias
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-bold text-lg mb-6">Institucional</h4>
          <ul className="space-y-4">
            <li>
              <Link
                to="#"
                className="text-zinc-400 hover:text-accent text-sm transition-colors"
              >
                Sobre Nós
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="text-zinc-400 hover:text-accent text-sm transition-colors"
              >
                Política de Privacidade
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="text-zinc-400 hover:text-accent text-sm transition-colors"
              >
                Termos de Uso
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="text-zinc-400 hover:text-accent text-sm transition-colors"
              >
                Trocas e Devoluções
              </Link>
            </li>
            <li>
              <Link
                to="/admin"
                className="text-zinc-400 hover:text-accent text-sm transition-colors"
              >
                Painel Administrativo
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-bold text-lg mb-6">Newsletter</h4>
          <p className="text-zinc-400 text-sm mb-4">
            Receba ofertas exclusivas e novidades em primeira mão.
          </p>
          <form className="space-y-3">
            <input
              type="email"
              placeholder="Seu melhor e-mail"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-full px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
            />
            <button className="btn-primary w-full py-3">Inscrever-se</button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4 text-zinc-500 text-xs">
        <p>© 2026 ARC CLONES. Todos os direitos reservados.</p>
        <div className="flex items-center gap-6">
          <span>Pagamento Seguro:</span>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-8 h-5 bg-zinc-800 rounded" />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}