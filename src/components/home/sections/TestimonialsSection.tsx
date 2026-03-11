import { motion } from "motion/react";
import { Quote, Star } from "lucide-react";
import { homeTestimonials } from "../../../data/home";

export function TestimonialsSection() {
  return (
    <section className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-3xl md:text-5xl font-display font-bold">
          O Que Dizem Nossos Clientes
        </h2>
        <p className="text-zinc-500">
          A satisfação de quem já viveu a experiência LUXE.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {homeTestimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-2xl bg-zinc-900/30 border border-zinc-800 relative"
          >
            <Quote
              className="absolute top-6 right-8 text-accent/10"
              size={64}
            />

            <div className="flex gap-1 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={14}
                  className="text-amber-400 fill-amber-400"
                />
              ))}
            </div>

            <p className="text-zinc-300 italic mb-8 relative z-10">
              "{t.text}"
            </p>

            <div>
              <p className="font-bold text-white">{t.name}</p>
              <p className="text-zinc-500 text-xs uppercase tracking-wider">
                {t.role}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}