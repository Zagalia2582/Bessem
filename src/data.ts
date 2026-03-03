// ==================== TYPES ====================

export type Category = 'tubes' | 'raccords' | 'vannes' | 'ventilation';

export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';

export interface CatalogItem {
  id: string;
  category: Category;
  name: string;
  reference: string;
  unit: string;
  price_ht: number;
  diameter?: string;
  description?: string;
  stock?: number;
  specs?: Record<string, string>;
}

export interface QuoteLineItem {
  id: string;
  catalog_item_id: string;
  catalog_item: CatalogItem;
  quantity: number;
  unit_price: number;
  discount?: number;
}

export interface Quote {
  id: string;
  quote_number: string;
  project_name: string;
  client_name: string;
  client_email?: string;
  client_phone?: string;
  client_address?: string;
  items: QuoteLineItem[];
  margin_rate: number;
  labor_rate: number;
  labor_hours: number;
  notes?: string;
  payment_terms?: string;
  status: QuoteStatus;
  created_at: string;
  updated_at: string;
  valid_until: string;
  user_id?: string;
  subtotal_ht: number;
  labor_total: number;
  margin_amount: number;
  total_ht: number;
  tva_amount: number;
  total_ttc: number;
}

export interface CompanySettings {
  id?: string;
  name: string;
  logo_url?: string;
  address: string;
  city: string;
  postal_code: string;
  phone: string;
  email: string;
  siret: string;
  insurance_number?: string;
  insurance_company?: string;
  default_margin_rate: number;
  default_labor_rate: number;
  payment_terms: string;
  tva_rate: number;
  website?: string;
  rib?: string;
}

export interface DashboardStats {
  total_quotes: number;
  total_revenue: number;
  avg_quote_value: number;
  acceptance_rate: number;
  materials_total: number;
  labor_total: number;
  margin_total: number;
}

// ==================== CATALOG DATA ====================

