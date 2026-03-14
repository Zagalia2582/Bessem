import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  Flame, Play, BookOpen, CheckCircle, Shield,
  TrendingUp, ArrowRight, Zap, Award, ChevronRight,
  Package, FileText, BarChart3, Clock
} from 'lucide-react';

type ActiveSection = 'hero' | 'catalog' | 'simulator' | 'history' | 'dashboard' | 'settings';

interface HeroSectionProps {
  onNavigate: (s: ActiveSection) => void;
  onStartSimulation: (d: { projectName: string; clientName: string }) => void;
}

export default function HeroSection({ onNavigate, onStartSimulation }: HeroSectionProps) {
  const [projectName, setProjectName] = useState('');
  const [clientName,  setClientName]  = useState('');
  const [focused, setFocused] = useState(false);

  const handleStart = (e: FormEvent) => {
    e.preventDefault();
    if (projectName.trim()) {
      onStartSimulation({ projectName: projectName.trim(), clientName: clientName.trim() });
      onNavigate('simulator');
    }
  };

  const features = [
    { icon: <Package size={12} />,   text: 'Catalogue 403+ refs' },
    { icon: <FileText size={12} />,  text: 'Devis PDF auto' },
    { icon: <TrendingUp size={12} />,text: 'Dashboard analytics' },
    { icon: <BarChart3 size={12} />, text: 'Historique devis' },
    { icon: <Clock size={12} />,     text: 'Calcul M.O. auto' },
    { icon: <Shield size={12} />,    text: 'NF EN 1057 certifié' },
  ];

  const pricingData = [
    { diam: 'Ø 22 mm', price: '35,000', label: 'Standard Pro' },
    { diam: 'Ø 20 mm', price: '30,000', label: 'Distribution' },
    { diam: 'Ø 18 mm', price: '28,000', label: 'Secondaire' },
    { diam: 'Ø 16 mm', price: '26,000', label: 'Alimentation' },
    { diam: 'Ø 14 mm', price: '22,000', label: 'Terminaison' },
  ];

  return (
    <section style={{
      background: 'linear-gradient(135deg, #080F1E 0%, #0F172A 30%, #1A365D 65%, #2C5282 100%)',
      minHeight: '100vh', paddingTop: 64, position: 'relative', overflow: 'hidden',
    }}>
      {/* Background decorations */}
      <div className="hero-grid-bg" />
      <div className="hero-glow-1" />
      <div className="hero-glow-2" />
      <div className="hero-glow-3" />

      {/* Floating orbs */}
      <div style={{ position:'absolute', top:'12%', right:'8%', width:80, height:80,
        background:'linear-gradient(135deg,rgba(237,137,54,.25),rgba(246,173,85,.1))',
        borderRadius:'50%', filter:'blur(2px)', animation:'float 4s ease-in-out infinite' }} />
      <div style={{ position:'absolute', bottom:'18%', left:'6%', width:50, height:50,
        background:'linear-gradient(135deg,rgba(44,82,130,.3),rgba(99,179,237,.15))',
        borderRadius:'50%', filter:'blur(1px)', animation:'float 5s ease-in-out infinite .8s' }} />
      <div style={{ position:'absolute', top:'55%', right:'3%', width:30, height:30,
        background:'rgba(237,137,54,.2)', borderRadius:'50%',
        animation:'float 3.5s ease-in-out infinite 1.2s' }} />

      <div style={{ maxWidth:1360, margin:'0 auto', padding:'72px 24px 56px', position:'relative', zIndex:1 }}>
        <div className="hero-grid" style={{ display:'grid', gridTemplateColumns:'1fr 420px', gap:56, alignItems:'center' }}>

          {/* ── Left column ────────────────────────────────────── */}
          <div>
            {/* Pill badge */}
            <div className="animate-fadeInDown" style={{
              display:'inline-flex', alignItems:'center', gap:8,
              background:'rgba(237,137,54,.14)', border:'1px solid rgba(237,137,54,.3)',
              borderRadius:999, padding:'6px 16px', marginBottom:24
            }}>
              <Flame size={13} color="#ED8936" />
              <span style={{ fontFamily:'Poppins',fontWeight:700,fontSize:11.5,color:'#ED8936',letterSpacing:'.08em' }}>
                SOLUTION PROFESSIONNELLE — TUNISIE
              </span>
              <div style={{ width:6,height:6,borderRadius:'50%',background:'#ED8936',animation:'pulse 2s infinite' }} />
            </div>

            {/* Main headline */}
            <h1 className="animate-fadeInUp" style={{
              fontFamily:'Poppins', fontWeight:900, fontSize:54, color:'#fff',
              lineHeight:1.08, margin:'0 0 20px', letterSpacing:'-.02em'
            }}>
              Gestion complète<br />
              <span style={{
                background:'linear-gradient(135deg,#ED8936 0%,#F6AD55 50%,#FBD38D 100%)',
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text'
              }}>
                installations gaz
              </span>
            </h1>

            <p className="animate-fadeInUp delay-100" style={{
              fontFamily:'Poppins', fontSize:16.5, color:'rgba(255,255,255,.72)',
              lineHeight:1.75, maxWidth:520, marginBottom:32
            }}>
              Catalogue de <strong style={{color:'#90CDF4'}}>403+ références</strong> certifiées NF EN 1057,
              simulateur de devis en temps réel avec <strong style={{color:'#F6AD55'}}>TVA 19%</strong> et
              génération PDF professionnelle — en <strong style={{color:'#68D391'}}>Dinar Tunisien (DT)</strong>.
            </p>

            {/* Feature pills */}
            <div className="animate-fadeInUp delay-200"
              style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:36 }}>
              {features.map(f => (
                <div key={f.text} style={{
                  display:'flex', alignItems:'center', gap:5,
                  background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.12)',
                  borderRadius:6, padding:'5px 11px', backdropFilter:'blur(8px)'
                }}>
                  <span style={{ color:'#68D391' }}>{f.icon}</span>
                  <span style={{ fontFamily:'Poppins', fontWeight:500, fontSize:11.5, color:'rgba(255,255,255,.85)' }}>
                    {f.text}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="animate-fadeInUp delay-300" style={{ display:'flex', gap:14, flexWrap:'wrap', marginBottom:44 }}>
              <button onClick={() => onNavigate('catalog')} className="btn btn-orange btn-lg btn-ripple animate-glow-orange" style={{ fontSize:14 }}>
                <BookOpen size={17} />
                Voir le catalogue
                <ArrowRight size={15} />
              </button>
              <button onClick={() => onNavigate('simulator')} style={{
                display:'inline-flex', alignItems:'center', gap:8,
                background:'rgba(255,255,255,.1)', border:'2px solid rgba(255,255,255,.25)',
                borderRadius:12, padding:'12px 24px', cursor:'pointer', color:'#fff',
                fontFamily:'Poppins', fontWeight:700, fontSize:14, backdropFilter:'blur(8px)',
                transition:'all .2s'
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background='rgba(255,255,255,.18)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background='rgba(255,255,255,.1)'; }}
              >
                <Play size={16} />
                Nouveau devis
              </button>
            </div>

            {/* Trust bar */}
            <div className="animate-fadeInUp delay-400" style={{
              display:'flex', alignItems:'center', gap:24, flexWrap:'wrap',
              paddingTop:28, borderTop:'1px solid rgba(255,255,255,.1)'
            }}>
              {[
                { icon:<Shield size={15} color="#68D391"/>,    text:'NF EN 1057' },
                { icon:<Award  size={15} color="#F6AD55"/>,    text:'DTU 61.1' },
                { icon:<CheckCircle size={15} color="#90CDF4"/>,text:'NF EN 331' },
                { icon:<Zap   size={15} color="#D6BCFA"/>,     text:'ISO 9001' },
              ].map(item => (
                <div key={item.text} style={{ display:'flex', alignItems:'center', gap:7 }}>
                  {item.icon}
                  <span style={{ fontFamily:'Poppins', fontWeight:600, fontSize:12, color:'rgba(255,255,255,.6)' }}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right column: Quick-start form ──────────────── */}
          <div className="animate-fadeInUp delay-200" style={{
            background:'rgba(255,255,255,.97)', backdropFilter:'blur(20px)',
            borderRadius:20, overflow:'hidden',
            boxShadow:'0 32px 64px rgba(0,0,0,.45), 0 0 0 1px rgba(255,255,255,.15)',
          }}>
            {/* Form header */}
            <div style={{ background:'linear-gradient(135deg,#1A365D,#2C5282)', padding:'22px 26px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
                <div style={{ background:'rgba(237,137,54,.2)', border:'1px solid rgba(237,137,54,.35)', borderRadius:9, padding:'8px', display:'flex' }}>
                  <Zap size={18} color="#ED8936" />
                </div>
                <div>
                  <div style={{ fontFamily:'Poppins', fontWeight:800, fontSize:16, color:'#fff' }}>Démarrage rapide</div>
                  <div style={{ fontFamily:'Poppins', fontSize:11.5, color:'rgba(255,255,255,.55)' }}>Créez un devis en 2 minutes</div>
                </div>
              </div>
            </div>

            {/* Form body */}
            <div style={{ padding:'22px 26px' }}>
              <form onSubmit={handleStart}>
                <div style={{ marginBottom:14 }}>
                  <label className="label label-required">Nom du projet</label>
                  <input
                    type="text" className="input-field"
                    placeholder="Ex: Installation chaudière Manzeh"
                    value={projectName} onChange={e => setProjectName(e.target.value)}
                    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                    required style={{ fontSize:13 }}
                  />
                </div>
                <div style={{ marginBottom:18 }}>
                  <label className="label">Nom du client</label>
                  <input
                    type="text" className="input-field"
                    placeholder="Ex: M. Ahmed Trabelsi"
                    value={clientName} onChange={e => setClientName(e.target.value)}
                    style={{ fontSize:13 }}
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-ripple"
                  style={{ width:'100%', padding:'13px', fontSize:14.5, borderRadius:10, marginBottom:16,
                    boxShadow: focused ? '0 4px 20px rgba(44,82,130,.45)' : '0 2px 8px rgba(44,82,130,.25)',
                  }}>
                  <Play size={15} />
                  Créer mon devis →
                </button>
              </form>

              {/* Mini stats grid */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:14 }}>
                {[
                  { v:'403+', l:'Références', c:'#2C5282', bg:'#EBF4FF' },
                  { v:'5 Ø',  l:'Diamètres', c:'#276749', bg:'#F0FFF4' },
                  { v:'19%',  l:'TVA incluse',c:'#92400E', bg:'#FFFBEB' },
                  { v:'PDF',  l:'Export auto',c:'#5B21B6', bg:'#F5F3FF' },
                ].map(s => (
                  <div key={s.l} style={{ background:s.bg, borderRadius:10, padding:'10px', textAlign:'center',
                    border:`1px solid ${s.bg === '#EBF4FF'?'#BEE3F8':s.bg === '#F0FFF4'?'#9AE6B4':s.bg === '#FFFBEB'?'#FDE68A':'#DDD6FE'}` }}>
                    <div style={{ fontFamily:'JetBrains Mono,monospace', fontWeight:800, fontSize:20, color:s.c, lineHeight:1.1 }}>{s.v}</div>
                    <div style={{ fontFamily:'Poppins', fontSize:10.5, color:'#64748B', marginTop:2 }}>{s.l}</div>
                  </div>
                ))}
              </div>

              {/* Price table preview */}
              <div style={{ background:'#F8FAFC', borderRadius:10, padding:'12px 14px', border:'1px solid #E2E8F0' }}>
                <div style={{ fontFamily:'Poppins', fontWeight:700, fontSize:11, color:'#475569', marginBottom:8, textTransform:'uppercase', letterSpacing:'.06em', display:'flex', alignItems:'center', gap:5 }}>
                  <Package size={11} />
                  Tarifs tubes cuivre HT/ml
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                  {pricingData.map((p,i) => (
                    <div key={p.diam} style={{
                      display:'flex', alignItems:'center', justifyContent:'space-between',
                      padding:'5px 8px', borderRadius:6,
                      background: i === 0 ? 'rgba(44,82,130,.06)' : 'transparent',
                      transition:'background .15s'
                    }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <span style={{ fontFamily:'JetBrains Mono,monospace', fontWeight:700, fontSize:12, color:'#2C5282' }}>{p.diam}</span>
                        <span style={{ fontFamily:'Poppins', fontSize:10.5, color:'#94A3B8' }}>{p.label}</span>
                      </div>
                      <span style={{ fontFamily:'JetBrains Mono,monospace', fontWeight:800, fontSize:13, color:'#2C5282' }}>
                        {p.price} <span style={{ fontSize:10, fontWeight:500, color:'#94A3B8' }}>DT</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom stats bar ─────────────────────────────────── */}
        <div className="animate-fadeInUp delay-500" style={{
          display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginTop:52
        }}>
          {[
            { v:'403+', l:'Références catalogue', d:'Produits certifiés NF', c:'#ED8936' },
            { v:'5 Ø',  l:'Diamètres cuivre',   d:'14 · 16 · 18 · 20 · 22 mm',c:'#90CDF4' },
            { v:'19%',  l:'TVA Tunisie',         d:'Calcul automatique TTC',   c:'#68D391' },
            { v:'DT',   l:'Dinar Tunisien',      d:'Prix HT & TTC complets',   c:'#D6BCFA' },
          ].map(s => (
            <div key={s.l} style={{
              background:'rgba(255,255,255,.055)', backdropFilter:'blur(12px)',
              borderRadius:14, padding:'20px 22px', border:'1px solid rgba(255,255,255,.09)',
              transition:'all .2s', cursor:'default'
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background='rgba(255,255,255,.09)'; (e.currentTarget as HTMLDivElement).style.borderColor='rgba(255,255,255,.18)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background='rgba(255,255,255,.055)'; (e.currentTarget as HTMLDivElement).style.borderColor='rgba(255,255,255,.09)'; }}
            >
              <div style={{ fontFamily:'JetBrains Mono,monospace', fontWeight:800, fontSize:32, color:s.c, lineHeight:1, letterSpacing:'-.02em' }}>{s.v}</div>
              <div style={{ fontFamily:'Poppins', fontWeight:600, fontSize:13, color:'#fff', marginTop:7 }}>{s.l}</div>
              <div style={{ fontFamily:'Poppins', fontSize:11, color:'rgba(255,255,255,.42)', marginTop:2 }}>{s.d}</div>
            </div>
          ))}
        </div>

        {/* ── Scroll hint ───────────────────────────────────── */}
        <div style={{ textAlign:'center', marginTop:40 }}>
          <button
            onClick={() => onNavigate('catalog')}
            style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,.4)', display:'inline-flex', flexDirection:'column', alignItems:'center', gap:6, transition:'color .2s' }}
            onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color='rgba(255,255,255,.8)')}
            onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color='rgba(255,255,255,.4)')}
          >
            <span style={{ fontFamily:'Poppins', fontSize:11.5, fontWeight:500, letterSpacing:'.06em', textTransform:'uppercase' }}>
              Explorer le catalogue
            </span>
            <ChevronRight size={16} style={{ transform:'rotate(90deg)', animation:'float 2s ease-in-out infinite' }} />
          </button>
        </div>
      </div>
    </section>
  );
}
