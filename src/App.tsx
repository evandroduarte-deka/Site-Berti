/// <reference types="vite/client" />
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Routes, Route, Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Ruler, 
  Hammer, 
  ChevronRight, 
  Star, 
  Lock, 
  Plus, 
  Trash2, 
  LogOut, 
  ArrowLeft,
  X,
  Phone,
  Mail,
  Menu,
  Instagram,
  Facebook,
  ShieldCheck,
  MessageSquare,
  ArrowUpRight,
  PlusCircle,
  LayoutGrid,
  Image as ImageIcon
} from 'lucide-react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  setDoc,
  doc, 
  Timestamp,
  getDoc,
  limit
} from 'firebase/firestore';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  User 
} from 'firebase/auth';
import { db, auth } from './lib/firebase';
import { Project, Testimonial, SiteConfig } from './types';

// --- Shared Internal Components ---

const Navbar = ({ onAdminClick }: { onAdminClick: () => void }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleHomeClick = () => {
    if (pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  const navLinks = [
    { name: 'A Empresa', path: '/' },
    { name: 'Jornada do Cliente', path: '/jornada' },
    { name: 'Portfólio', path: '/portfolio' },
  ];

  const handleLinkClick = (path: string) => {
    setIsMobileMenuOpen(false);
    if (path === pathname) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-2xl h-20 flex items-center justify-between px-6 md:px-16 border-b border-gray-100/50">
        <div 
          className="font-display text-2xl font-extrabold cursor-pointer tracking-tighter"
          onClick={handleHomeClick}
        >
          Berti<span className="text-berti-gold">.</span>
        </div>

        <div className="flex items-center gap-4 md:gap-12">
          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-[11px] font-bold uppercase tracking-[0.2em] hover:text-berti-gold transition-all duration-500 cursor-pointer relative group"
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 h-[1px] bg-berti-gold transition-all duration-500 ${pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </Link>
            ))}
            <button 
              onClick={() => {
                document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' });
              }} 
              className="text-[11px] font-bold uppercase tracking-[0.2em] hover:text-berti-gold transition-all duration-500 cursor-pointer relative group"
            >
              Contato
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-berti-gold transition-all duration-500 group-hover:w-full" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={onAdminClick}
              className="px-4 md:px-8 py-3 bg-berti-dark text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-berti-sage transition-all flex items-center gap-3 shadow-lg shadow-berti-dark/5"
            >
              <Lock size={12} className="text-berti-gold" /> <span className="hidden sm:inline">Portal do Cliente</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-berti-ink hover:text-berti-gold transition-colors"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-white lg:hidden"
          >
            <div className="flex flex-col h-full">
              <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100">
                <div className="font-display text-2xl font-extrabold tracking-tighter">
                  Berti<span className="text-berti-gold">.</span>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-berti-ink hover:text-berti-gold transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center gap-8 p-12">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => handleLinkClick(link.path)}
                    className={`text-2xl font-display font-medium tracking-tight hover:text-berti-gold transition-colors ${pathname === link.path ? 'text-berti-gold' : 'text-berti-ink'}`}
                  >
                    {link.name}
                  </Link>
                ))}
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' });
                  }} 
                  className="text-2xl font-display font-medium tracking-tight text-berti-ink hover:text-berti-gold transition-colors"
                >
                  Contato
                </button>
              </div>

              <div className="p-12 border-t border-gray-100 flex flex-col items-center gap-6">
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onAdminClick();
                  }}
                  className="w-full py-5 bg-berti-dark text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-berti-sage transition-all flex items-center justify-center gap-3"
                >
                  <Lock size={12} className="text-berti-gold" /> Portal do Cliente
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const WhatsAppButton = () => (
  <motion.a
    href={`https://wa.me/5541991836651`}
    target="_blank"
    rel="noopener noreferrer"
    initial={{ opacity: 0, scale: 0.5, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ delay: 1, duration: 0.5 }}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    className="fixed bottom-8 right-8 z-[60] bg-[#25D366] text-white p-4 rounded-full shadow-[0_20px_50px_rgba(37,211,102,0.3)] flex items-center justify-center hover:bg-[#128C7E] transition-all duration-300 group"
    aria-label="Contato via WhatsApp"
  >
    <div className="absolute right-full mr-4 bg-white text-berti-ink text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2 rounded shadow-xl opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap border border-gray-100">
      Falar conosco
    </div>
    <MessageSquare size={24} fill="currentColor" className="text-white/20" />
    <div className="absolute inset-0 rounded-full border border-white animate-ping opacity-20 group-hover:hidden" />
  </motion.a>
);

const ParallaxImage = ({ src, alt, className }: { src: string; alt: string; className: string }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.1, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.9, 1, 1, 0.9]);

  return (
    <div ref={ref} className="relative w-full h-full overflow-hidden bg-gray-100">
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        style={{ y, scale, opacity }}
        className={`${className} absolute inset-0 contrast-110 saturate-110`}
      />
    </div>
  );
};

const HeroBackground = ({ src, alt }: { src: string; alt: string }) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 200]);

  return (
    <motion.img 
      initial={{ scale: 1.1, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 2, ease: "easeOut" }}
      src={src}
      loading="lazy"
      style={{ y }}
      className="w-full h-full object-cover saturate-110 contrast-105"
      alt={alt}
    />
  );
};

const LoadingSpinner = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex items-center justify-center py-24 w-full"
  >
    <div className="w-6 h-6 border-2 border-berti-ink/5 border-t-berti-gold rounded-full animate-spin" />
  </motion.div>
);

