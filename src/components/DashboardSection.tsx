import {
  BarChart3, TrendingUp, Package, Clock, DollarSign,
  FileText, Star, ChevronRight, Zap
} from 'lucide-react';
import type { QuoteLineItem, Quote, Category } from '../data';
import { CATEGORY_CONFIG, formatCurrency, calculateQuoteTotals, estimateLaborHours } from '../data';

interface DashboardSectionProps {
  items: QuoteLineItem[];
  marginRate: number;
  laborRate: number;
  savedQuotes: Quote[];
  onNavigate: (section: 'hero' | 'catalog' | 'simulator' | 'history' | 'dashboard' | 'settings') => void;
}

export default function DashboardSection({ items, marginRate, laborRate, savedQuotes, onNavigate }: DashboardSectionProps) {
  const estimatedHours = estimateLaborHours(items);
  const totals = calculateQuoteTotals(items, marginRate, laborRate, estimatedHours, 19);

  // Category breakdown
  const catBreakdown: Partial<Record<Category, { count: number; total: number }>> = {};
  items.forEach(item => {
    const cat = item.catalog_item.category;
    if (!catBreakdown[cat]) catBreakdown[cat] = { count: 0, total: 0 };
    catBreakdown[cat]!.count += 1;
    catBreakdown[cat]!.total += item.unit_price * item.quantity * (1 - (item.discount || 0) / 100);
  });

  // Quote stats
  const totalRevenue = savedQuotes.reduce((sum, q) => sum + q.total_ttc, 0);
  const acceptedQuotes = savedQuotes.filter(q => q.status === 'accepted').length;
  const acceptanceRate = savedQuotes.length > 0 ? (acceptedQuotes / savedQuotes.length) * 100 : 0;

  const recentQuotes = [...savedQuotes].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);

  const profitPerHour = estimatedHours > 0 ? totals.margin_amount / estimatedHours : 0;

  const statCards = [
    {
      title: 'Coût matériaux HT',
      value: formatCurrency(totals.subtotal_ht),
      icon: <Package size={20} />,
      color: '#2C5282', bg: '#EBF4FF',
      desc: `${items.length} articles dans le devis actif`,
    },
    {
      title: 'Main d\'œuvre',
      value: formatCurrency(totals.labor_total),
      icon: <Clock size={20} />,
      color: '#744210', bg: '#FFFAF0',
      desc: `${estimatedHours}h estimées × ${laborRate} DT/h`,
    },
    {
      title: 'Marge brute',
      value: formatCurrency(totals.margin_amount),
      icon: <TrendingUp size={20} />,
      color: '#276749', bg: '#F0FFF4',
      desc: `Taux: ${marginRate}% sur HT + M.O.`,
    },
    {
      title: 'Total TTC',
      value: formatCurrency(totals.total_ttc),
      icon: <DollarSign size={20} />,
      color: '#553C9A', bg: '#FAF5FF',
      desc: `TVA 19% = ${formatCurrency(totals.tva_amount)}`,
    },
  ];

  return (
    <section style={{ padding: '40px 0', minHeight: '80vh' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>

        {/* Section header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
          <div style={{ background: 'linear-gradient(135deg, #553C9A, #6B46C1)', borderRadius: '10px', padding: '8px' }}>
            <BarChart3 size={20} color="white" />
          </div>
          <div>
            <h2 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '26px', color: '#1E293B', margin: 0 }}>
              Tableau de Bord
            </h2>
            <p style={{ fontFamily: 'Poppins', fontSize: '13px', color: '#64748B', margin: 0 }}>
              Analyse du devis actif et historique des projets
            </p>
          </div>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
          {statCards.map((card, i) => (
            <div key={card.title} className="card-hover animate-fadeInUp" style={{
              background: 'white', borderRadius: '14px', padding: '20px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #E2E8F0',
              animationDelay: `${i * 0.08}s`, opacity: 0, animationFillMode: 'forwards'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ background: card.bg, borderRadius: '10px', padding: '10px', color: card.color }}>
                  {card.icon}
                </div>
                <TrendingUp size={14} color="#94A3B8" />
              </div>
              <div style={{ fontFamily: 'Poppins', fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>{card.title}</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, fontSize: '20px', color: card.color }}>{card.value}</div>
              <div style={{ fontFamily: 'Poppins', fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>{card.desc}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>

          {/* Category breakdown */}
          <div style={{ background: 'white', borderRadius: '14px', padding: '22px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #E2E8F0' }}>
            <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '15px', color: '#1E293B', margin: '0 0 18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Package size={15} color="#2C5282" />
              Répartition par catégorie
            </h3>

            {items.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px', color: '#CBD5E1' }}>
                <Package size={32} style={{ margin: '0 auto 8px', display: 'block' }} />
                <p style={{ fontFamily: 'Poppins', fontSize: '12px', margin: 0 }}>Aucun article dans le devis</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {(Object.keys(CATEGORY_CONFIG) as Category[]).map(cat => {
                  const data = catBreakdown[cat];
                  if (!data) return null;
                  const config = CATEGORY_CONFIG[cat];
                  const pct = Math.round((data.total / totals.subtotal_ht) * 100);
                  return (
                    <div key={cat}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '12px', color: config.color }}>{config.label}</span>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: '12px', color: '#1E293B' }}>{pct}%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${pct}%`, background: config.color }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
                        <span style={{ fontFamily: 'Poppins', fontSize: '10px', color: '#94A3B8' }}>{data.count} article{data.count > 1 ? 's' : ''}</span>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#64748B' }}>{formatCurrency(data.total)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Profit analysis */}
          <div style={{ background: 'linear-gradient(135deg, #1A365D, #2C5282)', borderRadius: '14px', padding: '22px', boxShadow: '0 8px 25px rgba(44,82,130,0.3)' }}>
            <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '15px', color: 'rgba(255,255,255,0.9)', margin: '0 0 18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={15} color="#ED8936" />
              Analyse de rentabilité
            </h3>

            {[
              { label: 'Total HT', value: formatCurrency(totals.total_ht), color: 'white', size: '18px' },
              { label: 'Marge brute', value: formatCurrency(totals.margin_amount), color: '#68D391', size: '15px' },
              { label: `Taux marge (${marginRate}%)`, value: `${totals.total_ht > 0 ? ((totals.margin_amount / totals.total_ht) * 100).toFixed(1) : 0}%`, color: '#68D391', size: '15px' },
              { label: 'Rentabilité/h', value: `${formatCurrency(profitPerHour)}/h`, color: '#F6AD55', size: '15px' },
              { label: 'TVA collectée', value: formatCurrency(totals.tva_amount), color: 'rgba(255,255,255,0.6)', size: '13px' },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontFamily: 'Poppins', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>{row.label}</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: row.size, color: row.color }}>{row.value}</span>
              </div>
            ))}

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '14px', marginTop: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'Poppins', fontSize: '13px', color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>TOTAL TTC</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, fontSize: '22px', color: '#ED8936' }}>{formatCurrency(totals.total_ttc)}</span>
              </div>
            </div>
          </div>

          {/* Quotes history stats */}
          <div style={{ background: 'white', borderRadius: '14px', padding: '22px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #E2E8F0' }}>
            <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '15px', color: '#1E293B', margin: '0 0 18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Star size={15} color="#ED8936" />
              Statistiques globales
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
              {[
                { label: 'Devis sauvés', value: savedQuotes.length.toString(), color: '#2C5282', bg: '#EBF4FF' },
                { label: 'Acceptés', value: acceptedQuotes.toString(), color: '#276749', bg: '#F0FFF4' },
                { label: 'CA total TTC', value: savedQuotes.length > 0 ? formatCurrency(totalRevenue).split('.')[0] + ' DT' : '0 DT', color: '#553C9A', bg: '#FAF5FF' },
                { label: 'Taux accept.', value: `${acceptanceRate.toFixed(0)}%`, color: '#744210', bg: '#FFFAF0' },
              ].map(s => (
                <div key={s.label} style={{ background: s.bg, borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, fontSize: '18px', color: s.color }}>{s.value}</div>
                  <div style={{ fontFamily: 'Poppins', fontSize: '10px', color: '#64748B', marginTop: '2px' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {savedQuotes.length > 0 && (
              <div>
                <div style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '12px', color: '#475569', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Devis récents
                </div>
                {recentQuotes.map(q => (
                  <div key={q.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid #F1F5F9' }}>
                    <div>
                      <div style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '12px', color: '#334155' }}>{q.project_name}</div>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#94A3B8' }}>{q.quote_number}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: '13px', color: '#2C5282' }}>{formatCurrency(q.total_ttc)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => onNavigate('history')}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                width: '100%', marginTop: '14px', padding: '10px', borderRadius: '8px',
                border: '1px solid #E2E8F0', background: 'transparent', cursor: 'pointer',
                fontFamily: 'Poppins', fontWeight: 600, fontSize: '13px', color: '#2C5282',
                transition: 'all 0.2s'
              }}
            >
              <FileText size={14} />
              Voir l'historique complet
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Tips */}
        <div style={{ marginTop: '20px', background: '#FFFAF0', borderRadius: '14px', padding: '18px 22px', border: '1px solid #FBD38D', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#ED8936', borderRadius: '8px', padding: '8px' }}>
            <Zap size={16} color="white" />
          </div>
          <div>
            <div style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '13px', color: '#744210' }}>
              Conseil professionnel
            </div>
            <div style={{ fontFamily: 'Poppins', fontSize: '12px', color: '#92400E', marginTop: '2px' }}>
              Pour les installations résidentielles standard, une marge de 25-30% est recommandée. 
              Pensez à inclure le déplacement et les matières consommables dans vos heures M.O.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
