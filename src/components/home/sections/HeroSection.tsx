import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Hero Background"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-luxury-black via-luxury-black/60 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl space-y-8"
        >
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 px-4 py-2 rounded-full">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span className="text-accent text-xs font-bold uppercase tracking-widest">
              Coleção Exclusiva 2026
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight">
            Elegância que <br />
            <span className="text-accent">Define Você.</span>
          </h1>

          <p className="text-zinc-400 text-lg md:text-xl leading-relaxed max-w-lg">
            Descubra a nossa curadoria premium de relógios, bolsas e acessórios
            desenhados para quem não abre mão do estilo e da sofisticação.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link to="/catalog" className="btn-primary text-lg px-8 py-4">
              Ver Catálogo <ArrowRight size={20} />
            </Link>

            <Link
              to="/catalog?category=Watches"
              className="btn-outline text-lg px-8 py-4"
            >
              Coleção de Relógios
            </Link>
          </div>

          <div className="flex items-center gap-8 pt-8 border-t border-zinc-800/50">
            <div>
              <p className="text-2xl font-bold text-white">20k+</p>
              <p className="text-zinc-500 text-xs uppercase tracking-wider">
                Clientes Felizes
              </p>
            </div>

            <div className="w-px h-10 bg-zinc-800" />

            <div>
              <p className="text-2xl font-bold text-white">500+</p>
              <p className="text-zinc-500 text-xs uppercase tracking-wider">
                Produtos Premium
              </p>
            </div>

            <div className="w-px h-10 bg-zinc-800" />

            <div>
              <p className="text-2xl font-bold text-white">4.9/5</p>
              <p className="text-zinc-500 text-xs uppercase tracking-wider">
                Avaliação Média
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-zinc-500"
      >
        <div className="w-6 h-10 border-2 border-zinc-700 rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-accent rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}