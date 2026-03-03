import React, { useState } from 'react';
import {
  Settings, Save, Building2, Phone,
  Shield, RefreshCw, DollarSign,
  CheckCircle, AlertCircle
} from 'lucide-react';
import type { CompanySettings } from '../data';
import { DEFAULT_COMPANY_SETTINGS } from '../data';

interface CompanySettingsPageProps {
  settings: CompanySettings;
  onSave: (settings: CompanySettings) => Promise<void>;
  isSaving?: boolean;
}

export default function CompanySettingsPage({ settings, onSave, isSaving = false }: CompanySettingsPageProps) {
  const [form, setForm] = useState<CompanySettings>({ ...settings });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const update = (key: keyof CompanySettings, value: string | number) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await onSave(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError('Erreur lors de la sauvegarde. Veuillez réessayer.');
    }
  };

  const resetToDefault = () => {
    if (window.confirm('Réinitialiser tous les paramètres aux valeurs par défaut ?')) {
      setForm({ ...DEFAULT_COMPANY_SETTINGS });
    }
  };

  const InputField = ({ label, value, onChange, type = 'text', placeholder = '', required = false, help = '' }: {
    label: string; value: string | number; onChange: (v: string) => void;
    type?: string; placeholder?: string; required?: boolean; help?: string;
  }) => (
    <div>
      <label style={{ display: 'block', fontFamily: 'Poppins', fontWeight: 600, fontSize: '12px', color: '#475569', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {label} {required && <span style={{ color: '#E53E3E' }}>*</span>}
      </label>
      <input
        type={type}
        className="input-field"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        style={{ fontSize: '13px' }}
      />
      {help && <p style={{ fontFamily: 'Poppins', fontSize: '11px', color: '#94A3B8', margin: '4px 0 0' }}>{help}</p>}
    </div>
  );

  return (
    <section style={{ padding: '40px 0', minHeight: '80vh' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>

        {/* Section header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'linear-gradient(135deg, #2C5282, #3182CE)', borderRadius: '10px', padding: '8px' }}>
              <Settings size={20} color="white" />
            </div>
            <div>
              <h2 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '26px', color: '#1E293B', margin: 0 }}>
                Paramètres Société
              </h2>
              <p style={{ fontFamily: 'Poppins', fontSize: '13px', color: '#64748B', margin: 0 }}>
                Configurez les informations de votre entreprise pour vos devis
              </p>
            </div>
          </div>
          <button
            onClick={resetToDefault}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', color: '#475569', fontFamily: 'Poppins', fontWeight: 600, fontSize: '12px' }}
          >
            <RefreshCw size={13} />
            Réinitialiser
          </button>
        </div>

        <form onSubmit={handleSave}>
          {/* Company identity */}
          <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #E2E8F0', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #F1F5F9' }}>
              <Building2 size={16} color="#2C5282" />
              <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '15px', color: '#1E293B', margin: 0 }}>Identité de l'entreprise</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <InputField label="Nom de la société" value={form.name} onChange={v => update('name', v)} placeholder="GazTech Pro Tunisie" required help="Ce nom apparaîtra sur tous vos devis" />
              </div>

              {/* Logo URL */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontFamily: 'Poppins', fontWeight: 600, fontSize: '12px', color: '#475569', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  URL du logo
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="url"
                    className="input-field"
                    value={form.logo_url || ''}
                    onChange={e => update('logo_url', e.target.value)}
                    placeholder="https://votre-site.tn/logo.png"
                    style={{ flex: 1, fontSize: '13px' }}
                  />
                  {form.logo_url && (
                    <div style={{ width: '42px', height: '42px', borderRadius: '8px', border: '1px solid #E2E8F0', overflow: 'hidden', flexShrink: 0 }}>
                      <img
                        src={form.logo_url}
                        alt="Logo preview"
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                  )}
                </div>
                <p style={{ fontFamily: 'Poppins', fontSize: '11px', color: '#94A3B8', margin: '4px 0 0' }}>Lien direct vers votre logo (PNG, JPG, SVG)</p>
              </div>

              <InputField label="Adresse" value={form.address} onChange={v => update('address', v)} placeholder="15 Rue de l'Énergie" required />
              <InputField label="Ville" value={form.city} onChange={v => update('city', v)} placeholder="Tunis" required />
              <InputField label="Code postal" value={form.postal_code} onChange={v => update('postal_code', v)} placeholder="1002" />
              <InputField label="Site web" value={form.website || ''} onChange={v => update('website', v)} placeholder="www.votre-site.tn" />
            </div>
          </div>

          {/* Contact info */}
          <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #E2E8F0', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #F1F5F9' }}>
              <Phone size={16} color="#2C5282" />
              <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '15px', color: '#1E293B', margin: 0 }}>Coordonnées</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <InputField label="Téléphone" value={form.phone} onChange={v => update('phone', v)} placeholder="+216 71 000 000" required type="tel" />
              <InputField label="Email" value={form.email} onChange={v => update('email', v)} placeholder="contact@votre-societe.tn" required type="email" />
            </div>
          </div>

          {/* Legal info */}
          <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #E2E8F0', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #F1F5F9' }}>
              <Shield size={16} color="#2C5282" />
              <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '15px', color: '#1E293B', margin: 0 }}>Informations légales</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <InputField label="Numéro SIRET / Matricule fiscal" value={form.siret} onChange={v => update('siret', v)} placeholder="12345678900012" help="Numéro d'identification fiscale" />
              <InputField label="RIB / IBAN" value={form.rib || ''} onChange={v => update('rib', v)} placeholder="TN59 1000 0000 0000 0000" help="Pour les modalités de paiement" />
              <InputField label="Compagnie d'assurance" value={form.insurance_company || ''} onChange={v => update('insurance_company', v)} placeholder="STAR Assurances" />
              <InputField label="Numéro de police d'assurance" value={form.insurance_number || ''} onChange={v => update('insurance_number', v)} placeholder="RC-2024-0001" />
            </div>
          </div>

          {/* Billing defaults */}
          <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #E2E8F0', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #F1F5F9' }}>
              <DollarSign size={16} color="#2C5282" />
              <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '15px', color: '#1E293B', margin: 0 }}>Paramètres de facturation par défaut</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontFamily: 'Poppins', fontWeight: 600, fontSize: '12px', color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Taux de marge par défaut
                </label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="range" min={0} max={60} step={1} value={form.default_margin_rate}
                    onChange={e => update('default_margin_rate', parseInt(e.target.value))}
                    style={{ flex: 1, accentColor: '#276749' }}
                  />
                  <div style={{ background: '#F0FFF4', borderRadius: '8px', padding: '6px 12px', border: '1px solid #9AE6B4', minWidth: '52px', textAlign: 'center' }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: '14px', color: '#276749' }}>{form.default_margin_rate}%</span>
                  </div>
                </div>
                <p style={{ fontFamily: 'Poppins', fontSize: '11px', color: '#94A3B8', margin: '4px 0 0' }}>Pré-rempli dans chaque nouveau devis</p>
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'Poppins', fontWeight: 600, fontSize: '12px', color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Taux horaire M.O. par défaut
                </label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="range" min={20} max={100} step={1} value={form.default_labor_rate}
                    onChange={e => update('default_labor_rate', parseInt(e.target.value))}
                    style={{ flex: 1, accentColor: '#744210' }}
                  />
                  <div style={{ background: '#FFFAF0', borderRadius: '8px', padding: '6px 12px', border: '1px solid #FBD38D', minWidth: '70px', textAlign: 'center' }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: '14px', color: '#744210' }}>{form.default_labor_rate} DT</span>
                  </div>
                </div>
                <p style={{ fontFamily: 'Poppins', fontSize: '11px', color: '#94A3B8', margin: '4px 0 0' }}>Dinar Tunisien par heure</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontFamily: 'Poppins', fontWeight: 600, fontSize: '12px', color: '#475569', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Taux TVA (%)
                </label>
                <input
                  type="number" min={0} max={30} step={1} value={form.tva_rate}
                  onChange={e => update('tva_rate', parseInt(e.target.value))}
                  className="input-field"
                  style={{ fontSize: '13px' }}
                />
                <p style={{ fontFamily: 'Poppins', fontSize: '11px', color: '#94A3B8', margin: '4px 0 0' }}>TVA Tunisie standard : 19%</p>
              </div>
            </div>

            <div style={{ marginTop: '16px' }}>
              <label style={{ display: 'block', fontFamily: 'Poppins', fontWeight: 600, fontSize: '12px', color: '#475569', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Conditions de paiement par défaut
              </label>
              <textarea
                className="input-field"
                value={form.payment_terms}
                onChange={e => update('payment_terms', e.target.value)}
                placeholder="Paiement à 30 jours - Virement bancaire ou chèque"
                rows={3}
                style={{ fontSize: '13px', resize: 'vertical' }}
              />
              <p style={{ fontFamily: 'Poppins', fontSize: '11px', color: '#94A3B8', margin: '4px 0 0' }}>Ces conditions apparaîtront automatiquement sur vos devis PDF</p>
            </div>
          </div>

          {/* Save actions */}
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FFF5F5', border: '1px solid #FEB2B2', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px' }}>
              <AlertCircle size={16} color="#E53E3E" />
              <span style={{ fontFamily: 'Poppins', fontSize: '13px', color: '#C53030' }}>{error}</span>
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            {saved && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#276749', fontFamily: 'Poppins', fontSize: '13px', fontWeight: 600, background: '#F0FFF4', padding: '10px 16px', borderRadius: '8px', border: '1px solid #9AE6B4' }}>
                <CheckCircle size={15} />
                Paramètres sauvegardés !
              </div>
            )}
            <button
              type="submit"
              disabled={isSaving}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '12px 28px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                background: isSaving ? '#94A3B8' : 'linear-gradient(135deg, #2C5282, #3182CE)',
                color: 'white', fontFamily: 'Poppins', fontWeight: 700, fontSize: '14px',
                boxShadow: isSaving ? 'none' : '0 4px 15px rgba(44, 82, 130, 0.35)',
                transition: 'all 0.2s'
              }}
            >
              {isSaving ? (
                <><div style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }} className="animate-spin" /> Sauvegarde...</>
              ) : (
                <><Save size={16} />Sauvegarder les paramètres</>
              )}
            </button>
          </div>
        </form>

        {/* Preview card */}
        <div style={{ marginTop: '24px', background: 'linear-gradient(135deg, #1A365D, #2C5282)', borderRadius: '14px', padding: '22px', boxShadow: '0 8px 25px rgba(44,82,130,0.3)' }}>
          <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '14px', color: 'rgba(255,255,255,0.8)', margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Aperçu en-tête devis PDF
          </h3>
          <div style={{ background: 'white', borderRadius: '10px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '18px', color: '#1A365D' }}>{form.name}</div>
              <div style={{ fontFamily: 'Poppins', fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                {form.address} • {form.postal_code} {form.city}
              </div>
              <div style={{ fontFamily: 'Poppins', fontSize: '12px', color: '#64748B' }}>
                {form.phone} • {form.email}
              </div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>
                SIRET: {form.siret} • TVA: {form.tva_rate}%
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '13px', color: '#ED8936' }}>DEVIS N° DEV-XXXXXXXX-XXXX</div>
              <div style={{ fontFamily: 'Poppins', fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>Validité: 30 jours</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#94A3B8' }}>Marge: {form.default_margin_rate}% • M.O.: {form.default_labor_rate} DT/h</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
