import { useState, useMemo } from 'react';
import {
  History, Search, ChevronDown, ChevronUp, Eye,
  Trash2, Copy, FileText, Download,
  CheckCircle, AlertTriangle,
  ArrowUpDown, TrendingUp, DollarSign
} from 'lucide-react';
import type { Quote, QuoteStatus } from '../data';
import { STATUS_CONFIG, CATEGORY_CONFIG, formatCurrency, formatDate } from '../data';

interface QuotesHistorySectionProps {
  quotes: Quote[];
  onLoadQuote: (quote: Quote) => void;
  onDeleteQuote: (id: string) => void;
  onUpdateStatus: (id: string, status: QuoteStatus) => void;
  onGeneratePDF: (quote: Quote) => void;
  isLoggedIn: boolean;
}

type SortField = 'quote_number' | 'project_name' | 'client_name' | 'created_at' | 'total_ttc' | 'status';
type SortDir = 'asc' | 'desc';

export default function QuotesHistorySection({
  quotes, onLoadQuote, onDeleteQuote, onUpdateStatus, onGeneratePDF, isLoggedIn
}: QuotesHistorySectionProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<QuoteStatus | 'all'>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(1);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const PAGE_SIZE = 10;

  const filtered = useMemo(() => {
    return quotes.filter(q => {
      const s = search.toLowerCase();
      const matchSearch = !search || q.project_name.toLowerCase().includes(s) || q.client_name.toLowerCase().includes(s) || q.quote_number.toLowerCase().includes(s);
      const matchStatus = statusFilter === 'all' || q.status === statusFilter;
      const matchFrom = !dateFrom || new Date(q.created_at) >= new Date(dateFrom);
      const matchTo = !dateTo || new Date(q.created_at) <= new Date(dateTo + 'T23:59:59');
      return matchSearch && matchStatus && matchFrom && matchTo;
    });
  }, [quotes, search, statusFilter, dateFrom, dateTo]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let valA: string | number = a[sortField] as string | number;
      let valB: string | number = b[sortField] as string | number;
      if (sortField === 'total_ttc') { valA = Number(valA); valB = Number(valB); }
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filtered, sortField, sortDir]);

  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  // Stats
  const totalRevenue = quotes.reduce((s, q) => s + q.total_ttc, 0);
  const avgValue = quotes.length > 0 ? totalRevenue / quotes.length : 0;
  const acceptedCount = quotes.filter(q => q.status === 'accepted').length;
  const acceptanceRate = quotes.length > 0 ? (acceptedCount / quotes.length) * 100 : 0;

  const ThSortable = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <th
      onClick={() => handleSort(field)}
      style={{ cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap', padding: '11px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: sortField === field ? '#2C5282' : '#64748B', background: sortField === field ? '#EBF4FF' : '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
        {children}
        {sortField === field
          ? (sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)
          : <ArrowUpDown size={10} style={{ opacity: 0.4 }} />
        }
      </span>
    </th>
  );

  if (!isLoggedIn) {
    return (
      <section style={{ padding: '60px 24px', textAlign: 'center', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>
          <div style={{ background: '#EBF4FF', borderRadius: '50%', width: '64px', height: '64px', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <History size={28} color="#2C5282" />
          </div>
          <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '20px', color: '#1E293B', margin: '0 0 8px' }}>Historique des devis</h3>
          <p style={{ fontFamily: 'Poppins', fontSize: '14px', color: '#64748B', maxWidth: '400px', margin: '0 auto 20px' }}>
            Connectez-vous pour accéder à l'historique de vos devis, suivre leurs statuts et gérer vos projets.
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#FFFAF0', border: '1px solid #FBD38D', borderRadius: '8px', padding: '10px 16px' }}>
            <AlertTriangle size={14} color="#ED8936" />
            <span style={{ fontFamily: 'Poppins', fontSize: '13px', color: '#744210' }}>Connexion requise pour cette fonctionnalité</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section style={{ padding: '40px 0', minHeight: '80vh' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{ background: 'linear-gradient(135deg, #553C9A, #6B46C1)', borderRadius: '10px', padding: '8px' }}>
            <History size={20} color="white" />
          </div>
          <div>
            <h2 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '26px', color: '#1E293B', margin: 0 }}>
              Historique des Devis
            </h2>
            <p style={{ fontFamily: 'Poppins', fontSize: '13px', color: '#64748B', margin: 0 }}>
              {quotes.length} devis sauvegardés • Gestion complète du cycle de vie
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
          {[
            { label: 'Total devis', value: quotes.length.toString(), icon: <FileText size={16} />, color: '#2C5282', bg: '#EBF4FF' },
            { label: 'CA total TTC', value: formatCurrency(totalRevenue), icon: <DollarSign size={16} />, color: '#553C9A', bg: '#FAF5FF' },
            { label: 'Valeur moyenne', value: formatCurrency(avgValue), icon: <TrendingUp size={16} />, color: '#276749', bg: '#F0FFF4' },
            { label: "Taux d'accept.", value: `${acceptanceRate.toFixed(0)}%`, icon: <CheckCircle size={16} />, color: '#744210', bg: '#FFFAF0' },
          ].map(s => (
            <div key={s.label} style={{ background: 'white', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ background: s.bg, color: s.color, borderRadius: '8px', padding: '8px', flexShrink: 0 }}>{s.icon}</div>
              <div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: '16px', color: s.color }}>{s.value}</div>
                <div style={{ fontFamily: 'Poppins', fontSize: '11px', color: '#64748B' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '18px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0', marginBottom: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search */}
          <div style={{ flex: '1', minWidth: '200px', position: 'relative' }}>
            <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input type="text" className="input-field" style={{ paddingLeft: '34px', height: '38px', fontSize: '13px' }} placeholder="Rechercher par n°, projet, client..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value as QuoteStatus | 'all'); setPage(1); }}
            className="input-field"
            style={{ width: '160px', height: '38px', fontSize: '13px' }}
          >
            <option value="all">Tous les statuts</option>
            {(Object.keys(STATUS_CONFIG) as QuoteStatus[]).map(s => (
              <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
            ))}
          </select>

          {/* Date range */}
          <input type="date" className="input-field" style={{ width: '148px', height: '38px', fontSize: '13px' }} value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
          <span style={{ fontFamily: 'Poppins', fontSize: '12px', color: '#94A3B8' }}>→</span>
          <input type="date" className="input-field" style={{ width: '148px', height: '38px', fontSize: '13px' }} value={dateTo} onChange={e => setDateTo(e.target.value)} />

          <div style={{ fontFamily: 'Poppins', fontSize: '12px', color: '#64748B', whiteSpace: 'nowrap' }}>
            <span style={{ fontWeight: 700, color: '#2C5282' }}>{sorted.length}</span> résultats
          </div>
        </div>

        {/* Table */}
        <div style={{ background: 'white', borderRadius: '14px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          {quotes.length === 0 ? (
            <div style={{ padding: '80px 20px', textAlign: 'center' }}>
              <FileText size={48} style={{ margin: '0 auto 14px', display: 'block', color: '#CBD5E1' }} />
              <h4 style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '17px', color: '#64748B', margin: '0 0 6px' }}>Aucun devis sauvegardé</h4>
              <p style={{ fontFamily: 'Poppins', fontSize: '13px', color: '#CBD5E1', margin: 0 }}>
                Créez votre premier devis depuis le simulateur
              </p>
            </div>
          ) : paginated.length === 0 ? (
            <div style={{ padding: '60px 20px', textAlign: 'center' }}>
              <Search size={36} style={{ margin: '0 auto 12px', display: 'block', color: '#CBD5E1' }} />
              <p style={{ fontFamily: 'Poppins', fontSize: '13px', color: '#94A3B8', margin: 0 }}>Aucun devis correspondant aux filtres</p>
            </div>
          ) : (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table" style={{ minWidth: '900px' }}>
                  <thead>
                    <tr>
                      <ThSortable field="quote_number">N° Devis</ThSortable>
                      <ThSortable field="project_name">Projet</ThSortable>
                      <ThSortable field="client_name">Client</ThSortable>
                      <ThSortable field="created_at">Date</ThSortable>
                      <ThSortable field="total_ttc">Total TTC</ThSortable>
                      <ThSortable field="status">Statut</ThSortable>
                      <th style={{ padding: '11px 14px', fontSize: '11px', fontWeight: 600, color: '#64748B', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map(quote => {
                      const sc = STATUS_CONFIG[quote.status as QuoteStatus] || STATUS_CONFIG.draft;
                      return (
                        <tr key={quote.id} style={{ transition: 'background 0.15s' }}
                          onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFC')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'white')}
                        >
                          <td>
                            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', fontWeight: 700, color: '#2C5282', background: '#EBF4FF', padding: '3px 8px', borderRadius: '5px' }}>
                              {quote.quote_number}
                            </span>
                          </td>
                          <td>
                            <div style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '13px', color: '#1E293B' }}>{quote.project_name}</div>
                            {quote.client_address && <div style={{ fontFamily: 'Poppins', fontSize: '11px', color: '#94A3B8' }}>{quote.client_address}</div>}
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'linear-gradient(135deg, #2C5282, #3182CE)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <span style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '10px', color: 'white' }}>
                                  {quote.client_name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <span style={{ fontFamily: 'Poppins', fontSize: '13px', color: '#334155' }}>{quote.client_name}</span>
                            </div>
                          </td>
                          <td>
                            <div style={{ fontFamily: 'Poppins', fontSize: '12px', color: '#475569' }}>{formatDate(quote.created_at)}</div>
                            <div style={{ fontFamily: 'Poppins', fontSize: '10px', color: '#94A3B8' }}>
                              Exp: {formatDate(quote.valid_until)}
                            </div>
                          </td>
                          <td>
                            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: '14px', color: '#2C5282' }}>{formatCurrency(quote.total_ttc)}</div>
                            <div style={{ fontFamily: 'Poppins', fontSize: '10px', color: '#94A3B8' }}>HT: {formatCurrency(quote.total_ht)}</div>
                          </td>
                          <td>
                            <span style={{ padding: '4px 10px', borderRadius: '20px', fontFamily: 'Poppins', fontWeight: 600, fontSize: '11px', background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                              {sc.label}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
                              <button
                                onClick={() => setSelectedQuote(quote)}
                                style={{ background: '#EBF4FF', border: 'none', borderRadius: '6px', width: '28px', height: '28px', cursor: 'pointer', color: '#2C5282', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                title="Voir le détail"
                              >
                                <Eye size={13} />
                              </button>
                              <button
                                onClick={() => onGeneratePDF(quote)}
                                style={{ background: '#FFFAF0', border: 'none', borderRadius: '6px', width: '28px', height: '28px', cursor: 'pointer', color: '#744210', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                title="Télécharger PDF"
                              >
                                <Download size={13} />
                              </button>
                              <button
                                onClick={() => { onLoadQuote(quote); }}
                                style={{ background: '#F0FFF4', border: 'none', borderRadius: '6px', width: '28px', height: '28px', cursor: 'pointer', color: '#276749', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                title="Dupliquer dans le simulateur"
                              >
                                <Copy size={13} />
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm(`Supprimer le devis ${quote.quote_number} ?`)) {
                                    onDeleteQuote(quote.id);
                                  }
                                }}
                                style={{ background: '#FFF5F5', border: 'none', borderRadius: '6px', width: '28px', height: '28px', cursor: 'pointer', color: '#E53E3E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                title="Supprimer"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ padding: '14px 20px', borderTop: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F8FAFC' }}>
                  <span style={{ fontFamily: 'Poppins', fontSize: '12px', color: '#64748B' }}>
                    Page {page} sur {totalPages} • {sorted.length} résultats
                  </span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #E2E8F0', background: page === 1 ? '#F8FAFC' : 'white', color: page === 1 ? '#CBD5E1' : '#475569', cursor: page === 1 ? 'not-allowed' : 'pointer', fontFamily: 'Poppins', fontSize: '12px', fontWeight: 600 }}
                    >
                      ← Précédent
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pg = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                      return (
                        <button
                          key={pg}
                          onClick={() => setPage(pg)}
                          style={{ padding: '6px 11px', borderRadius: '6px', border: `1px solid ${pg === page ? '#2C5282' : '#E2E8F0'}`, background: pg === page ? '#2C5282' : 'white', color: pg === page ? 'white' : '#475569', cursor: 'pointer', fontFamily: 'Poppins', fontSize: '12px', fontWeight: 600 }}
                        >
                          {pg}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #E2E8F0', background: page === totalPages ? '#F8FAFC' : 'white', color: page === totalPages ? '#CBD5E1' : '#475569', cursor: page === totalPages ? 'not-allowed' : 'pointer', fontFamily: 'Poppins', fontSize: '12px', fontWeight: 600 }}
                    >
                      Suivant →
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Quote Detail Modal */}
      {selectedQuote && (
        <QuoteDetailModal
          quote={selectedQuote}
          onClose={() => setSelectedQuote(null)}
          onUpdateStatus={onUpdateStatus}
          onLoadQuote={(q) => { onLoadQuote(q); setSelectedQuote(null); }}
          onGeneratePDF={onGeneratePDF}
          onDelete={(id) => { onDeleteQuote(id); setSelectedQuote(null); }}
        />
      )}
    </section>
  );
}

function QuoteDetailModal({ quote, onClose, onUpdateStatus, onLoadQuote, onGeneratePDF, onDelete }: {
  quote: Quote;
  onClose: () => void;
  onUpdateStatus: (id: string, status: QuoteStatus) => void;
  onLoadQuote: (q: Quote) => void;
  onGeneratePDF: (q: Quote) => void;
  onDelete: (id: string) => void;
}) {
  const sc = STATUS_CONFIG[quote.status as QuoteStatus] || STATUS_CONFIG.draft;

  // Group items by category
  const grouped: Record<string, typeof quote.items> = {};
  quote.items.forEach(item => {
    const cat = item.catalog_item.category;
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(item);
  });

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-content" style={{ maxWidth: '820px' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #1A365D, #2C5282)', padding: '22px 28px', borderRadius: '16px 16px 0 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: '18px', color: '#ED8936' }}>
              {quote.quote_number}
            </div>
            <div style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '20px', color: 'white', marginTop: '2px' }}>
              {quote.project_name}
            </div>
            <div style={{ fontFamily: 'Poppins', fontSize: '13px', color: 'rgba(255,255,255,0.65)', marginTop: '4px' }}>
              Client: {quote.client_name} • {formatDate(quote.created_at)}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ padding: '6px 14px', borderRadius: '20px', fontFamily: 'Poppins', fontWeight: 600, fontSize: '12px', background: sc.bg, color: sc.color }}>
              {sc.label}
            </span>
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              ×
            </button>
          </div>
        </div>

        <div style={{ padding: '24px 28px' }}>
          {/* Items by category */}
          {Object.entries(grouped).map(([cat, catItems]) => {
            const config = CATEGORY_CONFIG[cat as keyof typeof CATEGORY_CONFIG];
            if (!config) return null;
            const catTotal = catItems.reduce((s, i) => s + i.unit_price * i.quantity, 0);
            return (
              <div key={cat} style={{ marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ width: '3px', height: '18px', background: config.color, borderRadius: '2px' }} />
                  <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '13px', color: config.color }}>{config.label}</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#64748B', marginLeft: 'auto' }}>{formatCurrency(catTotal)}</span>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ background: config.bgColor }}>
                      <th style={{ padding: '6px 10px', textAlign: 'left', fontFamily: 'Poppins', fontWeight: 600, fontSize: '11px', color: config.color, borderBottom: `1px solid ${config.borderColor}` }}>Désignation</th>
                      <th style={{ padding: '6px 10px', textAlign: 'center', fontFamily: 'Poppins', fontWeight: 600, fontSize: '11px', color: config.color, borderBottom: `1px solid ${config.borderColor}` }}>Qté</th>
                      <th style={{ padding: '6px 10px', textAlign: 'right', fontFamily: 'Poppins', fontWeight: 600, fontSize: '11px', color: config.color, borderBottom: `1px solid ${config.borderColor}` }}>P.U. HT</th>
                      <th style={{ padding: '6px 10px', textAlign: 'right', fontFamily: 'Poppins', fontWeight: 600, fontSize: '11px', color: config.color, borderBottom: `1px solid ${config.borderColor}` }}>Total HT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {catItems.map(item => (
                      <tr key={item.id}>
                        <td style={{ padding: '7px 10px', fontFamily: 'Poppins', fontSize: '12px', color: '#334155', borderBottom: '1px solid #F1F5F9' }}>
                          {item.catalog_item.name}
                          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#94A3B8', marginLeft: '6px' }}>{item.catalog_item.reference}</span>
                        </td>
                        <td style={{ padding: '7px 10px', textAlign: 'center', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, fontSize: '12px', color: '#475569', borderBottom: '1px solid #F1F5F9' }}>{item.quantity} {item.catalog_item.unit}</td>
                        <td style={{ padding: '7px 10px', textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#475569', borderBottom: '1px solid #F1F5F9' }}>{formatCurrency(item.unit_price)}</td>
                        <td style={{ padding: '7px 10px', textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: '12px', color: '#2C5282', borderBottom: '1px solid #F1F5F9' }}>{formatCurrency(item.unit_price * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}

          {/* Financial summary */}
          <div style={{ background: 'linear-gradient(135deg, #1A365D, #2C5282)', borderRadius: '10px', padding: '16px 20px', marginTop: '8px' }}>
            {[
              { label: 'Matériaux HT', value: formatCurrency(quote.subtotal_ht), color: 'rgba(255,255,255,0.8)' },
              { label: `M.O. (${quote.labor_hours}h × ${quote.labor_rate} DT/h)`, value: formatCurrency(quote.labor_total), color: '#F6AD55' },
              { label: `Marge (${quote.margin_rate}%)`, value: formatCurrency(quote.margin_amount), color: '#68D391' },
              { label: 'Total HT', value: formatCurrency(quote.total_ht), color: 'white', bold: true },
              { label: 'TVA (19%)', value: formatCurrency(quote.tva_amount), color: 'rgba(255,255,255,0.6)' },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontFamily: 'Poppins', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>{row.label}</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: (row as any).bold ? 700 : 600, fontSize: '13px', color: row.color }}>{row.value}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '10px', marginTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '14px', color: 'white' }}>TOTAL TTC</span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, fontSize: '20px', color: '#ED8936' }}>{formatCurrency(quote.total_ttc)}</span>
            </div>
          </div>

          {/* Status actions */}
          <div style={{ marginTop: '16px' }}>
            <div style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '12px', color: '#475569', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Changer le statut
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {(Object.keys(STATUS_CONFIG) as QuoteStatus[]).map(s => {
                const sc = STATUS_CONFIG[s];
                return (
                  <button
                    key={s}
                    onClick={() => onUpdateStatus(quote.id, s)}
                    disabled={quote.status === s}
                    style={{
                      padding: '7px 14px', borderRadius: '8px', border: `1px solid ${sc.border}`,
                      background: quote.status === s ? sc.bg : 'white', color: sc.color,
                      fontFamily: 'Poppins', fontWeight: 600, fontSize: '12px', cursor: quote.status === s ? 'default' : 'pointer',
                      opacity: quote.status === s ? 1 : 0.7, transition: 'all 0.2s'
                    }}
                  >
                    {sc.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '18px', flexWrap: 'wrap', borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
            <button
              onClick={() => onGeneratePDF(quote)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #ED8936, #F6AD55)', color: 'white', cursor: 'pointer', fontFamily: 'Poppins', fontWeight: 600, fontSize: '13px' }}
            >
              <Download size={14} />
              Télécharger PDF
            </button>
            <button
              onClick={() => onLoadQuote(quote)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '8px', border: '1px solid #9AE6B4', background: '#F0FFF4', color: '#276749', cursor: 'pointer', fontFamily: 'Poppins', fontWeight: 600, fontSize: '13px' }}
            >
              <Copy size={14} />
              Dupliquer dans simulateur
            </button>
            <button
              onClick={() => { if (window.confirm('Supprimer ce devis ?')) onDelete(quote.id); }}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '8px', border: '1px solid #FEB2B2', background: '#FFF5F5', color: '#E53E3E', cursor: 'pointer', fontFamily: 'Poppins', fontWeight: 600, fontSize: '13px', marginLeft: 'auto' }}
            >
              <Trash2 size={14} />
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