export const CATALOG_ITEMS: CatalogItem[] = [
  // ===== TUBES CUIVRE =====
  {
    id: 't-22-1', category: 'tubes', name: 'Tube cuivre 22mm en couronne 25m', reference: 'TC22-25',
    unit: 'm', price_ht: 35, diameter: '22mm', stock: 150,
    description: 'Tube cuivre recuit pour installation gaz naturel - NF EN 1057',
    specs: { 'Diamètre ext.': '22mm', 'Épaisseur': '1mm', 'Norme': 'NF EN 1057', 'Pression max': '16 bar' }
  },
  {
    id: 't-22-2', category: 'tubes', name: 'Tube cuivre 22mm barre 3m', reference: 'TC22-3',
    unit: 'm', price_ht: 35, diameter: '22mm', stock: 80,
    description: 'Tube cuivre rigide 3m - installation visible',
    specs: { 'Diamètre ext.': '22mm', 'Épaisseur': '1mm', 'Longueur barre': '3m', 'Norme': 'NF EN 1057' }
  },
  {
    id: 't-20-1', category: 'tubes', name: 'Tube cuivre 20mm en couronne 25m', reference: 'TC20-25',
    unit: 'm', price_ht: 30, diameter: '20mm', stock: 200,
    description: 'Tube cuivre recuit DN20 - réseau principal',
    specs: { 'Diamètre ext.': '20mm', 'Épaisseur': '1mm', 'Norme': 'NF EN 1057', 'Pression max': '16 bar' }
  },
  {
    id: 't-20-2', category: 'tubes', name: 'Tube cuivre 20mm barre 3m', reference: 'TC20-3',
    unit: 'm', price_ht: 30, diameter: '20mm', stock: 100,
    description: 'Tube cuivre rigide DN20 barre 3m',
    specs: { 'Diamètre ext.': '20mm', 'Épaisseur': '1mm', 'Longueur barre': '3m', 'Norme': 'NF EN 1057' }
  },
  {
    id: 't-18-1', category: 'tubes', name: 'Tube cuivre 18mm en couronne 25m', reference: 'TC18-25',
    unit: 'm', price_ht: 28, diameter: '18mm', stock: 175,
    description: 'Tube cuivre recuit DN18 - distribution secondaire',
    specs: { 'Diamètre ext.': '18mm', 'Épaisseur': '1mm', 'Norme': 'NF EN 1057', 'Pression max': '16 bar' }
  },
  {
    id: 't-18-2', category: 'tubes', name: 'Tube cuivre 18mm barre 3m', reference: 'TC18-3',
    unit: 'm', price_ht: 28, diameter: '18mm', stock: 90,
    description: 'Tube cuivre rigide DN18 barre 3m',
    specs: { 'Diamètre ext.': '18mm', 'Épaisseur': '1mm', 'Longueur barre': '3m', 'Norme': 'NF EN 1057' }
  },
  {
    id: 't-16-1', category: 'tubes', name: 'Tube cuivre 16mm en couronne 25m', reference: 'TC16-25',
    unit: 'm', price_ht: 26, diameter: '16mm', stock: 220,
    description: 'Tube cuivre recuit DN16 - alimentation appareils',
    specs: { 'Diamètre ext.': '16mm', 'Épaisseur': '1mm', 'Norme': 'NF EN 1057', 'Pression max': '16 bar' }
  },
  {
    id: 't-16-2', category: 'tubes', name: 'Tube cuivre 16mm barre 3m', reference: 'TC16-3',
    unit: 'm', price_ht: 26, diameter: '16mm', stock: 110,
    description: 'Tube cuivre rigide DN16 barre 3m',
    specs: { 'Diamètre ext.': '16mm', 'Épaisseur': '1mm', 'Longueur barre': '3m', 'Norme': 'NF EN 1057' }
  },
  {
    id: 't-14-1', category: 'tubes', name: 'Tube cuivre 14mm en couronne 25m', reference: 'TC14-25',
    unit: 'm', price_ht: 22, diameter: '14mm', stock: 300,
    description: 'Tube cuivre recuit DN14 - terminaisons appareils',
    specs: { 'Diamètre ext.': '14mm', 'Épaisseur': '1mm', 'Norme': 'NF EN 1057', 'Pression max': '16 bar' }
  },
  {
    id: 't-14-2', category: 'tubes', name: 'Tube cuivre 14mm barre 3m', reference: 'TC14-3',
    unit: 'm', price_ht: 22, diameter: '14mm', stock: 150,
    description: 'Tube cuivre rigide DN14 barre 3m',
    specs: { 'Diamètre ext.': '14mm', 'Épaisseur': '1mm', 'Longueur barre': '3m', 'Norme': 'NF EN 1057' }
  },

  // ===== RACCORDS & ACCESSOIRES =====
  // Coudes 22mm
  { id: 'r-c22-90', category: 'raccords', name: 'Coude 90° cuivre 22mm à souder', reference: 'CDE22-90S', unit: 'pce', price_ht: 1.80, diameter: '22mm', stock: 500, description: 'Coude 90° cuivre pour soudure capillaire', specs: { 'Angle': '90°', 'Diamètre': '22mm', 'Raccordement': 'Capillaire', 'Norme': 'NF EN 1254-1' } },
  { id: 'r-c22-45', category: 'raccords', name: 'Coude 45° cuivre 22mm à souder', reference: 'CDE22-45S', unit: 'pce', price_ht: 1.95, diameter: '22mm', stock: 300, description: 'Coude 45° cuivre capillaire', specs: { 'Angle': '45°', 'Diamètre': '22mm', 'Raccordement': 'Capillaire' } },
  { id: 'r-c22-f', category: 'raccords', name: 'Coude 90° cuivre 22mm F/F laiton', reference: 'CDE22-90FF', unit: 'pce', price_ht: 4.50, diameter: '22mm', stock: 200, description: 'Coude laiton 90° femelle-femelle 22mm', specs: { 'Angle': '90°', 'Matière': 'Laiton', 'Raccordement': 'F/F compression' } },
  // Tés 22mm
  { id: 'r-t22-eg', category: 'raccords', name: 'Té égal cuivre 22mm à souder', reference: 'TEE22-EG', unit: 'pce', price_ht: 2.20, diameter: '22mm', stock: 400, description: 'Té égal 22x22x22 cuivre capillaire', specs: { 'Type': 'Égal', 'Diamètre': '22mm', 'Raccordement': 'Capillaire' } },
  { id: 'r-t22-red', category: 'raccords', name: 'Té réduit 22x18x22 cuivre', reference: 'TEE22-18', unit: 'pce', price_ht: 2.80, diameter: '22mm', stock: 200, description: 'Té réduit dérivation 18mm', specs: { 'Type': 'Réduit', 'Diamètre': '22x18x22', 'Raccordement': 'Capillaire' } },
  // Manchons 22mm
  { id: 'r-m22-eg', category: 'raccords', name: 'Manchon égal cuivre 22mm', reference: 'MAN22-EG', unit: 'pce', price_ht: 1.20, diameter: '22mm', stock: 600, description: 'Manchon droit 22x22 capillaire', specs: { 'Type': 'Égal', 'Diamètre': '22mm', 'Raccordement': 'Capillaire' } },
  { id: 'r-m22-red', category: 'raccords', name: 'Manchon réduit 22x20mm', reference: 'MAN22-20', unit: 'pce', price_ht: 1.50, diameter: '22mm', stock: 300, description: 'Réduction 22 vers 20mm', specs: { 'Type': 'Réduit', 'Diamètre': '22x20mm' } },
  { id: 'r-m22-18', category: 'raccords', name: 'Manchon réduit 22x18mm', reference: 'MAN22-18', unit: 'pce', price_ht: 1.50, diameter: '22mm', stock: 250, description: 'Réduction 22 vers 18mm', specs: { 'Type': 'Réduit', 'Diamètre': '22x18mm' } },
  // Coudes 20mm
  { id: 'r-c20-90', category: 'raccords', name: 'Coude 90° cuivre 20mm à souder', reference: 'CDE20-90S', unit: 'pce', price_ht: 1.60, diameter: '20mm', stock: 450, description: 'Coude 90° DN20 capillaire', specs: { 'Angle': '90°', 'Diamètre': '20mm', 'Raccordement': 'Capillaire' } },
  { id: 'r-c20-45', category: 'raccords', name: 'Coude 45° cuivre 20mm à souder', reference: 'CDE20-45S', unit: 'pce', price_ht: 1.75, diameter: '20mm', stock: 250, description: 'Coude 45° DN20 capillaire', specs: { 'Angle': '45°', 'Diamètre': '20mm' } },
  { id: 'r-t20-eg', category: 'raccords', name: 'Té égal cuivre 20mm à souder', reference: 'TEE20-EG', unit: 'pce', price_ht: 2.00, diameter: '20mm', stock: 350, description: 'Té égal 20x20x20 capillaire', specs: { 'Type': 'Égal', 'Diamètre': '20mm' } },
  { id: 'r-m20-eg', category: 'raccords', name: 'Manchon égal cuivre 20mm', reference: 'MAN20-EG', unit: 'pce', price_ht: 1.10, diameter: '20mm', stock: 500, description: 'Manchon droit 20x20 capillaire', specs: { 'Type': 'Égal', 'Diamètre': '20mm' } },
  // Coudes 18mm
  { id: 'r-c18-90', category: 'raccords', name: 'Coude 90° cuivre 18mm à souder', reference: 'CDE18-90S', unit: 'pce', price_ht: 1.40, diameter: '18mm', stock: 480, description: 'Coude 90° DN18 capillaire', specs: { 'Angle': '90°', 'Diamètre': '18mm', 'Raccordement': 'Capillaire' } },
  { id: 'r-c18-45', category: 'raccords', name: 'Coude 45° cuivre 18mm à souder', reference: 'CDE18-45S', unit: 'pce', price_ht: 1.55, diameter: '18mm', stock: 220, description: 'Coude 45° DN18 capillaire' },
  { id: 'r-t18-eg', category: 'raccords', name: 'Té égal cuivre 18mm à souder', reference: 'TEE18-EG', unit: 'pce', price_ht: 1.80, diameter: '18mm', stock: 320, description: 'Té égal 18x18x18 capillaire' },
  { id: 'r-m18-eg', category: 'raccords', name: 'Manchon égal cuivre 18mm', reference: 'MAN18-EG', unit: 'pce', price_ht: 0.95, diameter: '18mm', stock: 550, description: 'Manchon droit 18x18' },
  { id: 'r-m18-16', category: 'raccords', name: 'Manchon réduit 18x16mm', reference: 'MAN18-16', unit: 'pce', price_ht: 1.20, diameter: '18mm', stock: 280, description: 'Réduction 18 vers 16mm' },
  // Coudes 16mm
  { id: 'r-c16-90', category: 'raccords', name: 'Coude 90° cuivre 16mm à souder', reference: 'CDE16-90S', unit: 'pce', price_ht: 1.20, diameter: '16mm', stock: 520, description: 'Coude 90° DN16 capillaire' },
  { id: 'r-c16-45', category: 'raccords', name: 'Coude 45° cuivre 16mm à souder', reference: 'CDE16-45S', unit: 'pce', price_ht: 1.35, diameter: '16mm', stock: 250, description: 'Coude 45° DN16 capillaire' },
  { id: 'r-t16-eg', category: 'raccords', name: 'Té égal cuivre 16mm à souder', reference: 'TEE16-EG', unit: 'pce', price_ht: 1.60, diameter: '16mm', stock: 380, description: 'Té égal 16x16x16 capillaire' },
  { id: 'r-m16-eg', category: 'raccords', name: 'Manchon égal cuivre 16mm', reference: 'MAN16-EG', unit: 'pce', price_ht: 0.85, diameter: '16mm', stock: 600, description: 'Manchon droit 16x16' },
  { id: 'r-m16-14', category: 'raccords', name: 'Manchon réduit 16x14mm', reference: 'MAN16-14', unit: 'pce', price_ht: 1.10, diameter: '16mm', stock: 300, description: 'Réduction 16 vers 14mm' },
  // Coudes 14mm
  { id: 'r-c14-90', category: 'raccords', name: 'Coude 90° cuivre 14mm à souder', reference: 'CDE14-90S', unit: 'pce', price_ht: 0.95, diameter: '14mm', stock: 580, description: 'Coude 90° DN14 capillaire' },
  { id: 'r-c14-45', category: 'raccords', name: 'Coude 45° cuivre 14mm à souder', reference: 'CDE14-45S', unit: 'pce', price_ht: 1.10, diameter: '14mm', stock: 280, description: 'Coude 45° DN14 capillaire' },
  { id: 'r-t14-eg', category: 'raccords', name: 'Té égal cuivre 14mm à souder', reference: 'TEE14-EG', unit: 'pce', price_ht: 1.40, diameter: '14mm', stock: 400, description: 'Té égal 14x14x14 capillaire' },
  { id: 'r-m14-eg', category: 'raccords', name: 'Manchon égal cuivre 14mm', reference: 'MAN14-EG', unit: 'pce', price_ht: 0.75, diameter: '14mm', stock: 650, description: 'Manchon droit 14x14' },
  // Raccords spéciaux
  { id: 'r-btt22', category: 'raccords', name: 'Bouchon cuivre 22mm capillaire', reference: 'BCHON22', unit: 'pce', price_ht: 0.90, diameter: '22mm', stock: 200, description: 'Bouchon d\'obturation 22mm' },
  { id: 'r-btt18', category: 'raccords', name: 'Bouchon cuivre 18mm capillaire', reference: 'BCHON18', unit: 'pce', price_ht: 0.70, diameter: '18mm', stock: 250 },
  { id: 'r-btt14', category: 'raccords', name: 'Bouchon cuivre 14mm capillaire', reference: 'BCHON14', unit: 'pce', price_ht: 0.55, diameter: '14mm', stock: 300 },
  { id: 'r-union22', category: 'raccords', name: 'Union démontable cuivre 22mm', reference: 'UNION22', unit: 'pce', price_ht: 6.50, diameter: '22mm', stock: 120, description: 'Union 3 pièces démontable DN22' },
  { id: 'r-union18', category: 'raccords', name: 'Union démontable cuivre 18mm', reference: 'UNION18', unit: 'pce', price_ht: 5.80, diameter: '18mm', stock: 150 },
  { id: 'r-union14', category: 'raccords', name: 'Union démontable cuivre 14mm', reference: 'UNION14', unit: 'pce', price_ht: 4.90, diameter: '14mm', stock: 180 },
  // Raccords à compression laiton
  { id: 'r-comp22', category: 'raccords', name: 'Raccord compression droit 22mm laiton', reference: 'COMP22-DR', unit: 'pce', price_ht: 3.20, diameter: '22mm', stock: 200, description: 'Raccord droit laiton à compression DN22' },
  { id: 'r-comp18', category: 'raccords', name: 'Raccord compression droit 18mm laiton', reference: 'COMP18-DR', unit: 'pce', price_ht: 2.80, diameter: '18mm', stock: 250 },
  { id: 'r-comp16', category: 'raccords', name: 'Raccord compression droit 16mm laiton', reference: 'COMP16-DR', unit: 'pce', price_ht: 2.50, diameter: '16mm', stock: 280 },
  { id: 'r-comp14', category: 'raccords', name: 'Raccord compression droit 14mm laiton', reference: 'COMP14-DR', unit: 'pce', price_ht: 2.20, diameter: '14mm', stock: 320 },
  // Connecteurs filetés
  { id: 'r-cf22m', category: 'raccords', name: 'Connecteur F cuivre/laiton 22mm x 3/4"M', reference: 'CF22-34M', unit: 'pce', price_ht: 4.80, diameter: '22mm', stock: 180 },
  { id: 'r-cf22f', category: 'raccords', name: 'Connecteur F cuivre/laiton 22mm x 3/4"F', reference: 'CF22-34F', unit: 'pce', price_ht: 4.80, diameter: '22mm', stock: 180 },
  { id: 'r-cf18m', category: 'raccords', name: 'Connecteur F cuivre/laiton 18mm x 1/2"M', reference: 'CF18-12M', unit: 'pce', price_ht: 3.90, diameter: '18mm', stock: 220 },
  { id: 'r-cf18f', category: 'raccords', name: 'Connecteur F cuivre/laiton 18mm x 1/2"F', reference: 'CF18-12F', unit: 'pce', price_ht: 3.90, diameter: '18mm', stock: 220 },
  { id: 'r-cf14m', category: 'raccords', name: 'Connecteur F cuivre/laiton 14mm x 3/8"M', reference: 'CF14-38M', unit: 'pce', price_ht: 3.20, diameter: '14mm', stock: 260 },
  { id: 'r-cf14f', category: 'raccords', name: 'Connecteur F cuivre/laiton 14mm x 3/8"F', reference: 'CF14-38F', unit: 'pce', price_ht: 3.20, diameter: '14mm', stock: 260 },
  // Colliers et supports
  { id: 'r-col22', category: 'raccords', name: 'Collier de fixation cuivre 22mm', reference: 'COL22', unit: 'pce', price_ht: 0.65, diameter: '22mm', stock: 1000, description: 'Collier d\'attache inox pour tube 22mm' },
  { id: 'r-col20', category: 'raccords', name: 'Collier de fixation cuivre 20mm', reference: 'COL20', unit: 'pce', price_ht: 0.60, diameter: '20mm', stock: 1000 },
  { id: 'r-col18', category: 'raccords', name: 'Collier de fixation cuivre 18mm', reference: 'COL18', unit: 'pce', price_ht: 0.55, diameter: '18mm', stock: 1200 },
  { id: 'r-col16', category: 'raccords', name: 'Collier de fixation cuivre 16mm', reference: 'COL16', unit: 'pce', price_ht: 0.50, diameter: '16mm', stock: 1200 },
  { id: 'r-col14', category: 'raccords', name: 'Collier de fixation cuivre 14mm', reference: 'COL14', unit: 'pce', price_ht: 0.45, diameter: '14mm', stock: 1500 },
  // Dielectric union
  { id: 'r-diel22', category: 'raccords', name: 'Union diélectrique 22mm', reference: 'DIEL22', unit: 'pce', price_ht: 8.50, diameter: '22mm', stock: 80, description: 'Isolant galvanique tube cuivre DN22' },
  { id: 'r-diel18', category: 'raccords', name: 'Union diélectrique 18mm', reference: 'DIEL18', unit: 'pce', price_ht: 7.20, diameter: '18mm', stock: 100 },
  // Brasure et flux
  { id: 'r-brasure', category: 'raccords', name: 'Brasure argent 2% fil 250g', reference: 'BRAS-AG2', unit: 'pce', price_ht: 18.50, stock: 80, description: 'Fil de brasure argent pour soudure capillaire gaz' },
  { id: 'r-flux', category: 'raccords', name: 'Flux de brasure 250ml', reference: 'FLUX-250', unit: 'pce', price_ht: 12.00, stock: 120, description: 'Flux décapant pour soudure cuivre gaz' },
  { id: 'r-bande', category: 'raccords', name: 'Bande PTFE gaz 12m', reference: 'PTFE-12', unit: 'pce', price_ht: 2.80, stock: 300, description: 'Ruban PTFE blanc pour filetages gaz' },
  // Protections tube
  { id: 'r-gaine22', category: 'raccords', name: 'Gaine de protection tube 22mm (5m)', reference: 'GAI22-5', unit: 'rouleau', price_ht: 9.50, diameter: '22mm', stock: 60, description: 'Gaine PE orange protection tube cuivre 22mm' },
  { id: 'r-gaine18', category: 'raccords', name: 'Gaine de protection tube 18mm (5m)', reference: 'GAI18-5', unit: 'rouleau', price_ht: 7.80, diameter: '18mm', stock: 80 },
  { id: 'r-gaine14', category: 'raccords', name: 'Gaine de protection tube 14mm (5m)', reference: 'GAI14-5', unit: 'rouleau', price_ht: 6.50, diameter: '14mm', stock: 100 },
  // Détecteur fuite
  { id: 'r-det-spray', category: 'raccords', name: 'Spray détecteur de fuites gaz 400ml', reference: 'DET-SPR', unit: 'pce', price_ht: 8.90, stock: 50, description: 'Spray mousse détection fuite gaz certifié' },
  { id: 'r-det-liq', category: 'raccords', name: 'Liquide détecteur de fuites gaz 250ml', reference: 'DET-LIQ', unit: 'pce', price_ht: 6.50, stock: 70 },

  // ===== VANNES & ROBINETS =====
  // Robinets d'arrêt
  { id: 'v-arr22', category: 'vannes', name: 'Robinet d\'arrêt 1/4 tour 22mm laiton', reference: 'RAR22-14T', unit: 'pce', price_ht: 22.00, diameter: '22mm', stock: 120, description: 'Robinet sphérique 1/4 tour DN22 - NF EN 331', specs: { 'Type': '1/4 tour', 'Matière corps': 'Laiton', 'Diamètre': '22mm', 'Pression': '5 bar', 'Norme': 'NF EN 331' } },
  { id: 'v-arr20', category: 'vannes', name: 'Robinet d\'arrêt 1/4 tour 20mm laiton', reference: 'RAR20-14T', unit: 'pce', price_ht: 19.50, diameter: '20mm', stock: 140, description: 'Robinet sphérique 1/4 tour DN20', specs: { 'Type': '1/4 tour', 'Matière corps': 'Laiton', 'Norme': 'NF EN 331' } },
  { id: 'v-arr18', category: 'vannes', name: 'Robinet d\'arrêt 1/4 tour 18mm laiton', reference: 'RAR18-14T', unit: 'pce', price_ht: 17.00, diameter: '18mm', stock: 160, description: 'Robinet sphérique 1/4 tour DN18', specs: { 'Type': '1/4 tour', 'Matière corps': 'Laiton', 'Norme': 'NF EN 331' } },
  { id: 'v-arr16', category: 'vannes', name: 'Robinet d\'arrêt 1/4 tour 16mm laiton', reference: 'RAR16-14T', unit: 'pce', price_ht: 15.50, diameter: '16mm', stock: 180, description: 'Robinet sphérique 1/4 tour DN16' },
  { id: 'v-arr14', category: 'vannes', name: 'Robinet d\'arrêt 1/4 tour 14mm laiton', reference: 'RAR14-14T', unit: 'pce', price_ht: 13.80, diameter: '14mm', stock: 200, description: 'Robinet sphérique 1/4 tour DN14' },
  // Robinets de sectionnement
  { id: 'v-sec22', category: 'vannes', name: 'Robinet de sectionnement DN22 - 3/4"', reference: 'RSEC22', unit: 'pce', price_ht: 28.00, diameter: '22mm', stock: 80, description: 'Vanne de sectionnement réseau principal DN22', specs: { 'Type': 'Sectionnement', 'Diamètre nominal': 'DN22', 'Raccordement': 'F/F 3/4"', 'Corps': 'Laiton nickelé', 'Norme': 'NF EN 331' } },
  { id: 'v-sec20', category: 'vannes', name: 'Robinet de sectionnement DN20 - 3/4"', reference: 'RSEC20', unit: 'pce', price_ht: 25.00, diameter: '20mm', stock: 100 },
  { id: 'v-sec18', category: 'vannes', name: 'Robinet de sectionnement DN18 - 1/2"', reference: 'RSEC18', unit: 'pce', price_ht: 22.00, diameter: '18mm', stock: 120 },
  { id: 'v-sec14', category: 'vannes', name: 'Robinet de sectionnement DN14 - 3/8"', reference: 'RSEC14', unit: 'pce', price_ht: 18.50, diameter: '14mm', stock: 150 },
  // Détendeurs / Régulateurs
  { id: 'v-det-bp', category: 'vannes', name: 'Détendeur gaz naturel BP 20mbar', reference: 'DET-BP20', unit: 'pce', price_ht: 45.00, stock: 60, description: 'Détendeur basse pression résidence 20mbar', specs: { 'Pression sortie': '20mbar', 'Débit max': '4 m³/h', 'Raccordement': '3/4"', 'Type': 'BP résidentiel', 'Norme': 'NF EN 88' } },
  { id: 'v-det-mp', category: 'vannes', name: 'Détendeur gaz naturel MP 50mbar', reference: 'DET-MP50', unit: 'pce', price_ht: 68.00, stock: 40, description: 'Détendeur moyenne pression 50mbar', specs: { 'Pression sortie': '50mbar', 'Débit max': '10 m³/h', 'Raccordement': '1"', 'Norme': 'NF EN 88' } },
  { id: 'v-det-hp', category: 'vannes', name: 'Détendeur détente BP collectif', reference: 'DET-COL', unit: 'pce', price_ht: 125.00, stock: 20, description: 'Détendeur collectif immeuble - débit élevé' },
  { id: 'v-det-ind', category: 'vannes', name: 'Détendeur individuel 28mbar', reference: 'DET-IND28', unit: 'pce', price_ht: 38.00, stock: 80, description: 'Détendeur appartement - montage compteur' },
  // Robinets gaz spéciaux
  { id: 'v-chauf22', category: 'vannes', name: 'Robinet équerre chaudière 22mm', reference: 'REQUI22', unit: 'pce', price_ht: 18.50, diameter: '22mm', stock: 100, description: 'Robinet coudé alimentation chaudière' },
  { id: 'v-plaque', category: 'vannes', name: 'Robinet de plaque de cuisson gaz', reference: 'RPLAQ', unit: 'pce', price_ht: 12.80, stock: 120, description: 'Robinet M x F pour raccordement plaque' },
  { id: 'v-cuis22', category: 'vannes', name: 'Ensemble robinet cuisinière 22mm', reference: 'RCUISE22', unit: 'pce', price_ht: 24.00, diameter: '22mm', stock: 90, description: 'Ensemble complet raccordement cuisinière' },
  // Soupapes de sécurité
  { id: 'v-soupape', category: 'vannes', name: 'Soupape de sécurité 1/2" - 0.3 bar', reference: 'SOUP-03', unit: 'pce', price_ht: 32.00, stock: 50, description: 'Soupape sécurité limiteur pression 0.3 bar' },
  // Compteurs gaz
  { id: 'v-compteur', category: 'vannes', name: 'Compteur gaz G4 résidentiel', reference: 'CPT-G4', unit: 'pce', price_ht: 185.00, stock: 30, description: 'Compteur gaz membrane G4 - Q max 6 m³/h', specs: { 'Classe': 'G4', 'Q max': '6 m³/h', 'Raccordement': '3/4"', 'Norme': 'EN 1359' } },
  { id: 'v-compteur-g6', category: 'vannes', name: 'Compteur gaz G6 semi-collectif', reference: 'CPT-G6', unit: 'pce', price_ht: 245.00, stock: 20 },
  // Électrovannes
  { id: 'v-elec22', category: 'vannes', name: 'Électrovanne gaz normalement fermée DN22', reference: 'ELEC22-NF', unit: 'pce', price_ht: 95.00, diameter: '22mm', stock: 30, description: 'Electrovanne NF 24V DC - sécurité automatique' },
  { id: 'v-elec18', category: 'vannes', name: 'Électrovanne gaz normalement fermée DN18', reference: 'ELEC18-NF', unit: 'pce', price_ht: 78.00, diameter: '18mm', stock: 40 },

  // ===== VENTILATION & CONDUITS =====
  // Grilles de ventilation
  { id: 'vc-grille-100', category: 'ventilation', name: 'Grille ventilation entrée 100x100mm', reference: 'GRVT100', unit: 'pce', price_ht: 3.50, stock: 200, description: 'Grille aluminium ventilation naturelle 100x100', specs: { 'Dimensions': '100x100mm', 'Section libre': '60cm²', 'Matière': 'Aluminium', 'Couleur': 'Blanc' } },
  { id: 'vc-grille-150', category: 'ventilation', name: 'Grille ventilation 150x150mm extérieure', reference: 'GRVT150', unit: 'pce', price_ht: 5.80, stock: 150, description: 'Grille aluminium ext avec moustiquaire 150x150' },
  { id: 'vc-grille-200', category: 'ventilation', name: 'Grille ventilation 200x200mm', reference: 'GRVT200', unit: 'pce', price_ht: 8.90, stock: 100, description: 'Grille grande surface 200x200mm' },
  { id: 'vc-grille-ronde', category: 'ventilation', name: 'Grille ventilation ronde Ø125mm', reference: 'GRVT-R125', unit: 'pce', price_ht: 4.20, stock: 180, description: 'Grille ronde PVC Ø125mm pour conduit VMC' },
  { id: 'vc-grille-ronde-160', category: 'ventilation', name: 'Grille ventilation ronde Ø160mm', reference: 'GRVT-R160', unit: 'pce', price_ht: 6.10, stock: 120 },
  // Manchettes et passages
  { id: 'vc-manch-22', category: 'ventilation', name: 'Manchette passage mur tube 22mm', reference: 'MANCH22', unit: 'pce', price_ht: 4.50, diameter: '22mm', stock: 300, description: 'Manchette protection tube traversée mur 22mm' },
  { id: 'vc-manch-18', category: 'ventilation', name: 'Manchette passage mur tube 18mm', reference: 'MANCH18', unit: 'pce', price_ht: 3.80, diameter: '18mm', stock: 350 },
  { id: 'vc-manch-16', category: 'ventilation', name: 'Manchette passage mur tube 16mm', reference: 'MANCH16', unit: 'pce', price_ht: 3.40, diameter: '16mm', stock: 380 },
  { id: 'vc-manch-14', category: 'ventilation', name: 'Manchette passage mur tube 14mm', reference: 'MANCH14', unit: 'pce', price_ht: 3.00, diameter: '14mm', stock: 420 },
  // Fourreaux et chemises
  { id: 'vc-four22-1', category: 'ventilation', name: 'Fourreau PVC rigide 25mm (pour tube 22mm) 1m', reference: 'FOUR25-1M', unit: 'm', price_ht: 2.80, diameter: '22mm', stock: 500, description: 'Fourreau PVC gris protection tube 22mm' },
  { id: 'vc-four22-3', category: 'ventilation', name: 'Fourreau PVC rigide 25mm barre 3m', reference: 'FOUR25-3M', unit: 'm', price_ht: 2.80, diameter: '22mm', stock: 200 },
  { id: 'vc-four20-1', category: 'ventilation', name: 'Fourreau PVC 22mm (pour tube 20mm) 1m', reference: 'FOUR22-1M', unit: 'm', price_ht: 2.40, diameter: '20mm', stock: 600 },
  { id: 'vc-four18-1', category: 'ventilation', name: 'Fourreau PVC 20mm (pour tube 18mm) 1m', reference: 'FOUR20-1M', unit: 'm', price_ht: 2.20, diameter: '18mm', stock: 650 },
  { id: 'vc-four14-1', category: 'ventilation', name: 'Fourreau PVC 16mm (pour tube 14mm) 1m', reference: 'FOUR16-1M', unit: 'm', price_ht: 1.80, diameter: '14mm', stock: 700 },
  // Conduits fumées
  { id: 'vc-cond80', category: 'ventilation', name: 'Conduit évacuation fumées Ø80mm (1m)', reference: 'CFUM80-1M', unit: 'm', price_ht: 12.50, stock: 100, description: 'Conduit inox double paroi Ø80mm NF DTU 61.1' },
  { id: 'vc-cond100', category: 'ventilation', name: 'Conduit évacuation fumées Ø100mm (1m)', reference: 'CFUM100-1M', unit: 'm', price_ht: 16.80, stock: 80 },
  { id: 'vc-cond125', category: 'ventilation', name: 'Conduit évacuation fumées Ø125mm (1m)', reference: 'CFUM125-1M', unit: 'm', price_ht: 21.50, stock: 60 },
  // Coudes conduits
  { id: 'vc-coude80', category: 'ventilation', name: 'Coude 90° conduit Ø80mm', reference: 'CCOND80-90', unit: 'pce', price_ht: 18.00, stock: 80, description: 'Coude inox 90° pour conduit double paroi 80mm' },
  { id: 'vc-coude80-45', category: 'ventilation', name: 'Coude 45° conduit Ø80mm', reference: 'CCOND80-45', unit: 'pce', price_ht: 15.00, stock: 90 },
  { id: 'vc-coude100', category: 'ventilation', name: 'Coude 90° conduit Ø100mm', reference: 'CCOND100-90', unit: 'pce', price_ht: 24.00, stock: 60 },
  // Sorties de toiture
  { id: 'vc-sortie80', category: 'ventilation', name: 'Sortie toiture tuile Ø80mm', reference: 'STOIT80', unit: 'pce', price_ht: 45.00, stock: 30, description: 'Terminal sortie toit universel Ø80mm' },
  { id: 'vc-sortie100', category: 'ventilation', name: 'Sortie toiture tuile Ø100mm', reference: 'STOIT100', unit: 'pce', price_ht: 58.00, stock: 25 },
  // Ventouses
  { id: 'vc-vent80', category: 'ventilation', name: 'Ventouse horizontale Ø80/125mm', reference: 'VENTH8012', unit: 'pce', price_ht: 42.00, stock: 50, description: 'Sortie murale horizontale - chaudière condensation', specs: { 'Type': 'Concentrique', 'Fumées': 'Ø80mm', 'Air comburant': 'Ø125mm', 'Montage': 'Horizontal' } },
  { id: 'vc-vent80v', category: 'ventilation', name: 'Ventouse verticale Ø80/125mm', reference: 'VENTV8012', unit: 'pce', price_ht: 52.00, stock: 35 },
  // Accessoires VMC
  { id: 'vc-vmc125', category: 'ventilation', name: 'Bouche VMC réglable Ø125mm', reference: 'VMC-B125', unit: 'pce', price_ht: 9.80, stock: 100, description: 'Bouche d\'extraction réglable VMC 125mm' },
  { id: 'vc-vmc160', category: 'ventilation', name: 'Bouche VMC réglable Ø160mm', reference: 'VMC-B160', unit: 'pce', price_ht: 12.50, stock: 80 },
  { id: 'vc-caisson', category: 'ventilation', name: 'Caisson VMC simple flux collectif', reference: 'VMC-CAIS', unit: 'pce', price_ht: 185.00, stock: 15, description: 'Extracteur centrifuge pour VMC collective' },
  // Détecteurs gaz
  { id: 'vc-detgaz', category: 'ventilation', name: 'Détecteur gaz naturel 230V avec relais', reference: 'DETGAZ-230', unit: 'pce', price_ht: 65.00, stock: 60, description: 'Détecteur fuite gaz naturel - alarme et relais coupure', specs: { 'Alimentation': '230V', 'Sortie relais': 'OUI', 'Gaz détecté': 'Naturel/Propane', 'Norme': 'EN 50194' } },
  { id: 'vc-detgaz-bat', category: 'ventilation', name: 'Détecteur gaz naturel batterie 9V', reference: 'DETGAZ-BAT', unit: 'pce', price_ht: 38.00, stock: 80 },
  { id: 'vc-detco', category: 'ventilation', name: 'Détecteur CO (monoxyde carbone) 230V', reference: 'DETCO-230', unit: 'pce', price_ht: 55.00, stock: 70, description: 'Détecteur CO alarme sonore + visuel' },
  // Capots et protections
  { id: 'vc-capot22', category: 'ventilation', name: 'Capot de protection tube 22mm PVC blanc', reference: 'CAPOT22', unit: 'pce', price_ht: 2.80, diameter: '22mm', stock: 200 },
  { id: 'vc-capot18', category: 'ventilation', name: 'Capot de protection tube 18mm PVC blanc', reference: 'CAPOT18', unit: 'pce', price_ht: 2.40, diameter: '18mm', stock: 250 },
  // Goulotte et moulure
  { id: 'vc-goul40', category: 'ventilation', name: 'Goulotte PVC 40x25mm (2m) pour tube gaz', reference: 'GOUL4025', unit: 'm', price_ht: 4.20, stock: 300, description: 'Goulotte PVC protection et habillage tube gaz' },
  { id: 'vc-goul60', category: 'ventilation', name: 'Goulotte PVC 60x40mm (2m) pour tube gaz', reference: 'GOUL6040', unit: 'm', price_ht: 6.80, stock: 200 },
  // Consommables
  { id: 'vc-mastic', category: 'ventilation', name: 'Mastic d\'étanchéité traversée mur 310ml', reference: 'MASTIC310', unit: 'pce', price_ht: 9.50, stock: 100, description: 'Mastic silicone pour étanchéité traversées' },
  { id: 'vc-mousse', category: 'ventilation', name: 'Mousse d\'étanchéité feu traversée', reference: 'MOUSS-FEU', unit: 'pce', price_ht: 15.80, stock: 60, description: 'Mousse intumescente coupe-feu traversée tube' },
  { id: 'vc-laine', category: 'ventilation', name: 'Laine minérale isolation tube gaz 1m²', reference: 'LAINE-1M2', unit: 'm²', price_ht: 8.50, stock: 80, description: 'Isolation thermique et phonique conduits' },
];

