import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  User,
  Search,
  Menu,
  X,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useStore } from "../../store/useStore";
import { useWishlistStore } from "../../store/useWishlistStore";
import { useAuth } from "../../auth/useAuth";
import { cn } from "./utils";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Loja", path: "/catalog" },
  { name: "Relógios", path: "/catalog?category=Watches" },
  { name: "Bolsas", path: "/catalog?category=Shoulder Bags" },
  { name: "Acessórios", path: "/catalog?category=Jewelry" },
];

export function Header() {
  const { cart } = useStore();
  const { wishlist } = useWishlistStore();
  const { user, logout } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  const cartItemsCount = useMemo(
    () => cart.reduce((acc, item) => acc + item.quantity, 0),
    [cart],
  );

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const isActiveLink = (path: string) => {
    const current = location.pathname + location.search;
    return current === path;
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        isScrolled
          ? "bg-luxury-black/900 backdrop-blur-md border-b border-zinc-800"
          : "bg-transparent",
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <button
          type="button"
          className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-900/80 border border-zinc-700 shadow-lg text-zinc-100 hover:shadow-xl hover:-translate-y-0.5 transition-all"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Abrir menu"
        >
          <Menu size={24} />
        </button>

        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img
            src="/assets/img/arcclones-logo.png"
            alt="Arc Clones Logo"
            className="h-20 w-auto"
          />
        </Link>

        <DesktopNav currentPath={location.pathname + location.search} />

        <div className="flex items-center gap-4 sm:gap-6">
          <button
            type="button"
            className="hidden md:block text-zinc-400 hover:text-accent transition-colors"
            aria-label="Buscar"
          >
            <Search size={20} />
          </button>

          <IconLink
            to="/wishlist"
            icon={<Heart size={20} />}
            badgeCount={wishlist.length}
            label="Lista de desejos"
          />

          <IconLink
            to="/cart"
            icon={<ShoppingCart size={20} />}
            badgeCount={cartItemsCount}
            label="Carrinho"
          />

          {user ? (
            <UserMenu userName={user.name} onLogout={handleLogout} />
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

            <motion.aside
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
                  <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                    <span className="text-white font-display font-bold text-lg">
                      L
                    </span>
                  </div>
                  <span className="font-display font-bold text-xl">
                    ARC CLONES.
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-zinc-400"
                  aria-label="Fechar menu"
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
                    className={cn(
                      "flex items-center justify-between py-3 border-b transition-colors",
                      isActiveLink(link.path)
                        ? "text-accent border-accent/30"
                        : "border-zinc-800 text-zinc-300 hover:text-accent",
                    )}
                  >
                    {link.name}
                    <ChevronRight size={16} />
                  </Link>
                ))}
              </nav>

              <div className="mt-auto pt-8">
                {!user && (
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="btn-primary w-full"
                  >
                    Entrar na Conta
                  </Link>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

function DesktopNav({ currentPath }: { currentPath: string }) {
  return (
    <nav className="hidden lg:flex items-center gap-8">
      {navLinks.map((link) => {
        const active = currentPath === link.path;

        return (
          <Link
            key={link.name}
            to={link.path}
            className={cn(
              "text-sm font-medium transition-colors hover:text-accent",
              active ? "text-accent" : "text-zinc-400",
            )}
          >
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
}

function IconLink({
  to,
  icon,
  badgeCount,
  label,
}: {
  to: string;
  icon: ReactNode;
  badgeCount?: number;
  label: string;
}) {
  return (
    <Link
      to={to}
      aria-label={label}
      className="relative text-zinc-400 hover:text-accent transition-colors"
    >
      {icon}

      {!!badgeCount && badgeCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
          {badgeCount}
        </span>
      )}
    </Link>
  );
}

function UserMenu({
  userName,
  onLogout,
}: {
  userName: string;
  onLogout: () => void | Promise<void>;
}) {
  return (
    <div className="group relative">
      <Link
        to="/account"
        className="flex items-center gap-2 bg-zinc-800/50 hover:bg-zinc-800 px-3 py-1.5 rounded-full transition-all border border-zinc-700"
      >
        <User size={18} className="text-accent" />
        <span className="hidden sm:block text-xs font-medium">
          {userName.split(" ")[0]}
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
            type="button"
            onClick={() => void onLogout()}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors mt-1"
          >
            <LogOut size={16} /> Sair
          </button>
        </div>
      </div>
    </div>
  );
}
