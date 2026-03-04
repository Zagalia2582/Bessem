import { useState, useCallback } from 'react';
import {
  Calculator, Trash2, ChevronDown, ChevronUp, Plus, Minus,
  FileText, Save, GripVertical, Settings2, Clock,
  AlertTriangle, CheckCircle, RefreshCw, Tag
} from 'lucide-react';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates,
  useSortable, verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { QuoteLineItem, Category } from '../data';
import { CATEGORY_CONFIG, formatCurrency, calculateQuoteTotals, estimateLaborHours } from '../data';

interface SimulatorSectionProps {
  items: QuoteLineItem[];
  setItems: (items: QuoteLineItem[]) => void;
  projectName: string;
  setProjectName: (name: string) => void;
  clientName: string;
  setClientName: (name: string) => void;
  marginRate: number;
  setMarginRate: (rate: number) => void;
  laborRate: number;
  setLaborRate: (rate: number) => void;
  onGeneratePDF: () => void;
  onSaveQuote: () => void;
  defaultMarginRate?: number;
  defaultLaborRate?: number;
  defaultPaymentTerms?: string;
  isSaving?: boolean;
}

// Sortable item row
function SortableRow({ item, onUpdateQuantity, onUpdatePrice, onRemove, onUpdateDiscount }: {
  item: QuoteLineItem;
  onUpdateQuantity: (id: string, qty: number) => void;
  onUpdatePrice: (id: string, price: number) => void;
  onRemove: (id: string) => void;
  onUpdateDiscount: (id: string, discount: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 'auto',
  };

  const cat = item.catalog_item.category;
  const config = CATEGORY_CONFIG[cat];
  const lineTotal = item.unit_price * item.quantity * (1 - (item.discount || 0) / 100);

  return (
    <tr ref={setNodeRef} style={{ ...style as React.CSSProperties, background: isDragging ? '#F8FAFC' : 'white' }}>
      <td style={{ padding: '10px 8px', width: '32px' }}>
        <div {...attributes} {...listeners} className="drag-handle" style={{ cursor: 'grab', color: '#CBD5E1', display: 'flex', alignItems: 'center' }}>
          <GripVertical size={16} />
        </div>
      </td>
      <td style={{ padding: '10px 12px' }}>
        <div>
          <div style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '13px', color: '#1E293B' }}>
            {item.catalog_item.name}
          </div>
          <div style={{ display: 'flex', gap: '6px', marginTop: '3px' }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#64748B', background: '#F1F5F9', padding: '1px 6px', borderRadius: '3px' }}>
              {item.catalog_item.reference}
            </span>
            <span style={{
              fontFamily: 'Poppins', fontSize: '10px', padding: '1px 6px', borderRadius: '3px',
              background: config.bgColor, color: config.color, border: `1px solid ${config.borderColor}`
            }}>
              {config.label}
            </span>
            {item.catalog_item.diameter && (
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: config.color, background: config.bgColor, padding: '1px 6px', borderRadius: '3px' }}>
                Ø{item.catalog_item.diameter}
              </span>
            )}
          </div>
        </div>
      </td>
      <td style={{ padding: '10px 8px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
          <button
            onClick={() => onUpdateQuantity(item.id, Math.max(0.5, item.quantity - (item.catalog_item.unit === 'm' ? 1 : 1)))}
            style={{ background: '#F1F5F9', border: 'none', borderRadius: '5px', width: '26px', height: '26px', cursor: 'pointer', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Minus size={12} />
          </button>
          <input
            type="number"
            value={item.quantity}
            min={0.1}
            step={item.catalog_item.unit === 'm' ? 0.5 : 1}
            onChange={e => onUpdateQuantity(item.id, Math.max(0.1, parseFloat(e.target.value) || 0.1))}
            style={{
              width: '56px', textAlign: 'center', fontFamily: 'JetBrains Mono, monospace',
              fontWeight: 700, fontSize: '13px', border: '1px solid #E2E8F0', borderRadius: '6px',
              padding: '4px', color: '#1E293B', outline: 'none'
            }}
          />
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + (item.catalog_item.unit === 'm' ? 1 : 1))}
            style={{ background: '#EBF4FF', border: 'none', borderRadius: '5px', width: '26px', height: '26px', cursor: 'pointer', color: '#2C5282', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Plus size={12} />
          </button>
        </div>
        <div style={{ fontFamily: 'Poppins', fontSize: '10px', color: '#94A3B8', textAlign: 'center', marginTop: '2px' }}>
          {item.catalog_item.unit}
        </div>
      </td>
      <td style={{ padding: '10px 8px', textAlign: 'right' }}>
        <input
          type="number"
          value={item.unit_price}
          min={0}
          step={0.001}
          onChange={e => onUpdatePrice(item.id, parseFloat(e.target.value) || 0)}
          style={{
            width: '80px', textAlign: 'right', fontFamily: 'JetBrains Mono, monospace',
            fontWeight: 600, fontSize: '13px', border: '1px solid #E2E8F0', borderRadius: '6px',
            padding: '4px 6px', color: '#1E293B', outline: 'none'
          }}
        />
        <div style={{ fontFamily: 'Poppins', fontSize: '10px', color: '#94A3B8', textAlign: 'right', marginTop: '2px' }}>DT HT</div>
      </td>
      <td style={{ padding: '10px 8px', textAlign: 'right' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', justifyContent: 'flex-end' }}>
          <input
            type="number"
            value={item.discount || 0}
            min={0}
            max={50}
            step={1}
            onChange={e => onUpdateDiscount(item.id, Math.min(50, Math.max(0, parseFloat(e.target.value) || 0)))}
            style={{
              width: '44px', textAlign: 'center', fontFamily: 'JetBrains Mono, monospace',
              fontWeight: 600, fontSize: '12px', border: '1px solid #E2E8F0', borderRadius: '6px',
              padding: '4px', color: '#744210', outline: 'none'
            }}
          />
          <span style={{ fontFamily: 'Poppins', fontSize: '11px', color: '#744210' }}>%</span>
        </div>
      </td>
      <td style={{ padding: '10px 12px', textAlign: 'right' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: '14px', color: '#2C5282' }}>
          {formatCurrency(lineTotal)}
        </div>
      </td>
      <td style={{ padding: '10px 8px', textAlign: 'center' }}>
        <button
          onClick={() => onRemove(item.id)}
          style={{ background: '#FFF5F5', border: 'none', borderRadius: '6px', width: '28px', height: '28px', cursor: 'pointer', color: '#E53E3E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Trash2 size={13} />
        </button>
      </td>
    </tr>
  );
}

export default function SimulatorSection({
  items, setItems, projectName, setProjectName, clientName, setClientName,
  marginRate, setMarginRate, laborRate, setLaborRate,
  onGeneratePDF, onSaveQuote, isSaving = false
}: SimulatorSectionProps) {
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [laborHours, setLaborHours] = useState<number>(0);
  const [manualLaborHours, setManualLaborHours] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const estimatedHours = estimateLaborHours(items);
  const actualLaborHours = manualLaborHours ? laborHours : estimatedHours;

  const totals = calculateQuoteTotals(items, marginRate, laborRate, actualLaborHours, 19);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex(i => i.id === active.id);
      const newIndex = items.findIndex(i => i.id === over.id);
      setItems(arrayMove(items, oldIndex, newIndex));
    }
  };

  const updateQuantity = useCallback((id: string, qty: number) => {
    setItems(items.map(i => i.id === id ? { ...i, quantity: qty } : i));
  }, [items, setItems]);

  const updatePrice = useCallback((id: string, price: number) => {
    setItems(items.map(i => i.id === id ? { ...i, unit_price: price } : i));
  }, [items, setItems]);

  const updateDiscount = useCallback((id: string, discount: number) => {
    setItems(items.map(i => i.id === id ? { ...i, discount } : i));
  }, [items, setItems]);

  const removeItem = useCallback((id: string) => {
    setItems(items.filter(i => i.id !== id));
  }, [items, setItems]);

  const clearAll = () => {
    if (window.confirm('Vider le simulateur ? Cette action est irréversible.')) {
      setItems([]);
    }
  };

  // Group by category for subtotals
  const grouped: Partial<Record<Category, QuoteLineItem[]>> = {};
  items.forEach(item => {
    const cat = item.catalog_item.category;
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat]!.push(item);
  });

  const categorySubtotals: Partial<Record<Category, number>> = {};
  Object.entries(grouped).forEach(([cat, catItems]) => {
    categorySubtotals[cat as Category] = catItems!.reduce((sum, i) =>
      sum + i.unit_price * i.quantity * (1 - (i.discount || 0) / 100), 0
    );
  });

  return (
    <section style={{ padding: '40px 0', minHeight: '80vh' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>

        {/* Section header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'linear-gradient(135deg, #ED8936, #F6AD55)', borderRadius: '10px', padding: '8px' }}>
              <Calculator size={20} color="white" />
            </div>
            <div>
              <h2 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '26px', color: '#1E293B', margin: 0 }}>
                Simulateur de Devis
              </h2>
              <p style={{ fontFamily: 'Poppins', fontSize: '13px', color: '#64748B', margin: 0 }}>
                {items.length} article{items.length > 1 ? 's' : ''} • Calcul temps réel • Devise DT
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {items.length > 0 && (
              <button onClick={clearAll} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#FFF5F5', border: '1px solid #FEB2B2', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', color: '#E53E3E', fontFamily: 'Poppins', fontWeight: 600, fontSize: '13px' }}>
                <RefreshCw size={14} />
                Vider
              </button>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px', alignItems: 'start' }}>

          {/* Left: main form + items table */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Project info */}
            <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '15px', color: '#1E293B', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Tag size={16} color="#2C5282" />
                Informations du projet
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontFamily: 'Poppins', fontWeight: 600, fontSize: '12px', color: '#475569', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Nom du projet *
                  </label>
                  <input type="text" className="input-field" value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="Ex: Installation chaudière - Villa Manzeh" style={{ fontSize: '13px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontFamily: 'Poppins', fontWeight: 600, fontSize: '12px', color: '#475569', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Client</label>
                  <input type="text" className="input-field" value={clientName} onChange={e => setClientName(e.target.value)} placeholder="M. Ahmed Trabelsi" style={{ fontSize: '13px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontFamily: 'Poppins', fontWeight: 600, fontSize: '12px', color: '#475569', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Téléphone</label>
                  <input type="tel" className="input-field" value={clientPhone} onChange={e => setClientPhone(e.target.value)} placeholder="+216 XX XXX XXX" style={{ fontSize: '13px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontFamily: 'Poppins', fontWeight: 600, fontSize: '12px', color: '#475569', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Email</label>
                  <input type="email" className="input-field" value={clientEmail} onChange={e => setClientEmail(e.target.value)} placeholder="client@email.com" style={{ fontSize: '13px' }} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontFamily: 'Poppins', fontWeight: 600, fontSize: '12px', color: '#475569', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Adresse chantier</label>
                  <input type="text" className="input-field" value={clientAddress} onChange={e => setClientAddress(e.target.value)} placeholder="15 Rue de l'Énergie, Ariana 2080" style={{ fontSize: '13px' }} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontFamily: 'Poppins', fontWeight: 600, fontSize: '12px', color: '#475569', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Notes</label>
                  <textarea className="input-field" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Observations, conditions particulières..." rows={2} style={{ fontSize: '13px', resize: 'none' }} />
                </div>
              </div>
            </div>

            {/* Items table */}
            <div style={{ background: 'white', borderRadius: '14px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
              <div style={{ padding: '18px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '15px', color: '#1E293B', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calculator size={16} color="#2C5282" />
                  Lignes du devis
                  {items.length > 0 && <span style={{ background: '#EBF4FF', color: '#2C5282', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 700 }}>{items.length}</span>}
                </h3>
                <div style={{ fontFamily: 'Poppins', fontSize: '12px', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <GripVertical size={12} />
                  Glisser pour réordonner
                </div>
              </div>

              {items.length === 0 ? (
                <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                  <Calculator size={40} style={{ margin: '0 auto 12px', display: 'block', color: '#CBD5E1' }} />
                  <h4 style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '16px', color: '#94A3B8', margin: '0 0 6px' }}>
                    Devis vide
                  </h4>
                  <p style={{ fontFamily: 'Poppins', fontSize: '13px', color: '#CBD5E1', margin: 0 }}>
                    Ajoutez des articles depuis le catalogue pour commencer
                  </p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                      <table className="data-table" style={{ minWidth: '700px' }}>
                        <thead>
                          <tr>
                            <th style={{ width: '32px' }}></th>
                            <th>Désignation</th>
                            <th style={{ textAlign: 'center' }}>Qté</th>
                            <th style={{ textAlign: 'right' }}>P.U. HT</th>
                            <th style={{ textAlign: 'right' }}>Remise</th>
                            <th style={{ textAlign: 'right' }}>Total HT</th>
                            <th style={{ width: '40px' }}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map(item => (
                            <SortableRow
                              key={item.id}
                              item={item}
                              onUpdateQuantity={updateQuantity}
                              onUpdatePrice={updatePrice}
                              onRemove={removeItem}
                              onUpdateDiscount={updateDiscount}
                            />
                          ))}
                        </tbody>
                      </table>
                    </SortableContext>
                  </DndContext>
                </div>
              )}

              {/* Category subtotals */}
              {items.length > 0 && Object.keys(grouped).length > 1 && (
                <div style={{ padding: '16px 20px', borderTop: '1px solid #E2E8F0', background: '#F8FAFC' }}>
                  <div style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '12px', color: '#475569', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Sous-totaux par catégorie
                  </div>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {(Object.entries(categorySubtotals) as [Category, number][]).map(([cat, subtotal]) => {
                      const config = CATEGORY_CONFIG[cat];
                      return (
                        <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: config.bgColor, borderRadius: '8px', padding: '6px 12px', border: `1px solid ${config.borderColor}` }}>
                          <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '11px', color: config.color }}>{config.label}</span>
                          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: '12px', color: config.color }}>{formatCurrency(subtotal)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: settings + totals */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '80px' }}>

            {/* Rate settings */}
            <div style={{ background: 'white', borderRadius: '14px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #E2E8F0' }}>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '14px', color: '#1E293B', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Settings2 size={15} color="#2C5282" />
                  Paramètres de calcul
                </h3>
                {showAdvanced ? <ChevronUp size={16} color="#64748B" /> : <ChevronDown size={16} color="#64748B" />}
              </button>

              {showAdvanced && (
                <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Margin slider */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <label style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '12px', color: '#475569' }}>Taux de marge</label>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: '13px', color: '#276749' }}>{marginRate}%</span>
                    </div>
                    <input
                      type="range" min={0} max={60} step={1} value={marginRate}
                      onChange={e => setMarginRate(parseInt(e.target.value))}
                      style={{ width: '100%', accentColor: '#276749' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Poppins', fontSize: '10px', color: '#94A3B8' }}>
                      <span>0%</span><span>60%</span>
                    </div>
                  </div>

                  {/* Labor rate */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <label style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '12px', color: '#475569' }}>Taux horaire main d'œuvre</label>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: '13px', color: '#744210' }}>{laborRate} DT/h</span>
                    </div>
                    <input
                      type="range" min={20} max={100} step={1} value={laborRate}
                      onChange={e => setLaborRate(parseInt(e.target.value))}
                      style={{ width: '100%', accentColor: '#744210' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Poppins', fontSize: '10px', color: '#94A3B8' }}>
                      <span>20 DT/h</span><span>100 DT/h</span>
                    </div>
                  </div>

                  {/* Labor hours */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <label style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '12px', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} />
                        Heures main d'œuvre
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                        <input type="checkbox" checked={manualLaborHours} onChange={e => setManualLaborHours(e.target.checked)} style={{ accentColor: '#2C5282' }} />
                        <span style={{ fontFamily: 'Poppins', fontSize: '11px', color: '#64748B' }}>Manuel</span>
                      </label>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="number" min={0} step={0.5}
                        value={manualLaborHours ? laborHours : estimatedHours}
                        onChange={e => { setManualLaborHours(true); setLaborHours(parseFloat(e.target.value) || 0); }}
                        style={{ flex: 1, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: '14px', border: '1.5px solid #E2E8F0', borderRadius: '8px', padding: '8px 12px', color: '#1E293B', outline: 'none' }}
                      />
                      <span style={{ fontFamily: 'Poppins', fontSize: '12px', color: '#64748B' }}>heures</span>
                    </div>
                    {!manualLaborHours && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                        <CheckCircle size={11} color="#276749" />
                        <span style={{ fontFamily: 'Poppins', fontSize: '10px', color: '#276749' }}>Estimé automatiquement</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {!showAdvanced && (
                <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div style={{ background: '#F0FFF4', borderRadius: '8px', padding: '8px 12px', border: '1px solid #9AE6B4' }}>
                    <div style={{ fontFamily: 'Poppins', fontSize: '10px', color: '#276749' }}>Marge</div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: '15px', color: '#276749' }}>{marginRate}%</div>
                  </div>
                  <div style={{ background: '#FFFAF0', borderRadius: '8px', padding: '8px 12px', border: '1px solid #FBD38D' }}>
                    <div style={{ fontFamily: 'Poppins', fontSize: '10px', color: '#744210' }}>M.O.</div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: '15px', color: '#744210' }}>{laborRate} DT/h</div>
                  </div>
                </div>
              )}
            </div>

            {/* Totals card */}
            <div style={{ background: 'linear-gradient(135deg, #1A365D, #2C5282)', borderRadius: '14px', padding: '22px', boxShadow: '0 8px 30px rgba(44, 82, 130, 0.3)' }}>
              <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '14px', color: 'rgba(255,255,255,0.8)', margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Récapitulatif financier
              </h3>

              {[
                { label: 'Matériaux HT', value: totals.subtotal_ht, color: 'rgba(255,255,255,0.9)' },
                { label: `Main d'œuvre (${actualLaborHours}h × ${laborRate} DT)`, value: totals.labor_total, color: '#F6AD55' },
                { label: `Marge (${marginRate}%)`, value: totals.margin_amount, color: '#68D391' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontFamily: 'Poppins', fontSize: '12px', color: 'rgba(255,255,255,0.65)' }}>{row.label}</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, fontSize: '13px', color: row.color }}>{formatCurrency(row.value)}</span>
                </div>
              ))}

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px', marginTop: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontFamily: 'Poppins', fontSize: '13px', color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>Total HT</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: '15px', color: 'white' }}>{formatCurrency(totals.total_ht)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontFamily: 'Poppins', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>TVA (19%)</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>{formatCurrency(totals.tva_amount)}</span>
                </div>
              </div>

              <div style={{ background: 'rgba(237, 137, 54, 0.2)', borderRadius: '10px', padding: '14px', border: '1px solid rgba(237, 137, 54, 0.3)' }}>
                <div style={{ fontFamily: 'Poppins', fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  TOTAL TTC
                </div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, fontSize: '26px', color: '#ED8936' }}>
                  {formatCurrency(totals.total_ttc)}
                </div>
                <div style={{ fontFamily: 'Poppins', fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
                  Validité: 30 jours
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {items.length === 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FFFAF0', borderRadius: '10px', padding: '12px 14px', border: '1px solid #FBD38D' }}>
                  <AlertTriangle size={15} color="#ED8936" />
                  <span style={{ fontFamily: 'Poppins', fontSize: '12px', color: '#744210' }}>Ajoutez des articles pour générer un devis</span>
                </div>
              )}

              <button
                onClick={onGeneratePDF}
                disabled={items.length === 0}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  padding: '13px', borderRadius: '10px', border: 'none', cursor: items.length === 0 ? 'not-allowed' : 'pointer',
                  background: items.length === 0 ? '#E2E8F0' : 'linear-gradient(135deg, #ED8936, #F6AD55)',
                  color: items.length === 0 ? '#94A3B8' : 'white',
                  fontFamily: 'Poppins', fontWeight: 700, fontSize: '14px',
                  boxShadow: items.length > 0 ? '0 4px 15px rgba(237, 137, 54, 0.35)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                <FileText size={16} />
                Générer le devis PDF
              </button>

              <button
                onClick={onSaveQuote}
                disabled={items.length === 0 || isSaving}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  padding: '11px', borderRadius: '10px', border: '2px solid #2C5282',
                  cursor: items.length === 0 ? 'not-allowed' : 'pointer',
                  background: 'transparent', color: items.length === 0 ? '#CBD5E1' : '#2C5282',
                  fontFamily: 'Poppins', fontWeight: 700, fontSize: '14px',
                  borderColor: items.length === 0 ? '#E2E8F0' : '#2C5282',
                  transition: 'all 0.2s'
                }}
              >
                {isSaving ? (
                  <><div style={{ width: '14px', height: '14px', border: '2px solid rgba(44,82,130,0.3)', borderTopColor: '#2C5282', borderRadius: '50%' }} className="animate-spin" /> Sauvegarde...</>
                ) : (
                  <><Save size={16} />Sauvegarder le devis</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
