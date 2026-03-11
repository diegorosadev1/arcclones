import {
  ShieldCheck,
  Zap,
  Headphones,
  RefreshCw,
  Star,
  Quote,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type HomeCategory = {
  name: string;
  img: string;
  path: string;
};

export type HomeFeature = {
  icon: LucideIcon;
  title: string;
  desc: string;
};

export type HomeTestimonial = {
  name: string;
  role: string;
  text: string;
};

export const homeCategories: HomeCategory[] = [
  {
    name: "Relógios",
    img: "https://images.unsplash.com/photo-1734776576464-30551c357fd6?q=80&w=1372&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    path: "/catalog?category=Watches",
  },
  {
    name: "Bolsas",
    img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800",
    path: "/catalog?category=Shoulder Bags",
  },
  {
    name: "Óculos",
    img: "https://images.unsplash.com/photo-1654257650833-b7398115275a?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8JUMzJUIzY3Vsb3MlMjBwcmV0b3N8ZW58MHx8MHx8fDA%3D",
    path: "/catalog?category=Glasses",
  },
  {
    name: "Joias",
    img: "https://images.unsplash.com/photo-1721807550979-6e662d370e92?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    path: "/catalog?category=Jewelry",
  },
];

export const homeFeatures: HomeFeature[] = [
  {
    icon: ShieldCheck,
    title: "Autenticidade Garantida",
    desc: "Todos os nossos produtos passam por um rigoroso processo de verificação de originalidade.",
  },
  {
    icon: Zap,
    title: "Entrega Expressa",
    desc: "Receba seus itens com rapidez e segurança em qualquer lugar do Brasil.",
  },
  {
    icon: Headphones,
    title: "Suporte VIP 24/7",
    desc: "Nossa equipe dedicada está sempre pronta para atender você com exclusividade.",
  },
  {
    icon: RefreshCw,
    title: "Troca Facilitada",
    desc: "Não serviu ou não gostou? Você tem até 30 dias para realizar a troca sem burocracia.",
  },
  {
    icon: Star,
    title: "Curadoria Premium",
    desc: "Apenas as marcas mais prestigiadas e os modelos mais exclusivos do mercado.",
  },
  {
    icon: Quote,
    title: "Comunidade Exclusiva",
    desc: "Faça parte do nosso clube de vantagens e receba convites para eventos privados.",
  },
];

export const homeTestimonials: HomeTestimonial[] = [
  {
    name: "Ricardo Santos",
    role: "Colecionador",
    text: "A qualidade dos relógios é simplesmente impecável. O atendimento VIP fez toda a diferença na minha escolha.",
  },
  {
    name: "Mariana Lima",
    role: "Fashion Blogger",
    text: "Minha bolsa favorita veio daqui. O acabamento é superior a qualquer outra loja que já comprei no Brasil.",
  },
  {
    name: "Carlos Eduardo",
    role: "Empresário",
    text: "Entrega extremamente rápida e produto muito bem embalado. Transmite confiança desde o primeiro clique.",
  },
];