export const CATEGORY_CONFIG = {
  tubes: {
    label: 'Tubes Cuivre',
    color: '#2C5282',
    bgColor: '#EBF4FF',
    borderColor: '#BEE3F8',
    lightColor: '#90CDF4',
    icon: '🔵',
    description: 'Tubes cuivre recuit NF EN 1057 - Ø14 à Ø22mm',
  },
  raccords: {
    label: 'Raccords & Accessoires',
    color: '#276749',
    bgColor: '#F0FFF4',
    borderColor: '#9AE6B4',
    lightColor: '#68D391',
    icon: '🟢',
    description: 'Coudes, tés, manchons, brasures et fixations',
  },
  vannes: {
    label: 'Vannes & Robinets',
    color: '#744210',
    bgColor: '#FFFAF0',
    borderColor: '#FBD38D',
    lightColor: '#F6AD55',
    icon: '🟡',
    description: 'Robinets d\'arrêt, sectionnement, détendeurs',
  },
  ventilation: {
    label: 'Ventilation & Conduits',
    color: '#553C9A',
    bgColor: '#FAF5FF',
    borderColor: '#D6BCFA',
    lightColor: '#B794F4',
    icon: '🟣',
    description: 'Grilles, fourreaux, conduits et détecteurs',
  },
};

