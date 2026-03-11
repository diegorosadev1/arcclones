import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { homeCategories } from "../../../data/home";

export function CategoriesSection() {
  return (
    <section className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-3xl md:text-5xl font-display font-bold">
          Nossas Categorias
        </h2>
        <p className="text-zinc-500 max-w-2xl mx-auto">
          Explore o melhor do luxo em cada segmento.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {homeCategories.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="relative group h-80 rounded-2xl overflow-hidden cursor-pointer"
          >
            <Link to={cat.path}>
              <img
                src={cat.img}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <h3 className="text-2xl font-display font-bold text-white mb-2">
                  {cat.name}
                </h3>
                <span className="text-accent text-sm font-bold flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  Explorar <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}