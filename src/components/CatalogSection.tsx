import { useState, useMemo } from 'react';
import {
  Search, Plus, ChevronDown, ChevronUp, Package,
  ShoppingCart, Info, Layers
} from 'lucide-react';
import type { CatalogItem, Category } from '../data';
import { CATALOG_ITEMS, CATEGORY_CONFIG, formatCurrency } from '../data';

interface CatalogSectionProps {
  onAddToQuote: (item: CatalogItem) => void;
  cartItemIds: string[];
}

const DIAMETER_OPTIONS = ['Tous', '14mm', '16mm', '18mm', '20mm', '22mm'];

export default function CatalogSection({ onAddToQuote, cartItemIds }: CatalogSectionProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');
  const [activeDiameter, setActiveDiameter] = useState('Tous');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [addedFlash, setAddedFlash] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    return CATALOG_ITEMS.filter(item => {
      const matchCat = activeCategory === 'all' || item.category === activeCategory;
      const matchDiam = activeDiameter === 'Tous' || item.diameter === activeDiameter;
      const searchLow = search.toLowerCase();
      const matchSearch = !search ||
        item.name.toLowerCase().includes(searchLow) ||
        item.reference.toLowerCase().includes(searchLow) ||
        item.description?.toLowerCase().includes(searchLow) ||
        item.diameter?.includes(searchLow);
      return matchCat && matchDiam && matchSearch;
    });
  }, [search, activeCategory, activeDiameter]);

  const countByCategory = useMemo(() => {
    const counts: Record<string, number> = { all: CATALOG_ITEMS.length };
    CATALOG_ITEMS.forEach(item => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, []);

  const handleAddToQuote = (item: CatalogItem) => {
    onAddToQuote(item);
    setAddedFlash(prev => new Set(prev).add(item.id));
    setTimeout(() => {
      setAddedFlash(prev => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    }, 1200);
  };

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getStockColor = (stock: number) => {
    if (stock > 100) return { color: '#276749', bg: '#F0FFF4' };
    if (stock > 30) return { color: '#744210', bg: '#FFFAF0' };
    return { color: '#C53030', bg: '#FFF5F5' };
  };

  // Group filtered items by category for display
  const grouped = useMemo(() => {
    const groups: Record<Category, CatalogItem[]> = {
      tubes: [], raccords: [], vannes: [], ventilation: []
    };
    filtered.forEach(item => groups[item.category].push(item));
    return groups;
  }, [filtered]);

  return (
    <section style={{ padding: '40px 0', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>

        {/* Section header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ background: 'linear-gradient(135deg, #2C5282, #3182CE)', borderRadius: '10px', padding: '8px' }}>
              <Package size={20} color="white" />
            </div>
            <div>
              <h2 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '26px', color: '#1E293B', margin: 0 }}>
                Catalogue Matériaux
              </h2>
              <p style={{ fontFamily: 'Poppins', fontSize: '14px', color: '#64748B', margin: 0 }}>
                {CATALOG_ITEMS.length} références • 4 catégories • Prix en DT HT
              </p>
            </div>
          </div>
        </div>

        {/* Filters bar */}
        <div style={{
          background: 'white', borderRadius: '14px', padding: '20px 24px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #E2E8F0',
          marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center'
        }}>
          {/* Search */}
          <div style={{ flex: '1', minWidth: '220px', position: 'relative' }}>
            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="input-field"
              style={{ paddingLeft: '38px', height: '40px' }}
              placeholder="Rechercher par nom, référence, diamètre..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Diameter filter */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {DIAMETER_OPTIONS.map(d => (
              <button
                key={d}
                onClick={() => setActiveDiameter(d)}
                style={{
                  padding: '7px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                  fontFamily: 'JetBrains Mono, monospace', fontWeight: activeDiameter === d ? 700 : 500,
                  fontSize: '12px', transition: 'all 0.2s',
                  background: activeDiameter === d ? '#2C5282' : '#F1F5F9',
                  color: activeDiameter === d ? 'white' : '#475569',
                }}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Results count */}
          <div style={{ fontFamily: 'Poppins', fontSize: '13px', color: '#64748B', whiteSpace: 'nowrap' }}>
            <span style={{ fontWeight: 700, color: '#2C5282' }}>{filtered.length}</span> résultats
          </div>
        </div>

        {/* Category tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveCategory('all')}
            style={{
              padding: '9px 18px', borderRadius: '10px', cursor: 'pointer',
              fontFamily: 'Poppins', fontWeight: 600, fontSize: '13px', transition: 'all 0.2s',
              background: activeCategory === 'all' ? '#1E293B' : 'white',
              color: activeCategory === 'all' ? 'white' : '#475569',
              boxShadow: activeCategory === 'all' ? '0 4px 12px rgba(30,41,59,0.2)' : '0 1px 4px rgba(0,0,0,0.06)',
              border: activeCategory === 'all' ? 'none' : '1px solid #E2E8F0'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Layers size={14} />
              Toutes
              <span style={{ background: 'rgba(255,255,255,0.2)', padding: '1px 7px', borderRadius: '10px', fontSize: '11px' }}>
                {countByCategory.all}
              </span>
            </span>
          </button>

          {(Object.keys(CATEGORY_CONFIG) as Category[]).map(cat => {
            const config = CATEGORY_CONFIG[cat];
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '9px 18px', borderRadius: '10px', cursor: 'pointer',
                  fontFamily: 'Poppins', fontWeight: 600, fontSize: '13px', transition: 'all 0.2s',
                  background: isActive ? config.color : 'white',
                  color: isActive ? 'white' : config.color,
                  boxShadow: isActive ? `0 4px 12px ${config.color}33` : '0 1px 4px rgba(0,0,0,0.06)',
                  border: isActive ? 'none' : `1px solid ${config.borderColor}`
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {config.label}
                  <span style={{
                    background: isActive ? 'rgba(255,255,255,0.25)' : config.bgColor,
                    padding: '1px 7px', borderRadius: '10px', fontSize: '11px',
                    color: isActive ? 'white' : config.color
                  }}>
                    {countByCategory[cat] || 0}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Items display - by category */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#94A3B8' }}>
            <Search size={48} style={{ margin: '0 auto 16px', display: 'block', opacity: 0.4 }} />
            <h3 style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '18px', color: '#64748B' }}>Aucun résultat</h3>
            <p style={{ fontFamily: 'Poppins', fontSize: '14px' }}>Modifiez vos filtres pour trouver des produits</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {(Object.keys(CATEGORY_CONFIG) as Category[]).map(cat => {
              const items = grouped[cat];
              if (items.length === 0) return null;
              const config = CATEGORY_CONFIG[cat];

              return (
                <div key={cat}>
                  {/* Category header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                    <div style={{ width: '4px', height: '28px', background: config.color, borderRadius: '2px' }} />
                    <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '16px', color: config.color, margin: 0 }}>
                      {config.label}
                    </h3>
                    <span style={{ background: config.bgColor, color: config.color, padding: '2px 10px', borderRadius: '12px', fontFamily: 'Poppins', fontWeight: 600, fontSize: '12px', border: `1px solid ${config.borderColor}` }}>
                      {items.length} article{items.length > 1 ? 's' : ''}
                    </span>
                    <p style={{ fontFamily: 'Poppins', fontSize: '12px', color: '#94A3B8', margin: 0 }}>
                      {config.description}
                    </p>
                  </div>

                  {/* Grid of items */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
                    {items.map((item, idx) => {
                      const isExpanded = expandedItems.has(item.id);
                      const isInCart = cartItemIds.includes(item.id);
                      const isFlashing = addedFlash.has(item.id);
                      const stockColors = item.stock !== undefined ? getStockColor(item.stock) : null;

                      return (
                        <div
                          key={item.id}
                          className="card-hover animate-fadeInUp"
                          style={{
                            background: 'white', borderRadius: '12px',
                            border: `1px solid ${isInCart ? config.borderColor : '#E2E8F0'}`,
                            boxShadow: isInCart ? `0 0 0 2px ${config.color}22` : '0 2px 8px rgba(0,0,0,0.04)',
                            overflow: 'hidden', transition: 'all 0.2s',
                            animationDelay: `${idx * 0.02}s`, opacity: 0, animationFillMode: 'forwards'
                          }}
                        >
                          {/* Card top bar */}
                          <div style={{ height: '3px', background: `linear-gradient(to right, ${config.color}, ${config.lightColor || config.color})` }} />

                          <div style={{ padding: '14px 16px' }}>
                            {/* Header row */}
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '13px', color: '#1E293B', lineHeight: '1.3', marginBottom: '4px' }}>
                                  {item.name}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#64748B', background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px' }}>
                                    {item.reference}
                                  </span>
                                  {item.diameter && (
                                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: config.color, background: config.bgColor, padding: '2px 6px', borderRadius: '4px', border: `1px solid ${config.borderColor}` }}>
                                      Ø {item.diameter}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Price and stock */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                              <div>
                                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: '17px', color: '#2C5282' }}>
                                  {formatCurrency(item.price_ht)}
                                </span>
                                <span style={{ fontFamily: 'Poppins', fontSize: '11px', color: '#94A3B8', marginLeft: '4px' }}>
                                  HT/{item.unit}
                                </span>
                              </div>
                              {item.stock !== undefined && stockColors && (
                                <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '11px', ...stockColors, padding: '2px 8px', borderRadius: '6px' }}>
                                  Stock: {item.stock}
                                </span>
                              )}
                            </div>

                            {/* Expandable specs */}
                            {(item.description || item.specs) && (
                              <div>
                                <button
                                  onClick={() => toggleExpand(item.id)}
                                  style={{
                                    display: 'flex', alignItems: 'center', gap: '4px',
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    fontFamily: 'Poppins', fontSize: '11px', color: '#94A3B8',
                                    padding: '0', marginBottom: isExpanded ? '8px' : '0'
                                  }}
                                >
                                  <Info size={12} />
                                  {isExpanded ? 'Masquer' : 'Spécifications'}
                                  {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                </button>

                                {isExpanded && (
                                  <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '10px', marginBottom: '8px', border: '1px solid #E2E8F0' }}>
                                    {item.description && (
                                      <p style={{ fontFamily: 'Poppins', fontSize: '11px', color: '#475569', margin: '0 0 8px', lineHeight: '1.5' }}>
                                        {item.description}
                                      </p>
                                    )}
                                    {item.specs && (
                                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                                        {Object.entries(item.specs).map(([key, val]) => (
                                          <div key={key} style={{ display: 'flex', justifyContent: 'space-between', gap: '4px' }}>
                                            <span style={{ fontFamily: 'Poppins', fontSize: '10px', color: '#94A3B8' }}>{key}:</span>
                                            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#334155', fontWeight: 600 }}>{val}</span>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Add to quote button */}
                            <button
                              onClick={() => handleAddToQuote(item)}
                              style={{
                                width: '100%', padding: '9px 14px', borderRadius: '8px',
                                border: 'none', cursor: 'pointer', transition: 'all 0.25s',
                                fontFamily: 'Poppins', fontWeight: 600, fontSize: '12px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                background: isFlashing
                                  ? '#F0FFF4'
                                  : isInCart
                                    ? config.bgColor
                                    : 'linear-gradient(135deg, #2C5282, #3182CE)',
                                color: isFlashing
                                  ? '#276749'
                                  : isInCart
                                    ? config.color
                                    : 'white',
                                boxShadow: !isInCart && !isFlashing ? '0 2px 8px rgba(44, 82, 130, 0.25)' : 'none',
                                transform: isFlashing ? 'scale(0.98)' : 'scale(1)',
                              }}
                            >
                              {isFlashing ? (
                                <>✓ Ajouté au devis</>
                              ) : isInCart ? (
                                <><ShoppingCart size={13} /> Déjà dans le devis</>
                              ) : (
                                <><Plus size={13} /> Ajouter au devis</>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