export const STATUS_CONFIG: Record<QuoteStatus, { label: string; color: string; bg: string; border: string }> = {
  draft: { label: 'Brouillon', color: '#4A5568', bg: '#EDF2F7', border: '#CBD5E0' },
  sent: { label: 'Envoyé', color: '#2B6CB0', bg: '#EBF8FF', border: '#90CDF4' },
  accepted: { label: 'Accepté', color: '#276749', bg: '#F0FFF4', border: '#9AE6B4' },
  rejected: { label: 'Refusé', color: '#C53030', bg: '#FFF5F5', border: '#FEB2B2' },
  expired: { label: 'Expiré', color: '#744210', bg: '#FFFAF0', border: '#FBD38D' },
};

export const DEFAULT_COMPANY_SETTINGS: CompanySettings = {
  name: 'GazTech Pro Tunisie',
  address: '15 Rue de l\'Énergie',
  city: 'Tunis',
  postal_code: '1002',
  phone: '+216 71 000 000',
  email: 'contact@gaztechpro.tn',
  siret: '12345678900012',
  insurance_number: 'RC-2024-0001',
  insurance_company: 'STAR Assurances',
  default_margin_rate: 25,
  default_labor_rate: 45,
  payment_terms: 'Paiement à 30 jours - Virement bancaire ou chèque',
  tva_rate: 19,
  website: 'www.gaztechpro.tn',
};