const ConceptGallery = ({ photos }: { photos: string[] }) => {
  if (!photos || photos.length === 0) return null;

  return (
    <div className="w-full relative py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16">
        <div className="text-berti-gold text-[10px] font-bold uppercase tracking-[0.5em] mb-4">Galeria Conceito</div>
        <h3 className="text-4xl md:text-5xl font-display italic text-berti-ink">Da fundação ao acabamento.</h3>
      </div>
      
      <div className="flex overflow-x-auto pb-12 gap-6 px-6 md:px-12 no-scrollbar cursor-grab active:cursor-grabbing snap-x">
        {photos.map((src, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.02 }}
            className="flex-none w-[300px] md:w-[450px] aspect-[4/3] bg-gray-50 overflow-hidden shadow-lg snap-center"
          >
            <img src={src} alt={`Conceito Berti ${i + 1}`} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" loading="lazy" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const Footer = ({ onHome }: { onHome: (s: any) => void }) => (
  <footer id="footer" className="bg-berti-dark text-white pt-24 pb-12 px-6 md:px-12 border-t border-white/10">
    <div className="max-w-7xl mx-auto mb-20">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-24">
        <div className="md:col-span-4 space-y-10">
          <Link to="/" className="font-display text-4xl font-extrabold tracking-tighter block">
            Berti<span className="text-berti-gold">.</span>
          </Link>
          <p className="text-white/70 text-base leading-relaxed font-light max-w-xs">
            Gestão e execução de obras de alto padrão com organização, clareza técnica e controle absoluto.
          </p>
        </div>

        <div className="md:col-span-2 space-y-10">
          <h4 className="text-berti-gold text-[10px] font-bold uppercase tracking-widest">Navegação</h4>
          <div className="flex flex-col gap-5 text-sm font-light text-white/50">
            <Link to="/" className="hover:text-berti-gold transition-colors text-left">Início</Link>
            <Link to="/jornada" className="hover:text-berti-gold transition-colors text-left">Jornada do Cliente</Link>
            <Link to="/portfolio" className="hover:text-berti-gold transition-colors text-left">Portfólio</Link>
            <button onClick={() => document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-berti-gold transition-colors text-left">Contato</button>
          </div>
        </div>
        
        <div className="md:col-span-3 space-y-10">
          <h4 className="text-berti-gold text-[10px] font-bold uppercase tracking-widest">Contato</h4>
          <div className="space-y-6">
            <div className="flex items-center gap-4 text-white/80 hover:text-white transition-colors cursor-pointer group" onClick={() => window.location.href=`https://wa.me/5541991836651`}>
              <MessageSquare size={16} className="text-berti-gold" />
              <span className="text-sm font-medium tracking-tight">(41) 99183-6651</span>
            </div>
            <div className="flex items-center gap-4 text-white/80 hover:text-white transition-colors group">
              <Mail size={16} className="text-berti-gold" />
              <span className="text-sm font-medium tracking-tight text-xs lg:text-sm">berti@curitibaconstrutora.com.br</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-3 space-y-10">
          <h4 className="text-berti-gold text-[10px] font-bold uppercase tracking-widest">Digital</h4>
          <div className="flex gap-6">
            <a href="https://instagram.com/bertiengenharia" target="_blank" rel="noreferrer" className="p-3 border border-white/10 text-white/30 hover:text-berti-gold hover:border-berti-gold transition-all duration-500">
               <Instagram size={20} />
            </a>
          </div>
        </div>
      </div>
    </div>
    
    <div className="max-w-7xl mx-auto pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 text-white/40 text-[9px] uppercase tracking-[0.2em] font-medium">
      <div className="space-y-3">
        <div className="text-white/60 font-bold tracking-[0.3em]">BERTI CONSTRUTORA LTDA</div>
        <div className="flex flex-col gap-1">
          <div>CNPJ: 59.622.624/0001-93</div>
          <div className="text-[10px] normal-case tracking-normal text-white/50">Rua Mateus Leme, 1970 — Centro Cívico</div>
          <div className="text-[10px] normal-case tracking-normal text-white/50">Curitiba/PR — CEP 80.530-010</div>
        </div>
      </div>
      <div className="flex flex-col md:items-end gap-2 text-right">
        <div className="flex gap-8">
           <span>Curitiba | Paraná</span>
        </div>
        <div className="opacity-50 text-[8px] mt-2">© {new Date().getFullYear()} Todos os direitos reservados.</div>
      </div>
    </div>
  </footer>
);

// --- Page Components ---

const InstitutionalLanding = ({ sections, projects, onProjectClick, testimonials, loading, concepts }: any) => {
  return (
    <div className="bg-berti-light text-berti-ink">
      {/* 1. Hero Section - Alto Padrão + Técnica */}
      <section ref={sections.hero} className="relative h-[98vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <HeroBackground 
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop" 
            alt="Arquitetura de Alto Padrão Berti" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-berti-ink/80 via-berti-ink/20 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-7xl w-full px-6 md:px-12 flex flex-col items-center text-center">
          <div className="max-w-5xl flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-berti-gold text-[10px] font-bold uppercase tracking-[0.5em] mb-10 flex items-center gap-4 justify-center"
            >
              <span className="w-8 md:w-12 h-px bg-berti-gold/40"></span>
              CURADORIA TÉCNICA PARA OBRAS DE ALTO PADRÃO
              <span className="w-8 md:w-12 h-px bg-berti-gold/40"></span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-6xl md:text-[8rem] lg:text-[10rem] leading-[0.85] tracking-tightest mb-12 font-black text-white uppercase italic"
            >
              Menos<br />
              improviso.<br />
              Mais<br />
              controle.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-lg md:text-xl text-white/70 max-w-2xl mb-16 font-light leading-relaxed mx-auto"
            >
              A Berti conduz obras residenciais e comerciais com leitura técnica, planejamento estruturado e execução organizada. Transformamos complexidade em previsibilidade.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <button 
                onClick={() => window.location.href = `https://wa.me/5541991836651`}
                className="px-12 py-5 bg-berti-gold text-white font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-white hover:text-berti-ink transition-all duration-500 shadow-2xl"
              >
                FALAR NO WHATSAPP
              </button>
              <Link
                to="/portfolio"
                className="px-12 py-5 border border-white/30 text-white font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-white hover:text-berti-ink transition-all duration-500 flex items-center justify-center gap-3"
              >
                VER PORTFÓLIO <span className="ml-2">›</span>
              </Link>
            </motion.div>
          </div>
        </div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-30 text-white flex flex-col items-center gap-4 cursor-pointer"
        >
          <div className="text-[9px] uppercase tracking-[0.4em] font-bold">INÍCIO</div>
          <div className="w-[1px] h-16 bg-white" />
        </motion.div>
      </section>

      {/* 2. Faixa de Credibilidade */}
      <section className="bg-berti-dark py-20 border-y border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_var(--color-berti-gold)_0%,_transparent_25%)] opacity-[0.03]"></div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
            <div className="border-l-0 border-white/10 px-4 sm:px-0">
              <div className="text-berti-gold text-[10px] font-bold uppercase tracking-[0.4em] mb-4 opacity-70">Expertise de Mercado</div>
              <div className="text-white font-display text-2xl tracking-tighter font-extrabold flex items-baseline gap-2">
                +14 <span className="text-sm font-light text-white/40 uppercase tracking-widest">Anos</span>
              </div>
              <div className="text-white/30 text-[9px] uppercase tracking-widest mt-2 font-medium">Desde 2012 em Curitiba</div>
            </div>
            <div className="lg:border-l lg:pl-12 border-white/10">
              <div className="text-berti-gold text-[10px] font-bold uppercase tracking-[0.4em] mb-4 opacity-70">Volume Executado</div>
              <div className="text-white font-display text-2xl tracking-tighter font-extrabold flex items-baseline gap-2">
                20 <span className="text-sm font-light text-white/40 uppercase tracking-widest">Mil m²</span>
              </div>
              <div className="text-white/30 text-[9px] uppercase tracking-widest mt-2 font-medium">De obras concluídas</div>
            </div>
            <div className="lg:border-l lg:pl-12 border-white/10">
              <div className="text-berti-gold text-[10px] font-bold uppercase tracking-[0.4em] mb-4 opacity-70">Curadoria Técnica</div>
              <div className="text-white font-display text-2xl tracking-tighter font-extrabold uppercase">Precisão</div>
              <div className="text-white/30 text-[9px] uppercase tracking-widest mt-2 font-medium">Inteligência Construtiva</div>
            </div>
            <div className="lg:border-l lg:pl-12 border-white/10">
              <div className="text-berti-gold text-[10px] font-bold uppercase tracking-[0.4em] mb-4 opacity-70">Abrangência</div>
              <div className="text-white font-display text-2xl tracking-tighter font-extrabold uppercase">Global</div>
              <div className="text-white/30 text-[9px] uppercase tracking-widest mt-2 font-medium">Curitiba e Região</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Quem Somos / Posicionamento */}
      <section ref={sections.pos} className="py-40 px-6 md:px-12 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-20 items-center">
             <div className="md:col-span-4 aspect-square bg-berti-ink p-12 flex flex-col justify-between shadow-2xl">
                <div className="text-berti-gold font-display text-4xl italic">B<span className="text-white">.</span></div>
                <div className="space-y-6">
                   <div className="h-px w-12 bg-berti-gold/50"></div>
                   <h3 className="text-white text-6xl font-extrabold leading-none tracking-tightest">Quem Somos?</h3>
                </div>
             </div>
             <div className="md:col-span-8">
                <div className="text-berti-gold text-[10px] font-bold uppercase tracking-[0.5em] mb-12">Nossa Essência</div>
                <h2 className="text-4xl md:text-6xl mb-12 leading-[1.1] tracking-tightest">A Berti transforma projetos em realidade com <br /><span className="italic font-serif font-light text-berti-sage/60">precisão e inteligência construtiva.</span></h2>
                <div className="space-y-8">
                  <p className="text-xl text-gray-500 font-light leading-relaxed">
                    Com mais de 20.000 m² construídos ao longo de 14 anos de atuação, desenvolvemos um sistema que une planejamento eficiente, execução limpa e acompanhamento técnico em cada etapa da obra.
                  </p>
                  <p className="text-xl text-gray-500 font-light leading-relaxed">
                    Nossa equipe atua com método, clareza e compromisso com o resultado final — entregando não apenas construções, mas soluções completas para quem valoriza tempo, investimento e qualidade.
                  </p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 4. Como a Berti Atua (5 Etapas) */}
      <section className="py-40 bg-berti-light border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
            <div className="lg:col-span-5 sticky top-32">
              <div className="text-berti-gold text-[10px] font-bold uppercase tracking-[0.5em] mb-8">Como Funciona</div>
              <h2 className="text-5xl md:text-6xl mb-10 leading-[0.95]">Você não precisa dominar construção.<br /><span className="text-berti-sage/40">Precisa de uma condução segura.</span></h2>
              <p className="text-lg text-gray-600 leading-relaxed font-light">
                Na administração de obra, a Berti gerencia planejamento, fornecedores, equipes e rotina financeira da execução. O cliente acompanha tudo com clareza, sem precisar assumir a complexidade operacional da obra.
              </p>
            </div>
            
            <div className="lg:col-span-1 hidden lg:block"></div>

            <div className="lg:col-span-6 space-y-2">
              {[
                { step: "01", title: "Entendimento do projeto e do orçamento", desc: "A obra começa com leitura técnica, definição de escopo e orçamento estruturado por etapa, antes do início da execução." },
                { step: "02", title: "Contratação e coordenação das equipes", desc: "A Berti organiza as frentes de trabalho, integra fornecedores e conduz a execução com alinhamento entre todos os envolvidos." },
                { step: "03", title: "Prestação de contas e acompanhamento mensal", desc: "O cliente recebe medições, fotos, notas fiscais e evolução física da obra com transparência e controle contínuo." },
                { step: "04", title: "Gestão técnica e fiscal da obra", desc: "Acompanhamos os processos que exigem critério técnico, documentação organizada e condução responsável ao longo da execução." },
                { step: "05", title: "Entrega com obra organizada e documentada", desc: "A finalização acontece com validação técnica, padrão de entrega e documentação consolidada." }
              ].map((item, i) => (
                <div key={i} className="group border-b border-gray-100 py-12 last:border-b-0 hover:bg-white transition-all px-8 -mx-8 cursor-default">
                  <div className="flex gap-10 items-start">
                    <span className="text-berti-gold/30 font-display font-black text-4xl group-hover:text-berti-gold transition-colors">{item.step}</span>
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold tracking-tight">{item.title}</h3>
                      <p className="text-gray-500 leading-relaxed font-light">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Diferenciais (Cards Premium) */}
      <section className="py-40 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="mb-24">
             <div className="text-berti-gold text-[10px] font-bold uppercase tracking-[0.5em] mb-8 text-center">Diferenciais</div>
             <h2 className="text-5xl md:text-7xl text-center">Gestão completa da obra, <br /><span className="italic font-serif font-light text-berti-sage/60">do planejamento à entrega final.</span></h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100 border border-gray-100">
             {[
               { title: "Inteligência Construtiva", desc: "Cada decisão técnica parte da análise rigorosa do projeto, garantindo viabilidade e precisão executiva." },
               { title: "Método e Transparência", desc: "Sistema de gestão que une planejamento eficiente, execução limpa e prestação de contas detalhada mensalmente." },
               { title: "Compromisso com o Resultado", desc: "Entrega de soluções completas para quem valoriza tempo, investimento e excelência em cada detalhe." },
               { title: "Coordenação de Equipes", desc: "Gerenciamento e acompanhamento rigoroso de mão de obra própria e terceirizada em todas as frentes." },
               { title: "Controle de Custos", desc: "Gestão técnica e fiscal de notas e insumos, assegurando que o orçamento seja respeitado com clareza total." }
             ].map((card, i) => (
               <div key={i} className="p-8 md:p-12 lg:p-16 flex flex-col justify-between aspect-square group bg-white hover:bg-berti-light transition-colors duration-500 overflow-hidden">
                 <div className="w-12 h-px bg-berti-gold/40 group-hover:w-full transition-all duration-1000"></div>
                 <div>
                   <h3 className="text-2xl md:text-3xl mb-6 md:mb-8 font-bold leading-tight tracking-tighter">{card.title}</h3>
                   <p className="text-gray-400 font-light leading-relaxed text-sm md:text-base">{card.desc}</p>
                 </div>
               </div>
             ))}
             <div className="p-8 md:p-12 lg:p-16 bg-berti-ink text-white flex flex-col justify-end aspect-square relative group overflow-hidden">
                <div className="absolute inset-0 bg-berti-gold opacity-0 group-hover:opacity-10 transition-opacity duration-1000"></div>
                <div className="text-3xl md:text-4xl font-display font-light leading-tight relative z-10">Soluções <br /><span className="text-berti-gold italic font-serif">Completas.</span></div>
             </div>
          </div>
        </div>
      </section>

      {/* 6. Transparência e Controle */}
      <section className="py-40 bg-berti-dark text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-32 opacity-[0.03] text-[25rem] font-black leading-none pointer-events-none select-none uppercase -translate-y-1/4 translate-x-1/4">Trust</div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row gap-24 items-center relative z-10">
          <div className="lg:w-1/2">
            <div className="text-berti-gold text-[10px] font-bold uppercase tracking-[0.5em] mb-12">Transparência</div>
            <h2 className="text-5xl md:text-8xl mb-12 leading-[0.9] font-extrabold">Sem margem escondida. <br /><span className="text-white/30 italic font-serif font-light">Sem ruído.</span></h2>
            <p className="text-xl text-white/50 mb-16 font-light leading-relaxed max-w-xl">
              Nosso modelo privilegia orçamento claro, acompanhamento técnico e visibilidade real sobre a obra. A mão de obra é acompanhada conforme avanço físico, os materiais seguem cotação e conferência, e o cliente acompanha a execução com critério e prestação de contas.
            </p>
          </div>
          <div className="lg:w-1/2 w-full">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-16 space-y-10">
              {[
                "Orçamento estruturado por etapa",
                "Acompanhamento técnico contínuo",
                "Relatórios mensais com fotos e medições",
                "Notas fiscais organizadas",
                "Compras e fornecedores coordenados",
                "Mais previsibilidade na tomada de decisão"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-8 group">
                  <div className="w-2 h-[1px] bg-berti-gold group-hover:w-8 transition-all duration-500"></div>
                  <span className="text-sm font-bold uppercase tracking-[0.3em] text-white/70 group-hover:text-white transition-colors">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. Escopo e Capacidade - Text over Carousel */}
      <section className="relative py-40 overflow-hidden bg-berti-ink min-h-[90vh] flex flex-col justify-center">
        {/* Background Auto-scrolling Carousel */}
        <div className="absolute inset-0 z-0 flex overflow-hidden opacity-20 pointer-events-none">
          <motion.div 
            animate={{ x: ["0%", "-50%"] }} 
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="flex w-[200%] h-full"
          >
            {[...(concepts && concepts.length > 0 ? concepts.map(c => c.url) : [
              "https://images.unsplash.com/photo-1590674251239-0f0e08f23783?q=80&w=1000",
              "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=1000",
              "https://images.unsplash.com/photo-1503387762-592dea58ef23?q=80&w=1000",
              "https://images.unsplash.com/photo-1541976590-713941fbc1f6?q=80&w=1000"
            ]), ...(concepts && concepts.length > 0 ? concepts.map(c => c.url) : [
              "https://images.unsplash.com/photo-1590674251239-0f0e08f23783?q=80&w=1000",
              "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=1000",
              "https://images.unsplash.com/photo-1503387762-592dea58ef23?q=80&w=1000",
              "https://images.unsplash.com/photo-1541976590-713941fbc1f6?q=80&w=1000"
            ])].map((src, i) => (
              <div key={i} className="flex-none h-full w-[50vw] md:w-[33vw] lg:w-[25vw] shrink-0 border-r border-white/5">
                <img 
                  src={src as string} 
                  alt="" 
                  className="w-full h-full object-cover grayscale" 
                  loading="lazy" 
                />
              </div>
            ))}
          </motion.div>
        </div>
        
        {/* Overlay gradient for readability */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-berti-ink via-berti-ink/90 to-berti-ink/60 pointer-events-none" />

        {/* Text Content overlaying the carousel */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 flex flex-col items-center text-center">
            <div className="text-berti-gold text-[10px] font-bold uppercase tracking-[0.5em] mb-8">Amplo Domínio Executivo</div>
            <h2 className="text-5xl md:text-7xl mb-12 leading-[1.1] text-white">Da fundação ao acabamento, <br /><span className="text-berti-sage font-light italic font-serif opacity-90">com coordenação técnica.</span></h2>
            <p className="text-xl text-white/70 mb-16 font-light leading-relaxed max-w-4xl">
              A Berti atua na condução técnica e executiva de obras completas, integrando estrutura, instalações, revestimentos, esquadrias, forros, acabamentos, compras e acompanhamento da execução. O objetivo é manter coerência entre escopo, orçamento e entrega.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-12 pt-12 border-t border-white/10 w-full max-w-4xl">
              {[
                "Mão de obra",
                "Gestão de Custos",
                "Gestão de Compras",
                "Construção do Zero",
                "Reformas e Ampliações",
                "Direção Técnica",
                "Compatibilização",
                "Cronograma"
              ].map(t => (
                <div key={t} className="text-white/90 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-3">
                  <div className="w-1.5 h-1.5 bg-berti-gold"></div>
                  {t}
                </div>
              ))}
            </div>
        </div>
      </section>

      {/* 7.5 Horizontal Gallery Marquee */}
      <section className="bg-berti-ink py-10 overflow-hidden border-t border-white/5">
        <div className="relative w-full flex overflow-hidden">
          <motion.div 
            animate={{ x: ["0%", "-50%"] }} 
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="flex w-[200%] gap-4 px-4"
          >
            {[...(concepts && concepts.length > 0 ? concepts.map(c => c.url) : [
              "https://images.unsplash.com/photo-1590674251239-0f0e08f23783?q=80&w=1000",
              "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=1000",
              "https://images.unsplash.com/photo-1503387762-592dea58ef23?q=80&w=1000",
              "https://images.unsplash.com/photo-1541976590-713941fbc1f6?q=80&w=1000",
              "https://images.unsplash.com/photo-118221195710-dd6b41faaea6?q=80&w=1000"
            ]), ...(concepts && concepts.length > 0 ? concepts.map(c => c.url) : [
              "https://images.unsplash.com/photo-1590674251239-0f0e08f23783?q=80&w=1000",
              "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=1000",
              "https://images.unsplash.com/photo-1503387762-592dea58ef23?q=80&w=1000",
              "https://images.unsplash.com/photo-1541976590-713941fbc1f6?q=80&w=1000",
              "https://images.unsplash.com/photo-118221195710-dd6b41faaea6?q=80&w=1000"
            ])].map((src, i) => (
              <div key={i} className="flex-none w-[280px] md:w-[400px] aspect-video rounded-sm overflow-hidden shrink-0 group">
                <img 
                  src={src as string} 
                  alt="Vitrine Berti" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                  loading="lazy" 
                />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 8. Metodologia (Processo Berti) */}
      <section className="py-40 bg-berti-light border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="mb-24 text-center">
             <div className="text-berti-gold text-[10px] font-bold uppercase tracking-[0.5em] mb-8">Fluxo de Trabalho</div>
             <h2 className="text-5xl md:text-7xl leading-[1.1]">Como a Berti <br /><span className="italic font-serif font-light text-berti-sage/60">conduz seu projeto.</span></h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-0 border border-gray-200">
             {[
               { n: "01", t: "Recebimento de Projeto", d: "Análise técnica detalhada do arquitetônico e complementares." },
               { n: "02", t: "Compatibilização", d: "Estudo de viabilidade e alinhamento entre todas as disciplinas de projeto." },
               { n: "03", t: "Orçamentos e Cotações", d: "Cotação técnica rigorosa para garantir o melhor custo-benefício real." },
               { n: "04", t: "Planejamento de Obra", d: "Definição de cronograma físico-financeiro e metas de execução." },
               { n: "05", t: "Gestão de Mão de Obra", d: "Fornecimento, coordenação e fiscalização da equipe técnica." },
               { n: "06", t: "Gestão de Materiais", d: "Curadoria na compra, recebimento e conferência rigorosa de insumos." },
               { n: "07", t: "Equipes Terceirizadas", d: "Gerenciamento total de especialistas e frentes de trabalho externas." },
               { n: "08", t: "Direção Técnica", d: "Acompanhamento integral da engenharia até a entrega final das chaves." }
             ].map((step, i) => (
               <div key={i} className="p-12 space-y-8 bg-white hover:bg-berti-light transition-all cursor-default border-r border-b border-gray-100 last:border-r-0">
                  <div className="text-berti-gold font-display font-black text-2xl opacity-30">{step.n}</div>
                  <div className="space-y-4">
                     <h4 className="text-[12px] font-bold uppercase tracking-widest leading-relaxed h-12 flex items-center">{step.t}</h4>
                     <p className="text-sm text-gray-500 font-light leading-relaxed">{step.d}</p>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 9. Autoridade Técnica (Dark Section) */}
      <section className="py-40 bg-berti-ink text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
           <div className="mb-32 max-w-4xl">
              <div className="text-berti-gold text-[10px] font-bold uppercase tracking-[0.5em] mb-12 flex items-center gap-4">
                <span className="w-12 h-px bg-berti-gold"></span>
                Autoridade Técnica
              </div>
              <h2 className="text-5xl md:text-8xl leading-none font-extrabold tracking-tighter">Obra de alto padrão exige mais do que execução. <span className="text-berti-gold italic font-serif font-light">Exige condução técnica.</span></h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-24">
              <div className="space-y-8 group">
                 <h4 className="text-white text-sm font-bold tracking-[0.3em] uppercase pb-8 border-b border-white/10 group-hover:border-berti-gold transition-colors duration-500">Experiência Elevada</h4>
                 <p className="text-white/40 leading-relaxed font-light group-hover:text-white/70 transition-colors">Atuação em projetos residenciais e comerciais com elevado nível de detalhe, coordenação e padrão de entrega.</p>
              </div>
              <div className="space-y-8 group">
                 <h4 className="text-white text-sm font-bold tracking-[0.3em] uppercase pb-8 border-b border-white/10 group-hover:border-berti-gold transition-colors duration-500">Integração entre Projeto</h4>
                 <p className="text-white/40 leading-relaxed font-light group-hover:text-white/70 transition-colors">Aproximamos leitura técnica, decisão executiva e alinhamento entre os envolvidos para evitar desalinhamentos.</p>
              </div>
              <div className="space-y-8 group">
                 <h4 className="text-white text-sm font-bold tracking-[0.3em] uppercase pb-8 border-b border-white/10 group-hover:border-berti-gold transition-colors duration-500">Processo Estruturado</h4>
                 <p className="text-white/40 leading-relaxed font-light group-hover:text-white/70 transition-colors">Cada obra avança com organização, definição de etapas e acompanhamento consistente do início ao fechamento.</p>
              </div>
           </div>
        </div>
      </section>

      {/* 10. Portfólio (Editorial Grid) */}
      <section ref={sections.portfolio} className="py-40 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
           <div className="flex flex-col md:flex-row justify-between items-end mb-32 gap-12">
              <div className="max-w-2xl">
                 <h2 className="text-6xl md:text-8xl mb-8 leading-none font-extrabold">Portfólio <br /><span className="text-berti-gold">de Obras.</span></h2>
                 <p className="text-xl text-gray-500 font-light leading-relaxed">
                   Cada obra apresentada aqui reflete uma condução técnica consistente: organização, alinhamento com o projeto, atenção à execução e compromisso com o padrão final de entrega.
                 </p>
              </div>
              <div className="pb-4">
                <Link to="/portfolio" className="group flex items-center gap-4 py-6 px-10 bg-berti-dark text-white text-[10px] font-bold uppercase tracking-widest hover:bg-berti-gold transition-all">
                  Ver Portfólio Completo <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Link>
              </div>
           </div>
           
           {loading ? <LoadingSpinner /> : (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
               {projects.slice(0, 2).map((proj, i) => (
                 <div key={i} className="group cursor-pointer" onClick={() => onProjectClick(proj)}>
                    <div className="aspect-[16/10] bg-gray-100 mb-10 overflow-hidden relative shadow-2xl">
                       <ParallaxImage 
                         src={proj.photos?.[0]} 
                         alt={proj.title} 
                         className="w-full h-full object-cover transition-all duration-[1.5s] ease-out group-hover:scale-105 saturate-125" 
                       />
                       <div className="absolute top-8 right-8 bg-berti-gold px-6 py-3 text-[9px] font-bold uppercase tracking-widest text-white border border-white/10 tracking-[0.3em] shadow-xl">Alto Padrão</div>
                    </div>
                    <div className="flex justify-between items-start border-b border-gray-100 pb-10">
                       <div>
                          <h3 className="text-3xl font-bold mb-3 tracking-tighter leading-none group-hover:text-berti-gold transition-colors">{proj.title}</h3>
                          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.4em]">{proj.location} / {proj.year}</div>
                       </div>
                       <div className="text-berti-gold text-2xl group-hover:translate-x-3 transition-transform duration-700">→</div>
                    </div>
                 </div>
               ))}
             </div>
           )}
        </div>
      </section>

      {/* 11. Como Pensamos (Typographic) */}
      <section className="py-40 bg-berti-light border-y border-gray-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-berti-gold)_0%,_transparent_1px)] bg-[length:40px_40px] opacity-[0.05]"></div>
        <div className="max-w-4xl mx-auto px-12 text-center relative z-10">
           <div className="text-berti-gold text-[10px] font-bold uppercase tracking-[0.6em] mb-12">Nossa Essência</div>
           <h2 className="text-5xl md:text-8xl mb-20 leading-[1.1] font-extrabold tracking-tighter">Uma obra bem executada não depende de sorte. <br /><span className="italic font-serif font-light text-berti-sage/60">Depende de direção.</span></h2>
           
           <div className="flex flex-wrap justify-center gap-x-12 gap-y-12 mb-20">
              {["Organização clara", "Planejamento técnico", "Definição de etapas", "Controle da execução", "Comunicação objetiva"].map(t => (
                <div key={t} className="text-[10px] font-bold uppercase tracking-[0.5em] text-berti-sage/80 bg-white shadow-sm border border-gray-100 px-8 py-4">{t}</div>
              ))}
           </div>
           
           <p className="text-3xl font-light text-berti-ink/40 max-w-2xl mx-auto italic font-serif leading-relaxed">
             Nosso papel é reduzir ruído, organizar decisões e conduzir a obra com clareza do início ao fim.
           </p>
        </div>
      </section>

      {/* 12. CTA Final */}
      <section className="py-40 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-12 border-t border-gray-100">
           <div className="flex flex-col lg:flex-row gap-32 items-center justify-between">
              <div className="max-w-2xl">
                 <div className="text-berti-gold text-[11px] font-bold uppercase tracking-[0.6em] mb-16 flex items-center gap-4">
                    <span className="w-12 h-px bg-berti-gold"></span>
                    Próximo Passo
                 </div>
                 <h2 className="text-6xl md:text-9xl leading-[0.85] font-extrabold mb-12 tracking-tightest">Envie seu projeto. <br /><span className="text-berti-gold">A Berti analisa.</span></h2>
                 <p className="text-xl text-gray-500 font-light leading-relaxed mb-16 max-w-xl">
                   Se você busca uma obra mais organizada, previsível e bem conduzida, o próximo passo é começar por uma análise técnica clara. Arquitetura, orçamento, execução e tomada de decisão precisam falar a mesma língua.
                 </p>
              </div>
              <div className="flex flex-col gap-10 w-full lg:w-auto">
                 <button 
                  onClick={() => window.location.href = `https://wa.me/5541991836651`}
                  className="px-20 py-8 bg-berti-ink text-white font-bold text-[12px] uppercase tracking-[0.4em] hover:bg-berti-gold transition-all duration-700 shadow-2xl relative group overflow-hidden"
                 >
                   <span className="relative z-10 text-white group-hover:text-white transition-colors duration-500">Agendar uma conversa</span>
                   <div className="absolute inset-0 bg-berti-gold translate-y-full group-hover:translate-y-0 transition-transform duration-700"></div>
                 </button>
                 <button 
                  onClick={() => window.location.href = `mailto:berti@curitibaconstrutora.com.br`}
                  className="px-20 py-8 border border-berti-ink/10 text-berti-ink font-bold text-[12px] uppercase tracking-[0.4em] hover:bg-berti-ink hover:text-white transition-all duration-700"
                 >
                   Analisar Projeto
                 </button>
                 <div className="text-[10px] text-gray-300 font-bold uppercase tracking-widest text-center">Curitiba • Santa Catarina</div>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
};

const ProjectCard = ({ project, onClick, idx }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: idx * 0.1, duration: 1, ease: [0.22, 1, 0.36, 1] }}
    viewport={{ once: true }}
    className="group cursor-pointer"
    onClick={onClick}
  >
    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-8 border border-gray-100 shadow-sm transition-all duration-700 hover:shadow-2xl">
      <div className="absolute inset-0 bg-berti-dark z-10 opacity-0 group-hover:opacity-20 transition-opacity duration-700" />
      {project.photos?.[0] ? (
        <ParallaxImage 
          src={project.photos[0]} 
          className="w-full h-full object-cover transition-all duration-[2000ms] ease-out group-hover:scale-110 saturate-125 contrast-110" 
          alt={project.title}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          <Building2 size={48} strokeWidth={0.5} />
        </div>
      )}
      <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0 text-white">
        <span className="text-berti-gold text-[9px] font-bold uppercase tracking-widest mb-1">{project.location}</span>
        <h4 className="text-xl font-display font-medium italic">Explorar Projeto</h4>
      </div>
    </div>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <h3 className="text-4xl font-extrabold tracking-tighter leading-none group-hover:text-berti-gold transition-colors italic">
           {project.title}
         </h3>
         <div className="text-[9px] font-bold uppercase tracking-widest text-berti-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500">Ver Obra</div>
      </div>
      <div className="flex items-center justify-between pt-6 border-t border-gray-100 text-berti-ink/40 text-[9px] font-bold uppercase tracking-widest tracking-[0.2em]">
        <span>{project.location}</span>
        <div className="flex gap-4">
           <span>{project.year}</span>
           <span>{project.area}</span>
        </div>
      </div>
    </div>
  </motion.div>
);

const ProjectDetail = ({ project, onBack }: any) => (
  <div className="bg-white min-h-screen">
    <div className="relative h-[95vh] bg-berti-dark overflow-hidden">
      <ParallaxImage 
        src={project.photos[0]} 
        className="w-full h-full object-cover opacity-80 saturate-125 contrast-110"
        alt={project.title}
      />
      <div className="absolute inset-0 flex items-center justify-center text-center p-6 bg-gradient-to-t from-berti-dark/90 via-transparent to-transparent">
        <div className="max-w-5xl">
          <button 
            onClick={onBack}
            className="text-white text-[10px] font-bold uppercase tracking-[0.5em] mb-16 flex items-center justify-center gap-3 mx-auto hover:text-berti-gold transition-all"
          >
            <ArrowLeft size={16} className="text-berti-gold" /> Voltar ao Portfólio
          </button>
          <h2 className="text-white text-6xl md:text-[8rem] leading-[0.8] tracking-tightest mb-12 font-extrabold italic drop-shadow-2xl">
            {project.title}
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            {project.area && <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white border border-white/30 px-10 py-5 bg-white/10 backdrop-blur-md shadow-2xl">{project.area}</span>}
            {project.system && <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white border border-white/30 px-10 py-5 bg-white/10 backdrop-blur-md shadow-2xl">{project.system}</span>}
          </div>
        </div>
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-6 md:px-16 py-40">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-32 items-start">
        <div className="lg:col-span-7 space-y-32">
          <div className="space-y-12">
            <div className="text-berti-gold text-xs font-bold uppercase tracking-[0.5em]">Resumo Executivo</div>
            <p className="text-4xl md:text-5xl text-berti-ink leading-[1.2] font-light italic opacity-80">
              "{project.description}"
            </p>
          </div>
          <div className="grid grid-cols-1 gap-12">
            {project.photos.slice(1).map((url: string, i: number) => (
              <div key={i} className="aspect-video overflow-hidden bg-gray-50 border border-gray-100 shadow-sm relative group cursor-crosshair">
                <ParallaxImage 
                  src={url} 
                  className="w-full h-full object-cover saturate-110 contrast-105" 
                  alt="" 
                />
                <div className="absolute inset-0 bg-berti-dark/0 group-hover:bg-berti-dark/10 transition-colors duration-700 pointer-events-none" />
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-5 sticky top-32 space-y-24">
          <div className="bg-[#FAF9F6] p-16 border border-gray-100 shadow-sm">
            <div className="text-[10px] font-bold uppercase tracking-[0.5em] text-berti-gold mb-16">Especificações</div>
            <div className="space-y-12">
              <TechnicalItem icon={<MapPin size={22} />} label="Território" value={project.location} />
              <TechnicalItem icon={<Calendar size={22} />} label="Ano de Entrega" value={project.year} />
              <TechnicalItem icon={<Ruler size={22} />} label="Área Construída" value={project.area} />
              <TechnicalItem icon={<Hammer size={22} />} label="Sistema Construtivo" value={project.system} />
            </div>
          </div>
          <div className="p-16 border border-berti-ink/10 text-center space-y-10">
             <h4 className="font-display text-3xl font-extrabold italic">Conversão Directa</h4>
             <p className="text-gray-400 text-sm leading-relaxed font-light">Solicite um estudo de viabilidade para seu projeto com os mesmos padrões de engenharia Berti.</p>
             <button onClick={() => window.location.href="https://wa.me/5541991836651"} className="w-full py-6 bg-berti-dark text-white text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-black transition-all">Iniciar Atendimento</button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const TechnicalItem = ({ icon, label, value }: any) => (
  <div className="flex items-center gap-6 group">
    <div className="p-4 bg-white text-berti-sage shadow-md rounded-sm group-hover:bg-berti-gold group-hover:text-white transition-all">{icon}</div>
    <div>
      <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">{label}</div>
      <div className="font-bold text-base">{value || 'Consulte'}</div>
    </div>
  </div>
);

const AdminLogin = ({ onLogin, onBack }: any) => (
  <div className="bg-white p-16 max-w-sm w-full shadow-2xl text-center border-t-4 border-berti-gold">
    <div className="font-display text-5xl mb-8">Portal</div>
    <p className="text-gray-500 text-[10px] mb-12 uppercase tracking-[0.2em] leading-relaxed font-bold">
      Bem-vindo ao centro de gestão Berti. Identifique-se para acessar o painel técnico.
    </p>
    <button 
      onClick={onLogin}
      className="w-full flex items-center justify-center gap-4 py-6 bg-berti-dark text-white rounded-sm hover:bg-berti-sage transition-all text-[11px] font-bold uppercase tracking-widest shadow-xl"
    >
      Login com Google
    </button>
    <button 
      onClick={onBack}
      className="mt-10 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-berti-gold transition-colors cursor-pointer"
    >
      Retornar ao Institucional
    </button>
  </div>
);

const NoPermission = ({ user, onLogout }: any) => (
  <div className="bg-white p-12 max-w-md w-full shadow-2xl text-center border-t-4 border-red-500">
    <div className="text-red-500 mb-8"><Lock size={48} className="mx-auto" /></div>
    <div className="font-display text-2xl mb-4">Acesso Negado</div>
    <p className="text-gray-500 text-sm mb-12 leading-relaxed font-light">
      A conta <strong>{user.email}</strong> não possui privilégios administrativos. <br />Contate a diretoria da Berti para liberação.
    </p>
    <button onClick={onLogout} className="text-berti-sage font-bold hover:underline text-xs uppercase tracking-widest">Sair do Sistema</button>
  </div>
);

// --- Admin Section ---

const JourneyImageCard = ({ url, index, journeyImages }: { url: string, index: number, journeyImages: string[] }) => {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=e8b75e117e3f22143003af63e9f0293b`, { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        const newImages = [...journeyImages];
        newImages[index] = data.data.url;
        await setDoc(doc(db, 'config', 'journey'), { images: newImages }, { merge: true });
      } else {
        alert('Falha ao fazer upload da imagem.');
      }
    } catch(err) { console.error(err); }
    setLoading(false);
  };

  return (
    <div className="border border-gray-100 p-4 relative group">
      <div className="font-bold mb-2 uppercase text-[10px] tracking-widest text-berti-gold">Passo 0{index + 1}</div>
      <div className="aspect-video bg-gray-50 relative overflow-hidden flex items-center justify-center">
        {loading ? (
          <div className="animate-spin w-8 h-8 rounded-full border-4 border-berti-gold border-t-transparent" />
        ) : (
          <img src={url} className="w-full h-full object-contain" />
        )}
      </div>
      <div className="mt-4">
        <label className="cursor-pointer bg-berti-ink text-white py-3 px-4 w-full text-center block text-[10px] font-bold uppercase tracking-widest hover:bg-berti-gold transition-colors">
          Trocar Imagem
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={loading} />
        </label>
      </div>
    </div>
  );
};

const AdminDashboard = ({ projects, testimonials, onLogout, onViewSite, concepts, journeyImages }: any) => {
  const [activeTab, setActiveTab ] = useState<'projects' | 'testimonials' | 'concepts' | 'journey'>('projects');
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="max-w-6xl w-full bg-white shadow-2xl min-h-[85vh] flex flex-col self-start mt-12 mx-auto overflow-hidden">
      <header className="bg-berti-dark text-white p-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-3xl font-display mb-2 tracking-tighter">Engenharia Berti</h2>
          <p className="text-white/40 text-[10px] uppercase font-bold tracking-[0.3em]">Gestão de Portfólio & Conceitos</p>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={onViewSite} className="px-8 py-4 bg-white/10 hover:bg-white/20 text-[10px] font-bold uppercase tracking-widest transition-all">Preview Site</button>
          <button onClick={onLogout} className="p-4 bg-red-500/80 hover:bg-red-500 transition-all rounded-full"><LogOut size={16} /></button>
        </div>
      </header>
      
      <div className="flex border-b border-gray-100">
        {[
          { id: 'projects', label: 'Obras Executadas', icon: <LayoutGrid size={14} /> },
          { id: 'concepts', label: 'Galeria Conceito', icon: <ImageIcon size={14} /> },
          { id: 'testimonials', label: 'Depoimentos', icon: <Star size={14} /> },
          { id: 'journey', label: 'Imagens da Jornada', icon: <ImageIcon size={14} /> }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-10 text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${activeTab === tab.id ? 'border-b-2 border-berti-gold text-berti-gold bg-berti-light/30' : 'text-gray-400 hover:bg-gray-50'}`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="p-12 flex-1">
        <div className="flex justify-between items-center mb-16">
          <h3 className="text-2xl font-bold font-display italic">
            {activeTab === 'projects' ? 'Obras de Alto Padrão' : activeTab === 'concepts' ? 'Fotos Conceito (Landing)' : activeTab === 'journey' ? 'Imagens da Jornada' : 'Avaliações de Clientes'}
          </h3>
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-3 bg-berti-sage text-white px-8 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-berti-dark transition-all rounded-sm shadow-xl"
            disabled={activeTab === 'journey'}
            style={{ opacity: activeTab === 'journey' ? 0 : 1 }}
          >
            <Plus size={18} /> {activeTab === 'concepts' ? 'Anexar Conceito' : 'Adicionar Novo'}
          </button>
        </div>

        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-berti-ink">
            {projects.map((p: Project) => (
              <div key={p.id} className="border border-gray-100 group overflow-hidden relative shadow-sm hover:shadow-xl transition-all">
                <div className="aspect-video bg-gray-100">
                  <img src={p.photos?.[0]} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 saturate-110" alt="" />
                </div>
                <div className="p-6">
                  <div className="font-bold text-lg mb-2">{p.title}</div>
                  <div className="text-gray-400 text-[10px] flex items-center gap-2 uppercase font-bold tracking-widest"><MapPin size={10} /> {p.location}</div>
                </div>
                <button 
                  onClick={async () => { if(confirm('Remover obra permanentemente?')) await deleteDoc(doc(db, 'projects', p.id)); }}
                  className="absolute top-4 right-4 p-3 bg-white/90 text-red-500 shadow-md opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'concepts' && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 text-berti-ink">
            {concepts.map((c: any) => (
              <div key={c.id} className="relative group aspect-square bg-gray-50 border border-gray-100 rounded overflow-hidden">
                <img src={c.url} className="w-full h-full object-cover" loading="lazy" />
                <button 
                  onClick={async () => { if(confirm('Remover esta foto da galeria?')) await deleteDoc(doc(db, 'concepts', c.id)); }}
                  className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={24} />
                </button>
              </div>
            ))}
            {concepts.length === 0 && <div className="col-span-full py-12 text-center text-gray-400 text-sm italic">Nenhuma foto conceito cadastrada.</div>}
          </div>
        )}

        {activeTab === 'testimonials' && (
          <div className="max-w-4xl space-y-6 text-berti-ink">
            {testimonials.map((t: Testimonial) => (
              <div key={t.id} className="p-8 border border-gray-100 flex justify-between items-center bg-gray-50/50 hover:bg-white transition-all shadow-sm">
                <div className="flex items-center gap-8">
                  <div className="w-16 h-16 bg-berti-dark text-white rounded-full flex items-center justify-center font-bold text-xl overflow-hidden border-2 border-white">
                    {t.imageUrl ? <img src={t.imageUrl} loading="lazy" className="w-full h-full object-cover" /> : t.clientName[0]}
                  </div>
                  <div>
                    <div className="font-bold text-lg">{t.clientName}</div>
                    <div className="text-berti-gold flex gap-1 mt-2">
                       {[...Array(5)].map((_, i) => <Star key={i} size={10} fill={i < t.rating ? "currentColor" : "none"} />)}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={async () => { if(confirm('Remover depoimento?')) await deleteDoc(doc(db, 'testimonials', t.id)); }}
                  className="p-4 text-red-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'journey' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-berti-ink">
            {journeyImages?.map((url: string, index: number) => (
              <JourneyImageCard key={index} url={url} index={index} journeyImages={journeyImages} />
            ))}
            {!journeyImages?.length && (
              <div className="col-span-full py-12 text-center text-gray-400 text-sm italic">As imagens da jornada não foram configuradas ainda.</div>
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {isAdding && (
          <Modal onClose={() => setIsAdding(false)}>
            {activeTab === 'projects' ? (
              <AddProjectForm onComplete={() => setIsAdding(false)} />
            ) : activeTab === 'concepts' ? (
              <AddConceptForm onComplete={() => setIsAdding(false)} />
            ) : (
              <AddTestimonialForm projects={projects} onComplete={() => setIsAdding(false)} />
            )}
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};



const Modal = ({ children, onClose }: any) => (
  <motion.div 
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-berti-dark/95 backdrop-blur-md"
  >
    <motion.div 
      initial={{ y: 20, scale: 0.95 }} animate={{ y: 0, scale: 1 }}
      className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-sm p-12 relative shadow-2xl border-t-8 border-berti-gold"
    >
      <button onClick={onClose} className="absolute top-8 right-8 text-gray-300 hover:text-berti-dark transition-colors"><X size={28} /></button>
      {children}
    </motion.div>
  </motion.div>
);

const uploadToImgbb = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);
  const apiKey = import.meta.env.VITE_IMGBB_API_KEY || '8f05ed5bc595dceaf0914c6fb7cdad4e'; // API pública fallback para demo
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: 'POST',
    body: formData
  });
  const data = await res.json();
  if (data.success) {
    return data.data.url;
  }
  throw new Error('Erro ao fazer upload da imagem.');
};

const AddProjectForm = ({ onComplete }: any) => {
  const [form, setForm] = useState({ title: '', location: '', year: '', duration: '', area: '', system: '', description: '', photos: [] as string[] });
  const [isUploading, setIsUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleFileUpload = async (e: any) => {
    const files = Array.from(e.target.files) as File[];
    if (files.length === 0) return;
    
    setIsUploading(true);
    try {
      const urls = await Promise.all(files.map(f => uploadToImgbb(f)));
      setForm(prev => ({ ...prev, photos: [...prev.photos, ...urls] }));
    } catch (err) {
      alert('Houve um problema ao enviar algumas imagens.');
    } finally {
      setIsUploading(false);
    }
  };

  const removePhoto = (index: number) => {
    setForm(prev => ({ ...prev, photos: prev.photos.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault(); setSubmitting(true);
    try { await addDoc(collection(db, 'projects'), { ...form, createdAt: Timestamp.now() }); onComplete(); }
    catch (err) { alert('Falha técnica ao salvar.'); } finally { setSubmitting(false); }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <h3 className="text-4xl font-display italic mb-12 uppercase tracking-tighter">Novos Dados Técnicos</h3>
      <div className="space-y-6">
        <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full p-5 bg-gray-50 border outline-none border-gray-100 focus:border-berti-sage font-bold" placeholder="Nome da Obra" />
        <div className="grid grid-cols-2 gap-4">
          <input required value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="p-5 bg-gray-50 border outline-none font-medium" placeholder="Cidade / Bairro" />
          <input value={form.year} onChange={e => setForm({...form, year: e.target.value})} className="p-5 bg-gray-50 border outline-none" placeholder="Ano de Entrega" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <input value={form.area} onChange={e => setForm({...form, area: e.target.value})} className="p-5 bg-gray-50 border outline-none" placeholder="Área (m²) EX: 450" />
          <input value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} className="p-5 bg-gray-50 border outline-none" placeholder="Meses de Obra" />
          <input value={form.system} onChange={e => setForm({...form, system: e.target.value})} className="p-5 bg-gray-50 border outline-none" placeholder="Sistema" />
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Fotos do Projeto</label>
          <div className="p-5 bg-gray-50 border border-gray-100 outline-none">
            <input 
              type="file" 
              accept="image/*" 
              multiple 
              onChange={handleFileUpload} 
              disabled={isUploading}
              className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-berti-gold/10 file:text-berti-gold hover:file:bg-berti-gold/20"
            />
            {isUploading && <span className="text-xs text-gray-500 ml-2 animate-pulse">Enviando...</span>}
          </div>
          {form.photos.length > 0 && (
            <div className="flex gap-4 flex-wrap mt-4">
              {form.photos.map((url, idx) => (
                <div key={idx} className="relative w-24 h-24 group">
                  <img src={url} className="w-full h-full object-cover rounded" />
                  <button type="button" onClick={() => removePhoto(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
                </div>
              ))}
            </div>
          )}
        </div>
        <textarea rows={4} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full p-5 bg-gray-50 border outline-none border-gray-100 focus:border-berti-sage" placeholder="Descrição técnica da obra" />
      </div>
      <button disabled={submitting || isUploading} type="submit" className="w-full py-6 bg-berti-dark text-white font-bold uppercase tracking-widest hover:bg-berti-sage transition-all">Publicar no Portfólio</button>
    </form>
  );
};

const AddConceptForm = ({ onComplete }: any) => {
  const [photos, setPhotos] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleFileUpload = async (e: any) => {
    const files = Array.from(e.target.files) as File[];
    if (files.length === 0) return;
    
    setIsUploading(true);
    try {
      const urls = await Promise.all(files.map(f => uploadToImgbb(f)));
      setPhotos(prev => [...prev, ...urls]);
    } catch (err) {
      alert('Houve um problema ao enviar algumas imagens.');
    } finally {
      setIsUploading(false);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault(); 
    if (photos.length === 0) return;
    setSubmitting(true);
    try { 
      for (const url of photos) {
        await addDoc(collection(db, 'concepts'), { url, createdAt: Timestamp.now() }); 
      }
      onComplete(); 
    }
    catch (err) { alert('Falha ao salvar conceito.'); } finally { setSubmitting(false); }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div className="flex items-center gap-4 mb-12">
        <ImageIcon size={32} className="text-berti-gold" />
        <h3 className="text-4xl font-display italic uppercase tracking-tighter">Adicionar Fotos Conceito</h3>
      </div>
      <p className="text-gray-500 text-sm mb-6">Estas fotos aparecerão no carrossel de background "Da fundação ao acabamento" na página inicial.</p>
      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Imagens do Carrossel</label>
          <div className="p-5 bg-gray-50 border border-gray-100 outline-none">
            <input 
              type="file" 
              accept="image/*" 
              multiple 
              onChange={handleFileUpload} 
              disabled={isUploading}
              className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-berti-gold/10 file:text-berti-gold hover:file:bg-berti-gold/20"
            />
            {isUploading && <span className="text-xs text-gray-500 ml-2 animate-pulse">Enviando...</span>}
          </div>
          {photos.length > 0 && (
            <div className="flex gap-4 flex-wrap mt-4">
              {photos.map((url, idx) => (
                <div key={idx} className="relative w-32 h-32 group">
                  <img src={url} className="w-full h-full object-cover rounded shadow-lg" />
                  <button type="button" onClick={() => removePhoto(idx)} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-110"><X size={14} /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <button disabled={submitting || isUploading || photos.length === 0} type="submit" className="w-full py-6 bg-berti-ink text-white font-bold uppercase tracking-widest hover:bg-berti-gold transition-all">Salvar no Carrossel</button>
    </form>
  );
};

const AddTestimonialForm = ({ projects, onComplete }: any) => {
  const [form, setForm] = useState({ clientName: '', workTitle: '', rating: 5, review: '', imageUrl: '' });
  const [submitting, setSubmitting] = useState(false);
  const handleSubmit = async (e: any) => {
    e.preventDefault(); setSubmitting(true);
    try { await addDoc(collection(db, 'testimonials'), { ...form, createdAt: Timestamp.now() }); onComplete(); }
    catch (err) { alert('Erro no servidor.'); } finally { setSubmitting(false); }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <h3 className="text-4xl font-display italic mb-12">Registro de Feedback</h3>
      <div className="space-y-6">
        <input required value={form.clientName} onChange={e => setForm({...form, clientName: e.target.value})} className="w-full p-5 bg-gray-50 border outline-none" placeholder="Nome Completo do Cliente" />
        <div className="grid grid-cols-2 gap-4">
          <select value={form.workTitle} onChange={e => setForm({...form, workTitle: e.target.value})} className="w-full p-5 bg-gray-50 border outline-none">
            <option value="">Selecione a obra de referência</option>
            {projects.map((p: any) => <option key={p.id} value={p.title}>{p.title}</option>)}
          </select>
          <input type="number" min="1" max="5" required value={form.rating} onChange={e => setForm({...form, rating: Number(e.target.value)})} className="w-full p-5 bg-gray-50 border outline-none" placeholder="Estrelas (1-5)" />
        </div>
        <textarea rows={5} required value={form.review} onChange={e => setForm({...form, review: e.target.value})} className="w-full p-5 bg-gray-50 border outline-none" placeholder="Relato do cliente..." />
        <input value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} className="w-full p-5 bg-gray-50 border outline-none" placeholder="URL da foto do cliente (Opcional)" />
      </div>
      <button disabled={submitting} type="submit" className="w-full py-6 bg-berti-ink text-white font-bold uppercase tracking-widest hover:bg-berti-gold transition-all">Publicar Avaliação</button>
    </form>
  );
};

const ClientJourneyPage = ({ images }: any) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const displayImages = images?.length === 4 ? images : [
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1503387762-592dea58ef23?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=2070&auto=format&fit=crop"
  ];
  
  const phases = [
    { title: "Diagnóstico", subtitle: "Passos 01, 02 e 03" },
    { title: "Estruturação", subtitle: "Passos 04, 05 e 06" },
    { title: "Planejamento", subtitle: "Passos 07, 08 e 09" },
    { title: "Execução e Entrega", subtitle: "Passos 10, 11 e 12" }
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const nextPhase = () => {
    setActiveIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevPhase = () => {
    setActiveIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="min-h-screen bg-berti-light pt-32 pb-40"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <div className="text-berti-gold text-[10px] font-bold uppercase tracking-[0.5em] mb-6 flex items-center justify-center gap-4">
             <span className="w-8 h-px bg-berti-gold/40"></span>
             A JORNADA DA OBRA
             <span className="w-8 h-px bg-berti-gold/40"></span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl mb-8 font-display tracking-tight text-berti-ink">
            A jornada da sua obra, <br className="hidden md:block" />
            <span className="italic font-serif font-light text-berti-sage">conduzida com clareza.</span>
          </h1>
          <p className="text-lg md:text-xl text-berti-ink/60 font-light max-w-3xl mx-auto leading-relaxed">
            Do primeiro contato à entrega das chaves, cada etapa é organizada para garantir previsibilidade, segurança e controle sobre o seu investimento.
          </p>
        </motion.div>

        {/* Navigation Tabs (Desktop & Tablet) */}
        <div className="hidden md:flex justify-between items-center mb-10 max-w-5xl mx-auto border-b border-gray-200">
          {phases.map((phase, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`flex-1 pb-6 relative group transition-all duration-300 ${
                activeIndex === index ? 'text-berti-gold' : 'text-berti-ink/50 hover:text-berti-ink'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-widest">0{index + 1} {phase.title}</span>
                <span className="text-xs font-light">{phase.subtitle}</span>
              </div>
              {activeIndex === index && (
                <motion.div 
                  layoutId="activeTabDesktop"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-berti-gold"
                />
              )}
            </button>
          ))}
        </div>
        
        {/* Mobile Navigation Tabs (Scrollable) */}
        <div className="flex md:hidden overflow-x-auto snap-x hide-scrollbar mb-8 -mx-6 px-6 gap-6">
          {phases.map((phase, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`flex-none w-[70vw] snap-center pb-4 relative transition-all duration-300 ${
                activeIndex === index ? 'text-berti-gold' : 'text-berti-ink/50'
              }`}
            >
              <div className="flex flex-col items-start gap-1">
                 <span className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">0{index + 1} {phase.title}</span>
                 <span className="text-[10px] font-light">{phase.subtitle}</span>
              </div>
               {activeIndex === index && (
                <motion.div 
                  layoutId="activeTabMobile"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-berti-gold"
                />
              )}
            </button>
          ))}
        </div>

        {/* Gallery Slider */}
        <div className="relative max-w-6xl mx-auto bg-white rounded-2xl md:rounded-[2.5rem] shadow-2xl shadow-berti-dark/5 p-2 md:p-4 mb-24 overflow-hidden">
          <div className="relative overflow-hidden rounded-xl md:rounded-[2rem] bg-gray-50 border border-gray-100 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-full flex items-center justify-center"
              >
                 {/* Preserving aspect ratio without cropping */}
                <img 
                  src={displayImages[activeIndex]} 
                  alt={`Fase ${activeIndex + 1}: ${phases[activeIndex].title}`}
                  className="w-full h-auto object-contain max-h-[80vh]"
                />
              </motion.div>
            </AnimatePresence>

            {/* Navigation Controls Overlay (Desktop) */}
            <div className="hidden md:flex absolute inset-y-0 left-0 right-0 items-center justify-between pointer-events-none px-6">
               <button 
                  onClick={prevPhase}
                  className="pointer-events-auto p-4 rounded-full bg-white/90 hover:bg-white text-berti-ink shadow-lg backdrop-blur-md transition-all hover:text-berti-gold hover:scale-105 group"
               >
                 <ChevronRight className="w-6 h-6 rotate-180 group-hover:-translate-x-1 transition-transform" />
               </button>
                <button 
                  onClick={nextPhase}
                   className="pointer-events-auto p-4 rounded-full bg-white/90 hover:bg-white text-berti-ink shadow-lg backdrop-blur-md transition-all hover:text-berti-gold hover:scale-105 group"
               >
                 <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
               </button>
            </div>
          </div>
        </div>

         {/* Navigation Controls (Mobile) */}
         <div className="flex md:hidden items-center justify-between mb-24 px-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <button 
              onClick={prevPhase}
              className="p-3 rounded-full bg-gray-50 hover:bg-gray-100 text-berti-ink transition-all active:scale-95"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
             <div className="flex gap-2.5">
                {displayImages.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`h-2 rounded-full transition-all duration-300 ${activeIndex === idx ? 'w-8 bg-berti-gold' : 'w-2 bg-gray-200'}`}
                  />
                ))}
             </div>
            <button 
              onClick={nextPhase}
              className="p-3 rounded-full bg-gray-50 hover:bg-gray-100 text-berti-ink transition-all active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
         </div>

         {/* CTA Section */}
         <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center bg-white p-12 md:p-20 rounded-[2.5rem] shadow-xl shadow-berti-dark/5 border border-gray-100 relative overflow-hidden"
         >
            {/* Subtle background decoration */}
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
              <ShieldCheck className="w-64 h-64 text-berti-gold" />
            </div>

            <div className="relative z-10">
              <h3 className="text-3xl md:text-5xl font-display tracking-tight text-berti-ink mb-6">
                Quer entender em qual etapa <br className="hidden md:block"/>está o seu projeto?
              </h3>
              <p className="text-lg text-berti-ink/60 font-light mb-10 max-w-2xl mx-auto leading-relaxed">
                Fale com a Berti e receba uma orientação inicial sobre o melhor caminho para estruturar sua obra.
              </p>
              <button 
                onClick={() => window.open('https://wa.me/554199999999', '_blank')}
                className="inline-flex items-center gap-4 px-10 py-5 bg-berti-dark text-white font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-berti-gold transition-all duration-300 group shadow-xl shadow-berti-dark/10"
              >
                <Phone className="w-4 h-4 text-berti-gold group-hover:text-white transition-colors" />
                Iniciar diagnóstico do projeto
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
         </motion.div>
      </div>
    </motion.div>
  );
};

// --- Main App Logic ---

export default function App() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [concepts, setConcepts] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [journeyImages, setJourneyImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1503387762-592dea58ef23?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=2070&auto=format&fit=crop"
  ]);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  // Intro Splash Timer
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Section Refs
  const heroRef = useRef<HTMLDivElement>(null);
  const posRef = useRef<HTMLDivElement>(null);
  const portfolioRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  }, [pathname]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const adminDoc = await getDoc(doc(db, 'admins', u.uid));
        const isMasterAdmin = u.email === 'berti@curitibaconstrutora.com.br';
        setIsAdmin(adminDoc.exists() || isMasterAdmin);
        if (isMasterAdmin && !adminDoc.exists()) {
          try { await setDoc(doc(db, 'admins', u.uid), { role: 'admin', email: u.email }); } catch (e) {}
        }
      } else { setIsAdmin(false); }
      setLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const unsubProjects = onSnapshot(query(collection(db, 'projects'), orderBy('createdAt', 'desc')), (snapshot) => {
      setProjects(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Project)));
      setProjectsLoading(false);
    });
    const unsubTestimonials = onSnapshot(query(collection(db, 'testimonials'), orderBy('createdAt', 'desc')), (snapshot) => {
      setTestimonials(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Testimonial)));
      setTestimonialsLoading(false);
    });
    const unsubConcepts = onSnapshot(query(collection(db, 'concepts'), orderBy('createdAt', 'desc')), (snapshot) => {
      setConcepts(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const unsubJourney = onSnapshot(doc(db, 'config', 'journey'), (docSnap) => {
      if (docSnap.exists() && docSnap.data().images) {
        setJourneyImages(docSnap.data().images);
      }
    });
    return () => { unsubProjects(); unsubTestimonials(); unsubConcepts(); unsubJourney(); };
  }, []);

  const handleProjectClick = (p: Project) => {
    setActiveProject(p);
    navigate(`/portfolio/${p.id}`);
  };

  const handleLogin = async () => {
    try { await signInWithPopup(auth, new GoogleAuthProvider()); } catch (err) {}
  };

  return (
    <AnimatePresence mode="wait">
      {loading || showSplash ? (
        <motion.div 
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="h-screen w-full flex items-center justify-center bg-berti-ink text-berti-gold fixed inset-0 z-[999]"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ 
              opacity: [0, 1, 0.5, 1, 0.5, 1],
              scale: [0.95, 1, 1, 1, 1, 1]
            }}
            transition={{ 
              duration: 2.5,
              times: [0, 0.2, 0.4, 0.6, 0.8, 1],
              ease: "easeInOut"
            }}
            className="flex flex-col items-center gap-4"
          >
            <div className="font-display text-6xl md:text-8xl tracking-tightest font-black">
              Berti<span className="text-white">.</span>
            </div>
            <motion.div 
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 0.4, width: 40 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="h-px bg-berti-gold"
            />
          </motion.div>
        </motion.div>
      ) : (
        <motion.div 
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="min-h-screen selection:bg-berti-gold selection:text-white"
        >
          <Navbar onAdminClick={() => navigate('/admin')} />
          
          <main className="pt-20">
            <Routes>
              <Route path="/" element={
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <InstitutionalLanding 
                    sections={{ hero: heroRef, pos: posRef, portfolio: portfolioRef }}
                    projects={projects}
                    onProjectClick={handleProjectClick}
                    testimonials={testimonials} 
                    loading={testimonialsLoading} 
                    concepts={concepts.map(c => c.url)}
                  />
                </motion.div>
              } />
              <Route path="/jornada" element={
                <ClientJourneyPage images={journeyImages} />
              } />
              
              <Route path="/portfolio" element={
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <section className="bg-white py-40 px-6 md:px-12">
                    <div className="max-w-7xl mx-auto">
                      <header className="mb-32">
                        <div className="text-berti-gold text-xs font-bold uppercase tracking-[0.5em] mb-10">Portfólio Berti</div>
                        <h2 className="text-6xl md:text-9xl mb-12 font-extrabold tracking-tightest leading-none">Portfólio de <br /><span className="text-berti-gold">Obras.</span></h2>
                        <p className="text-xl text-gray-500 max-w-2xl font-light leading-relaxed">
                          Condução técnica e execução de projetos que exigem precisão. Em cada entrega, refletimos nosso compromisso com o resultado final.
                        </p>
                      </header>
                      
                      {projectsLoading ? <LoadingSpinner /> : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
                          {projects.map((p, idx) => (
                            <ProjectCard key={p.id} project={p} onClick={() => handleProjectClick(p)} idx={idx} />
                          ))}
                        </div>
                      )}
                    </div>
                  </section>
                </motion.div>
              } />

              <Route path="/portfolio/:projectId" element={
                <ProjectDetailWrapper projects={projects} onBack={() => navigate('/portfolio')} />
              } />

              <Route path="/admin" element={
                <div className="min-h-screen bg-berti-light/50 flex flex-col justify-center items-center py-24">
                  {!user ? <AdminLogin onLogin={handleLogin} onBack={() => navigate('/')} /> : isAdmin ? <AdminDashboard projects={projects} testimonials={testimonials} concepts={concepts} journeyImages={journeyImages} onLogout={() => signOut(auth)} onViewSite={() => navigate('/')} /> : <NoPermission user={user} onLogout={() => signOut(auth)} />}
                </div>
              } />
            </Routes>
          </main>

          <Footer onHome={() => navigate('/')} />
          <WhatsAppButton />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const ProjectDetailWrapper = ({ projects, onBack }: any) => {
  const { projectId } = useParams();
  const project = projects.find((p: any) => p.id === projectId);
  if (!project) return <div className="h-screen flex items-center justify-center">Obra não encontrada.</div>;
  return <ProjectDetail project={project} onBack={onBack} />;
};
