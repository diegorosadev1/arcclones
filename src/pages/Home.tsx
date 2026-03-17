import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Headphones,
  RefreshCw,
  Star,
  Quote,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useProductStore } from '../store/useProductStore';
import { ProductCard } from '../components/ProductCard';
import { motion } from 'motion/react';

export function Home() {
  const { products, isLoading, hasFetched, error, fetchProducts } = useProductStore();
  const fetchInitiated = useRef(false);

  useEffect(() => {
    if (fetchInitiated.current || hasFetched) return;
    fetchInitiated.current = true;
    fetchProducts();
  }, [hasFetched, fetchProducts]);

  const featuredProducts = (products || []).filter((p) => p?.featured).slice(0, 4);
  const bestSellers = (products || []).filter((p) => p?.bestSeller).slice(0, 4);
  const newArrivals = (products || []).filter((p) => p?.newArrival).slice(0, 4);

  if (isLoading && !hasFetched) {
    return (
      <div className="h-screen flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-accent animate-spin" />
        <p className="text-zinc-500 font-display uppercase tracking-widest text-sm">
          Carregando Experiência ARC CLONES...
        </p>
      </div>
    );
  }

  if (error && !hasFetched) {
    return (
      <div className="h-screen flex flex-col items-center justify-center space-y-6 px-6 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 opacity-50" />
        <div className="space-y-2">
          <h2 className="text-2xl font-display font-bold">Ops! Algo deu errado.</h2>
          <p className="text-zinc-500 max-w-md">
            Não conseguimos carregar os produtos. Por favor, verifique sua conexão ou tente novamente mais tarde.
          </p>
        </div>
        <button
          onClick={() => {
            fetchInitiated.current = false;
            fetchProducts(true);
          }}
          className="btn-primary"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }


  return (
    <div className="space-y-24 pb-24">
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1920"
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
              Descubra a nossa curadoria premium de relógios, bolsas e acessórios desenhados para quem não abre mão do estilo e da sofisticação.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/catalog" className="btn-primary text-lg px-8 py-4">
                Ver Catálogo <ArrowRight size={20} />
              </Link>
              <Link to="/catalog?category=Watches" className="btn-outline text-lg px-8 py-4">
                Coleção de Relógios
              </Link>
            </div>

            <div className="flex items-center gap-8 pt-8 border-t border-zinc-800/50">
              <div>
                <p className="text-2xl font-bold text-white">20k+</p>
                <p className="text-zinc-500 text-xs uppercase tracking-wider">Clientes Felizes</p>
              </div>
              <div className="w-px h-10 bg-zinc-800" />
              <div>
                <p className="text-2xl font-bold text-white">500+</p>
                <p className="text-zinc-500 text-xs uppercase tracking-wider">Produtos Premium</p>
              </div>
              <div className="w-px h-10 bg-zinc-800" />
              <div>
                <p className="text-2xl font-bold text-white">4.9/5</p>
                <p className="text-zinc-500 text-xs uppercase tracking-wider">Avaliação Média</p>
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

      <section className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-display font-bold">Nossas Categorias</h2>
          <p className="text-zinc-500 max-w-2xl mx-auto">Explore o melhor do luxo em cada segmento.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              name: 'Relógios',
              img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
              path: '/catalog?category=Watches',
            },
            {
              name: 'Bolsas',
              img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800',
              path: '/catalog?category=Shoulder Bags',
            },
            {
              name: 'Óculos',
              img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800',
              path: '/catalog?category=Glasses',
            },
            {
              name: 'Joias',
              img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800',
              path: '/catalog?category=Jewelry',
            },
          ].map((cat, i) => (
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
                  <h3 className="text-2xl font-display font-bold text-white mb-2">{cat.name}</h3>
                  <span className="text-accent text-sm font-bold flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    Explorar <ArrowRight size={16} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-display font-bold">Destaques da Semana</h2>
            <p className="text-zinc-500">Os itens mais desejados da nossa coleção.</p>
          </div>
          <Link to="/catalog" className="btn-outline">
            Ver Todos os Produtos
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="bg-luxury-card py-24 border-y border-zinc-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-display font-bold">A Experiência ARC CLONES</h2>
            <p className="text-zinc-500">Por que somos a escolha número um em acessórios de luxo.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <ShieldCheck size={32} />,
                title: 'Autenticidade Garantida',
                desc: 'Todos os nossos produtos passam por um rigoroso processo de verificação de originalidade.',
              },
              {
                icon: <Zap size={32} />,
                title: 'Entrega Expressa',
                desc: 'Receba seus itens com rapidez e segurança em qualquer lugar do Brasil.',
              },
              {
                icon: <Headphones size={32} />,
                title: 'Suporte VIP 24/7',
                desc: 'Nossa equipe dedicada está sempre pronta para atender você com exclusividade.',
              },
              {
                icon: <RefreshCw size={32} />,
                title: 'Troca Facilitada',
                desc: 'Não serviu ou não gostou? Você tem até 30 dias para realizar a troca sem burocracia.',
              },
              {
                icon: <Star size={32} />,
                title: 'Curadoria Premium',
                desc: 'Apenas as marcas mais prestigiadas e os modelos mais exclusivos do mercado.',
              },
              {
                icon: <Quote size={32} />,
                title: 'Comunidade Exclusiva',
                desc: 'Faça parte do nosso clube de vantagens e receba convites para eventos privados.',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-accent/50 transition-all duration-300 group"
              >
                <div className="text-accent mb-6 transform transition-transform group-hover:scale-110 duration-300">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold mb-4">{feature.title}</h4>
                <p className="text-zinc-400 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-12">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-display font-bold">Mais Vendidos</h2>
            <Link to="/catalog" className="text-accent text-sm font-bold hover:underline">
              Ver Mais
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        <div className="space-y-12">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-display font-bold">Lançamentos</h2>
            <Link to="/catalog" className="text-accent text-sm font-bold hover:underline">
              Ver Mais
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-display font-bold">O Que Dizem Nossos Clientes</h2>
          <p className="text-zinc-500">A satisfação de quem já viveu a experiência ARC CLONES.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: 'Ricardo Santos',
              role: 'Colecionador',
              text: 'A qualidade dos relógios é simplesmente impecável. O atendimento VIP fez toda a diferença na minha escolha.',
            },
            {
              name: 'Mariana Lima',
              role: 'Fashion Blogger',
              text: 'Minha bolsa favorita veio daqui. O acabamento é superior a qualquer outra loja que já comprei no Brasil.',
            },
            {
              name: 'Carlos Eduardo',
              role: 'Empresário',
              text: 'Entrega extremamente rápida e produto muito bem embalado. Transmite confiança desde o primeiro clique.',
            },
          ].map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-zinc-900/30 border border-zinc-800 relative"
            >
              <Quote className="absolute top-6 right-8 text-accent/10" size={64} />
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={14} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-zinc-300 italic mb-8 relative z-10">"{t.text}"</p>
              <div>
                <p className="font-bold text-white">{t.name}</p>
                <p className="text-zinc-500 text-xs uppercase tracking-wider">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}