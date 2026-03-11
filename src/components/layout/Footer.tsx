import { Link } from "react-router-dom";

const categoryLinks = [
  { name: "Relógios", path: "/catalog?category=Watches" },
  { name: "Bolsas", path: "/catalog?category=Shoulder Bags" },
  { name: "Óculos", path: "/catalog?category=Glasses" },
  { name: "Joias", path: "/catalog?category=Jewelry" },
];

const institutionalLinks = [
  { name: "Sobre Nós", path: "#" },
  { name: "Política de Privacidade", path: "#" },
  { name: "Termos de Uso", path: "#" },
  { name: "Trocas e Devoluções", path: "#" },
  { name: "Painel Administrativo", path: "/admin" },
];

export function Footer() {
  return (
    <footer className="bg-luxury-card border-t border-zinc-800 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/assets/img/arcclones-logo.png"
              alt="Arc Clones Logo"
              className="h-24 w-auto"
            />
          </Link>

          <p className="text-zinc-400 text-sm leading-relaxed">
            A sua boutique de luxo especializada em acessórios premium.
            Qualidade, elegância e exclusividade em cada detalhe.
          </p>

          <div className="flex items-center gap-4">
            {[1, 2, 3, 4].map((i) => (
              <button
                key={i}
                type="button"
                className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-accent transition-colors"
                aria-label={`Rede social ${i}`}
              >
                <div className="w-4 h-4 bg-zinc-400 rounded-sm" />
              </button>
            ))}
          </div>
        </div>

        <FooterLinkSection title="Categorias" links={categoryLinks} />
        <FooterLinkSection title="Institucional" links={institutionalLinks} />

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
            <button type="submit" className="btn-primary w-full py-3">
              Inscrever-se
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4 text-zinc-500 text-xs">
        <p>© 2026 ARC CLONES STORE. Todos os direitos reservados.</p>

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

function FooterLinkSection({
  title,
  links,
}: {
  title: string;
  links: { name: string; path: string }[];
}) {
  return (
    <div>
      <h4 className="font-display font-bold text-lg mb-6">{title}</h4>

      <ul className="space-y-4">
        {links.map((link) => (
          <li key={link.name}>
            <Link
              to={link.path}
              className="text-zinc-400 hover:text-accent text-sm transition-colors"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}