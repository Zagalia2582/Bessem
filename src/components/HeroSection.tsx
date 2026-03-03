import { useState } from 'react';
import type { FormEvent } from 'react';
import { Flame, Play, BookOpen, CheckCircle, Shield, TrendingUp, ArrowRight, Zap, Award } from 'lucide-react';

type ActiveSection = 'hero' | 'catalog' | 'simulator' | 'history' | 'dashboard' | 'settings';

interface HeroSectionProps {
  onNavigate: (section: ActiveSection) => void;
  onStartSimulation: (data: { projectName: string; clientName: string }) => void;
}

export default function HeroSection({ onNavigate, onStartSimulation }: HeroSectionProps) {
  const [projectName, setProjectName] = useState('');
  const [clientName, setClientName] = useState('');

  const handleStart = (e: FormEvent) => {
    e.preventDefault();
    if (projectName.trim()) {
      onStartSimulation({ projectName: projectName.trim(), clientName: clientName.trim() });
      onNavigate('simulator');
    }
  };

  return (
    <section style={{
      background: 'linear-gradient(135deg, #0F172A 0%, #1A365D 40%, #2C5282 100%)',
      minHeight: '100vh', paddingTop: '64px', position: 'relative', overflow: 'hidden'
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute', inset: 0, backgroundImage: `
          radial-gradient(circle at 20% 50%, rgba(44, 82, 130, 0.4) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(237, 137, 54, 0.15) 0%, transparent 40%),
          radial-gradient(circle at 60% 80%, rgba(44, 82, 130, 0.3) 0%, transparent 40%)
        `
      }} />

      {/* Grid pattern */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.05,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }} />

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '80px 24px 60px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '60px', alignItems: 'center' }}>

          {/* Left content */}
          <div className="animate-fadeInUp">
            {/* Badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(237, 137, 54, 0.15)', border: '1px solid rgba(237, 137, 54, 0.3)', borderRadius: '20px', padding: '6px 14px', marginBottom: '24px' }}>
              <Flame size={14} color="#ED8936" />
              <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '12px', color: '#ED8936', letterSpacing: '0.05em' }}>
                SOLUTION PROFESSIONNELLE CERTIFIÉE
              </span>
            </div>

            <h1 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '52px', color: 'white', lineHeight: '1.1', margin: '0 0 20px' }}>
              Gestion complète{' '}
              <span style={{ background: 'linear-gradient(135deg, #ED8936, #F6AD55)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                d'installation gaz
              </span>
            </h1>

            <p style={{ fontFamily: 'Poppins', fontSize: '17px', color: 'rgba(255,255,255,0.75)', lineHeight: '1.7', maxWidth: '520px', margin: '0 0 36px' }}>
              Catalogue de 403+ références, simulateur de devis en temps réel avec calcul automatique TVA, 
              générateur PDF professionnel et gestion complète de vos projets d'installation gaz naturel.
            </p>

            {/* Feature badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '40px' }}>
              {[
                { icon: <CheckCircle size={13} />, text: 'Tubes Ø14 à Ø22mm' },
                { icon: <CheckCircle size={13} />, text: 'Calcul TVA 19%' },
                { icon: <CheckCircle size={13} />, text: 'Devis PDF automatique' },
                { icon: <CheckCircle size={13} />, text: 'Historique des devis' },
                { icon: <CheckCircle size={13} />, text: 'Dashboard analytics' },
              ].map(item => (
                <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '6px', padding: '6px 12px', border: '1px solid rgba(255,255,255,0.12)' }}>
                  <span style={{ color: '#68D391' }}>{item.icon}</span>
                  <span style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '12px', color: 'rgba(255,255,255,0.85)' }}>{item.text}</span>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <button
                onClick={() => onNavigate('catalog')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: 'linear-gradient(135deg, #ED8936, #F6AD55)',
                  border: 'none', borderRadius: '10px', padding: '14px 28px',
                  cursor: 'pointer', color: 'white', fontFamily: 'Poppins',
                  fontWeight: 700, fontSize: '15px', boxShadow: '0 4px 20px rgba(237,137,54,0.4)',
                  transition: 'all 0.2s'
                }}
              >
                <BookOpen size={18} />
                Voir le catalogue
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => onNavigate('simulator')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.25)',
                  borderRadius: '10px', padding: '14px 28px',
                  cursor: 'pointer', color: 'white', fontFamily: 'Poppins',
                  fontWeight: 700, fontSize: '15px', backdropFilter: 'blur(8px)',
                  transition: 'all 0.2s'
                }}
              >
                <Play size={18} />
                Démarrer un devis
              </button>
            </div>

            {/* Trust indicators */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginTop: '40px', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              {[
                { icon: <Shield size={16} color="#68D391" />, text: 'NF EN 1057 certifié' },
                { icon: <Award size={16} color="#F6AD55" />, text: 'DTU 61.1 conforme' },
                { icon: <TrendingUp size={16} color="#90CDF4" />, text: 'Devis en DT TTC' },
              ].map(item => (
                <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {item.icon}
                  <span style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '12px', color: 'rgba(255,255,255,0.65)' }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Quick start form */}
          <div className="animate-fadeInUp delay-200" style={{
            background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)',
            borderRadius: '20px', padding: '32px', border: '1px solid rgba(255,255,255,0.3)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.4)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{ background: 'linear-gradient(135deg, #ED8936, #F6AD55)', borderRadius: '8px', padding: '8px' }}>
                <Zap size={18} color="white" />
              </div>
              <div>
                <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '17px', color: '#1E293B', margin: 0 }}>
                  Démarrage rapide
                </h3>
                <p style={{ fontFamily: 'Poppins', fontSize: '12px', color: '#64748B', margin: 0 }}>
                  Créez un devis en moins de 2 minutes
                </p>
              </div>
            </div>

            <div style={{ height: '1px', background: 'linear-gradient(to right, #E2E8F0, transparent)', margin: '20px 0' }} />

            <form onSubmit={handleStart}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontFamily: 'Poppins', fontWeight: 600, fontSize: '12px', color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Nom du projet *
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Ex: Installation chaudière - Villa Manzeh"
                  value={projectName}
                  onChange={e => setProjectName(e.target.value)}
                  required
                  style={{ fontSize: '13px' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontFamily: 'Poppins', fontWeight: 600, fontSize: '12px', color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Nom du client
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Ex: M. Ahmed Trabelsi"
                  value={clientName}
                  onChange={e => setClientName(e.target.value)}
                  style={{ fontSize: '13px' }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%', padding: '13px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, #2C5282, #3182CE)',
                  color: 'white', border: 'none', cursor: 'pointer',
                  fontFamily: 'Poppins', fontWeight: 700, fontSize: '15px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  boxShadow: '0 4px 15px rgba(44, 82, 130, 0.4)', transition: 'all 0.2s'
                }}
              >
                <Play size={16} />
                Créer mon devis
                <ArrowRight size={16} />
              </button>
            </form>

            {/* Quick stats */}
            <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[
                { value: '403+', label: 'Références', color: '#2C5282' },
                { value: '5 Ø', label: 'Diamètres', color: '#276749' },
                { value: '19%', label: 'TVA incluse', color: '#744210' },
                { value: 'PDF', label: 'Export devis', color: '#553C9A' },
              ].map(stat => (
                <div key={stat.label} style={{ background: '#F8FAFC', borderRadius: '10px', padding: '12px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: '20px', color: stat.color }}>{stat.value}</div>
                  <div style={{ fontFamily: 'Poppins', fontSize: '11px', color: '#64748B', marginTop: '2px' }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Categories preview */}
            <div style={{ marginTop: '16px', padding: '14px', background: '#FFFAF0', borderRadius: '10px', border: '1px solid #FBD38D' }}>
              <div style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '11px', color: '#744210', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                4 catégories disponibles
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {[
                  { label: 'Tubes Cuivre', color: '#2C5282', bg: '#EBF4FF' },
                  { label: 'Raccords', color: '#276749', bg: '#F0FFF4' },
                  { label: 'Vannes', color: '#744210', bg: '#FFFAF0' },
                  { label: 'Ventilation', color: '#553C9A', bg: '#FAF5FF' },
                ].map(cat => (
                  <span key={cat.label} style={{ background: cat.bg, color: cat.color, fontFamily: 'Poppins', fontWeight: 600, fontSize: '11px', padding: '3px 8px', borderRadius: '4px' }}>
                    {cat.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginTop: '60px' }} className="animate-fadeInUp delay-300">
          {[
            { value: '403+', label: 'Références catalogue', desc: 'Produits certifiés NF', color: '#ED8936' },
            { value: '5 Ø', label: 'Diamètres tubes', desc: 'Ø14 • Ø16 • Ø18 • Ø20 • Ø22mm', color: '#90CDF4' },
            { value: '19%', label: 'TVA Tunisie', desc: 'Calcul automatique TTC', color: '#68D391' },
            { value: 'DT', label: 'Devise Tunisien', desc: 'Dinar Tunisien (TND)', color: '#D6BCFA' },
          ].map(stat => (
            <div key={stat.label} style={{
              background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)',
              borderRadius: '12px', padding: '20px 24px', border: '1px solid rgba(255,255,255,0.1)',
              transition: 'all 0.2s'
            }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: '28px', color: stat.color, lineHeight: '1' }}>
                {stat.value}
              </div>
              <div style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '13px', color: 'white', marginTop: '6px' }}>
                {stat.label}
              </div>
              <div style={{ fontFamily: 'Poppins', fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>
                {stat.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Minimal icon components used in stats preview (unused vars removed)