export function generateQuoteNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `DEV-${year}${month}${day}-${random}`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-TN', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(amount) + ' DT';
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(dateStr));
}

export function calculateQuoteTotals(
  items: QuoteLineItem[],
  marginRate: number,
  laborRate: number,
  laborHours: number,
  tvaRate: number = 19
) {
  const subtotal_ht = items.reduce((sum, item) => {
    const price = item.unit_price * item.quantity;
    const discount = item.discount || 0;
    return sum + price * (1 - discount / 100);
  }, 0);

  const labor_total = laborHours * laborRate;
  const margin_base = subtotal_ht + labor_total;
  const margin_amount = margin_base * (marginRate / 100);
  const total_ht = margin_base + margin_amount;
  const tva_amount = total_ht * (tvaRate / 100);
  const total_ttc = total_ht + tva_amount;

  return { subtotal_ht, labor_total, margin_amount, total_ht, tva_amount, total_ttc };
}

export function estimateLaborHours(items: QuoteLineItem[]): number {
  let hours = 0;
  items.forEach(item => {
    const cat = item.catalog_item.category;
    const qty = item.quantity;
    if (cat === 'tubes') hours += qty * 0.15;
    else if (cat === 'raccords') hours += qty * 0.25;
    else if (cat === 'vannes') hours += qty * 0.5;
    else if (cat === 'ventilation') hours += qty * 0.35;
  });
  return Math.max(1, Math.round(hours * 10) / 10);
}
