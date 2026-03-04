import { useState, useCallback, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider, useToastContext } from './contexts/ToastContext';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import CatalogSection from './components/CatalogSection';
import SimulatorSection from './components/SimulatorSection';
import DashboardSection from './components/DashboardSection';
import QuotesHistorySection from './components/QuotesHistorySection';
import CompanySettingsPage from './components/CompanySettingsPage';
import { generateQuotePDF } from './lib/pdfGenerator';
import type { CatalogItem, QuoteLineItem, Quote, CompanySettings, QuoteStatus } from './data';
import {
  DEFAULT_COMPANY_SETTINGS, generateQuoteNumber, calculateQuoteTotals,
  estimateLaborHours, CATALOG_ITEMS
} from './data';
import { supabase } from './lib/supabase';

type ActiveSection = 'hero' | 'catalog' | 'simulator' | 'history' | 'dashboard' | 'settings';

function AppContent() {
  const { user } = useAuth();
  const { toast } = useToastContext();
  const [activeSection, setActiveSection] = useState<ActiveSection>('hero');

  // Simulator state
  const [quoteItems, setQuoteItems] = useState<QuoteLineItem[]>([]);
  const [projectName, setProjectName] = useState('');
  const [clientName, setClientName] = useState('');
  const [marginRate, setMarginRate] = useState(25);
  const [laborRate, setLaborRate] = useState(45);

  // Company settings
  const [companySettings, setCompanySettings] = useState<CompanySettings>(DEFAULT_COMPANY_SETTINGS);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Saved quotes
  const [savedQuotes, setSavedQuotes] = useState<Quote[]>([]);
  const [isSavingQuote, setIsSavingQuote] = useState(false);

  // Load company settings from DB
  useEffect(() => {
    if (user) {
      loadCompanySettings();
      loadQuotes();
    } else {
      setSavedQuotes([]);
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // Apply default rates from company settings
  useEffect(() => {
    setMarginRate(companySettings.default_margin_rate);
    setLaborRate(companySettings.default_labor_rate);
  }, [companySettings.default_margin_rate, companySettings.default_labor_rate]);

  const loadCompanySettings = async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from('company_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();
      if (data) {
        setCompanySettings(prev => ({ ...prev, ...data }));
      }
    } catch {
      // Use defaults if no settings yet
    }
  };

  const loadQuotes = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (data && !error) {
        const parsed = data.map(q => ({
          ...q,
          items: typeof q.items === 'string' ? JSON.parse(q.items) : q.items,
        }));
        setSavedQuotes(parsed);
      }
    } catch (e) {
      console.error('Error loading quotes:', e);
      toast.networkError('Impossible de charger les devis.');
    }
  };

  const handleAddToQuote = useCallback((item: CatalogItem) => {
    setQuoteItems(prev => {
      const existing = prev.find(i => i.catalog_item_id === item.id);
      if (existing) {
        toast.itemAlreadyIn(item.name);
        return prev.map(i =>
          i.catalog_item_id === item.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      toast.itemAdded(item.name, () => setActiveSection('simulator'));
      const newItem: QuoteLineItem = {
        id: `line-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        catalog_item_id: item.id,
        catalog_item: item,
        quantity: 1,
        unit_price: item.price_ht,
        discount: 0,
      };
      return [...prev, newItem];
    });
  }, [toast]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStartSimulation = useCallback(({ projectName: pn, clientName: cn }: { projectName: string; clientName: string }) => {
    setProjectName(pn);
    setClientName(cn);
  }, []);

  const handleSaveCompanySettings = async (settings: CompanySettings) => {
    setIsSavingSettings(true);
    try {
      setCompanySettings(settings);
      if (user) {
        const { data: existing } = await supabase
          .from('company_settings')
          .select('id')
          .eq('user_id', user.id)
          .single();

        const payload = {
          user_id: user.id,
          name: settings.name,
          logo_url: settings.logo_url || null,
          address: settings.address,
          city: settings.city,
          postal_code: settings.postal_code,
          phone: settings.phone,
          email: settings.email,
          siret: settings.siret,
          insurance_number: settings.insurance_number || null,
          insurance_company: settings.insurance_company || null,
          default_margin_rate: settings.default_margin_rate,
          default_labor_rate: settings.default_labor_rate,
          payment_terms: settings.payment_terms,
          tva_rate: settings.tva_rate,
          website: settings.website || null,
          rib: settings.rib || null,
          updated_at: new Date().toISOString(),
        };

        if (existing) {
          const { error } = await supabase.from('company_settings').update(payload).eq('user_id', user.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('company_settings').insert({ ...payload, created_at: new Date().toISOString() });
          if (error) throw error;
        }
        toast.settingsSaved();
      } else {
        toast.settingsSaved();
      }
    } catch (err) {
      console.error('Error saving settings:', err);
      toast.networkError('Impossible de sauvegarder les paramètres.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleSaveQuote = async () => {
    if (quoteItems.length === 0) {
      toast.warning('Devis vide', { message: 'Ajoutez au moins un article avant de sauvegarder.' });
      return;
    }
    setIsSavingQuote(true);
    try {
      const laborHours = estimateLaborHours(quoteItems);
      const totals = calculateQuoteTotals(quoteItems, marginRate, laborRate, laborHours, companySettings.tva_rate);
      const quoteNumber = generateQuoteNumber();
      const now = new Date().toISOString();
      const validUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

      const quoteData: Quote = {
        id: `quote-${Date.now()}`,
        quote_number: quoteNumber,
        project_name: projectName || 'Projet sans nom',
        client_name: clientName || 'Client inconnu',
        client_email: '',
        client_phone: '',
        client_address: '',
        items: quoteItems,
        margin_rate: marginRate,
        labor_rate: laborRate,
        labor_hours: laborHours,
        notes: '',
        payment_terms: companySettings.payment_terms,
        status: 'draft' as QuoteStatus,
        created_at: now,
        updated_at: now,
        valid_until: validUntil,
        user_id: user?.id,
        ...totals,
      };

      if (user) {
        const { data, error } = await supabase
          .from('quotes')
          .insert({
            ...quoteData,
            items: JSON.stringify(quoteItems),
            user_id: user.id,
          })
          .select()
          .single();

        if (!error && data) {
          const saved = { ...data, items: quoteItems };
          setSavedQuotes(prev => [saved, ...prev]);
        } else {
          // Offline fallback
          setSavedQuotes(prev => [quoteData, ...prev]);
          toast.offline();
        }
      } else {
        setSavedQuotes(prev => [quoteData, ...prev]);
        toast.loginRequired(() => setActiveSection('hero'));
      }

      toast.quoteSaved(quoteNumber);
    } catch (err) {
      console.error('Error saving quote:', err);
      toast.networkError('La sauvegarde du devis a échoué.');
    } finally {
      setIsSavingQuote(false);
    }
  };

  const handleGeneratePDFFromSimulator = () => {
    if (quoteItems.length === 0) {
      toast.warning('Devis vide', { message: 'Ajoutez des articles avant de générer un PDF.' });
      return;
    }
    const laborHours = estimateLaborHours(quoteItems);
    const totals = calculateQuoteTotals(quoteItems, marginRate, laborRate, laborHours, companySettings.tva_rate);
    const now = new Date().toISOString();
    const quoteNumber = generateQuoteNumber();

    const quote: Quote = {
      id: 'preview',
      quote_number: quoteNumber,
      project_name: projectName || 'Projet',
      client_name: clientName || 'Client',
      client_email: '',
      client_phone: '',
      client_address: '',
      items: quoteItems,
      margin_rate: marginRate,
      labor_rate: laborRate,
      labor_hours: laborHours,
      notes: '',
      payment_terms: companySettings.payment_terms,
      status: 'draft',
      created_at: now,
      updated_at: now,
      valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      ...totals,
    };

    generateQuotePDF(quote, companySettings);
    toast.pdfGenerated(quoteNumber);
  };

  const handleGeneratePDFFromHistory = (quote: Quote) => {
    generateQuotePDF(quote, companySettings);
    toast.pdfGenerated(quote.quote_number);
  };

  const handleLoadQuote = (quote: Quote) => {
    setProjectName(quote.project_name);
    setClientName(quote.client_name);
    setMarginRate(quote.margin_rate);
    setLaborRate(quote.labor_rate);

    const items: QuoteLineItem[] = quote.items.map(item => {
      const catalogItem = CATALOG_ITEMS.find(c => c.id === item.catalog_item_id) || item.catalog_item;
      return {
        ...item,
        id: `line-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        catalog_item: catalogItem,
      };
    });

    setQuoteItems(items);
    setActiveSection('simulator');
    toast.info('Devis chargé', {
      message: `${quote.quote_number} — ${quote.project_name} (${items.length} article${items.length > 1 ? 's' : ''})`,
      duration: 3500,
    });
  };

  const handleDeleteQuote = async (id: string) => {
    const q = savedQuotes.find(s => s.id === id);
    setSavedQuotes(prev => prev.filter(s => s.id !== id));
    if (user) {
      const { error } = await supabase.from('quotes').delete().eq('id', id).eq('user_id', user.id);
      if (error) {
        toast.networkError('Impossible de supprimer le devis.');
        if (q) setSavedQuotes(prev => [q, ...prev]); // rollback
        return;
      }
    }
    toast.deleted(q ? `Devis ${q.quote_number} supprimé` : 'Devis supprimé');
  };

  const STATUS_LABELS: Record<QuoteStatus, string> = {
    draft: 'Brouillon',
    sent: 'Envoyé',
    accepted: 'Accepté',
    rejected: 'Refusé',
    expired: 'Expiré',
  };

  const handleUpdateQuoteStatus = async (id: string, status: QuoteStatus) => {
    setSavedQuotes(prev => prev.map(q => q.id === id ? { ...q, status } : q));
    if (user) {
      const { error } = await supabase
        .from('quotes')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user.id);
      if (error) {
        toast.networkError('Mise à jour du statut échouée.');
        return;
      }
    }
    toast.statusUpdated(STATUS_LABELS[status] ?? status);
  };

  const handleNavigate = useCallback((section: ActiveSection) => {
    setActiveSection(section);
    window.scrollTo({ top: 64, behavior: 'smooth' });
  }, []);

  const cartItemIds = quoteItems.map(i => i.catalog_item_id);

  const renderSection = () => {
    switch (activeSection) {
      case 'hero':
        return <HeroSection onNavigate={handleNavigate} onStartSimulation={handleStartSimulation} />;
      case 'catalog':
        return <CatalogSection onAddToQuote={handleAddToQuote} cartItemIds={cartItemIds} />;
      case 'simulator':
        return (
          <SimulatorSection
            items={quoteItems}
            setItems={setQuoteItems}
            projectName={projectName}
            setProjectName={setProjectName}
            clientName={clientName}
            setClientName={setClientName}
            marginRate={marginRate}
            setMarginRate={setMarginRate}
            laborRate={laborRate}
            setLaborRate={setLaborRate}
            onGeneratePDF={handleGeneratePDFFromSimulator}
            onSaveQuote={handleSaveQuote}
            isSaving={isSavingQuote}
          />
        );
      case 'dashboard':
        return (
          <DashboardSection
            items={quoteItems}
            marginRate={marginRate}
            laborRate={laborRate}
            savedQuotes={savedQuotes}
            onNavigate={handleNavigate}
          />
        );
      case 'history':
        return (
          <QuotesHistorySection
            quotes={savedQuotes}
            onLoadQuote={handleLoadQuote}
            onDeleteQuote={handleDeleteQuote}
            onUpdateStatus={handleUpdateQuoteStatus}
            onGeneratePDF={handleGeneratePDFFromHistory}
            isLoggedIn={!!user}
          />
        );
      case 'settings':
        return (
          <CompanySettingsPage
            settings={companySettings}
            onSave={handleSaveCompanySettings}
            isSaving={isSavingSettings}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>
      <Header
        activeSection={activeSection}
        onNavigate={handleNavigate}
        cartCount={quoteItems.length}
      />

      <main style={{ paddingTop: activeSection === 'hero' ? 0 : '64px' }}>
        {renderSection()}
      </main>

      {/* Footer */}
      {activeSection !== 'hero' && (
        <footer style={{ background: 'linear-gradient(135deg, #0F172A, #1A365D)', color: 'white', padding: '40px 24px', marginTop: '60px' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px' }}>
            <div>
              <div style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '20px', marginBottom: '10px' }}>
                GazNet<span style={{ color: '#ED8936' }}>Pro</span>
              </div>
              <p style={{ fontFamily: 'Poppins', fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.6', maxWidth: '280px' }}>
                Solution professionnelle de gestion d'installation gaz. Catalogue, devis, facturation et suivi de projets.
              </p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '14px', flexWrap: 'wrap' }}>
                {['NF EN 1057', 'DTU 61.1', 'NF EN 331', 'ISO 9001'].map(norm => (
                  <span key={norm} style={{ background: 'rgba(237,137,54,0.15)', border: '1px solid rgba(237,137,54,0.3)', borderRadius: '4px', padding: '3px 7px', fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#ED8936' }}>
                    {norm}
                  </span>
                ))}
              </div>
            </div>

            {[
              {
                title: 'Navigation', links: [
                  { label: 'Catalogue', action: () => handleNavigate('catalog') },
                  { label: 'Simulateur', action: () => handleNavigate('simulator') },
                  { label: 'Historique', action: () => handleNavigate('history') },
                  { label: 'Tableau de bord', action: () => handleNavigate('dashboard') },
                  { label: 'Paramètres', action: () => handleNavigate('settings') },
                ]
              },
              {
                title: 'Catalogue', links: [
                  { label: 'Tubes Cuivre 14-22mm', action: () => handleNavigate('catalog') },
                  { label: 'Raccords & Accessoires', action: () => handleNavigate('catalog') },
                  { label: 'Vannes & Robinets', action: () => handleNavigate('catalog') },
                  { label: 'Ventilation & Conduits', action: () => handleNavigate('catalog') },
                ]
              },
              {
                title: 'Normes', links: [
                  { label: 'NF EN 1057 – Tubes', action: () => {} },
                  { label: 'NF EN 331 – Robinets', action: () => {} },
                  { label: 'DTU 61.1 – Installation', action: () => {} },
                  { label: 'NF EN 88 – Détendeurs', action: () => {} },
                ]
              },
            ].map(col => (
              <div key={col.title}>
                <div style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '13px', color: 'rgba(255,255,255,0.9)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {col.title}
                </div>
                {col.links.map(link => (
                  <button
                    key={link.label}
                    onClick={link.action}
                    style={{ display: 'block', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Poppins', fontSize: '12px', color: 'rgba(255,255,255,0.55)', padding: '3px 0', textAlign: 'left', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#ED8936')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '32px', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontFamily: 'Poppins', fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
              © 2025 GazNetPro — Système professionnel de gestion installation gaz • Dinar Tunisien (DT)
            </span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
              v1.0.0 • {new Date().toLocaleDateString('fr-FR')}
            </span>
          </div>
        </footer>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}
