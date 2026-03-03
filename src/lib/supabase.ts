import { createClient } from '@supabase/supabase-js';

// Supabase configuration - replace with your project credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export type Database = {
  public: {
    Tables: {
      company_settings: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          logo_url: string | null;
          address: string;
          city: string;
          postal_code: string;
          phone: string;
          email: string;
          siret: string;
          insurance_number: string | null;
          insurance_company: string | null;
          default_margin_rate: number;
          default_labor_rate: number;
          payment_terms: string;
          tva_rate: number;
          website: string | null;
          rib: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      quotes: {
        Row: {
          id: string;
          user_id: string;
          quote_number: string;
          project_name: string;
          client_name: string;
          client_email: string | null;
          client_phone: string | null;
          client_address: string | null;
          items: string; // JSON
          margin_rate: number;
          labor_rate: number;
          labor_hours: number;
          notes: string | null;
          payment_terms: string | null;
          status: string;
          subtotal_ht: number;
          labor_total: number;
          margin_amount: number;
          total_ht: number;
          tva_amount: number;
          total_ttc: number;
          created_at: string;
          updated_at: string;
          valid_until: string;
        };
      };
    };
  };
};
