export type UserRole = 'admin' | 'manager' | 'agent';
export type DealStage = 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
export type ActivityType = 'note' | 'call' | 'email' | 'meeting' | 'task';

export interface User {
  id: string;
  role: UserRole;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  name: string;
  company: string | null;
  industry: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  assigned_to: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

export interface Contact {
  id: string;
  customer_id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  position: string | null;
  is_primary: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

export interface Deal {
  id: string;
  customer_id: string;
  name: string;
  amount: number | null;
  stage: DealStage;
  expected_close_date: string | null;
  assigned_to: string | null;
  probability: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

export interface Activity {
  id: string;
  type: ActivityType;
  entity_type: string;
  entity_id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  completed_at: string | null;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

export interface Document {
  id: string;
  entity_type: string;
  entity_id: string;
  name: string;
  file_path: string;
  file_type: string | null;
  file_size: number | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}