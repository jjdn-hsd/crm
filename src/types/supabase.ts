import { Database as DatabaseGenerated } from './database';

export type Database = DatabaseGenerated;

// This is a placeholder type until you generate the actual types from your Supabase database
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          role: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      customers: {
        Row: any;
        Insert: any;
        Update: any;
      };
      contacts: {
        Row: any;
        Insert: any;
        Update: any;
      };
      deals: {
        Row: any;
        Insert: any;
        Update: any;
      };
      activities: {
        Row: any;
        Insert: any;
        Update: any;
      };
      documents: {
        Row: any;
        Insert: any;
        Update: any;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: 'admin' | 'manager' | 'agent';
      deal_stage: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
      activity_type: 'note' | 'call' | 'email' | 'meeting' | 'task';
    };
  };
}