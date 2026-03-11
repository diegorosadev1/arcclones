import { motion } from "motion/react";
import { homeFeatures } from "../../../data/home";

export function BenefitsSection() {
  return (
    <section className="bg-luxury-card py-24 border-y border-zinc-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-display font-bold">
            A Experiência LUXE
          </h2>
          <p className="text-zinc-500">
            Por que somos a escolha número um em acessórios de luxo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {homeFeatures.map((feature, i) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-accent/50 transition-all duration-300 group"
              >
                <div className="text-accent mb-6 transform transition-transform group-hover:scale-110 duration-300">
                  <Icon size={32} />
                </div>

                <h4 className="text-xl font-bold mb-4">{feature.title}</h4>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}