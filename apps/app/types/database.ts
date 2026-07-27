export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type Profile = {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  role: "user" | "admin";
  has_purchased: boolean;
  purchased_at: string | null;
  stripe_customer_id: string | null;
  created_at: string;
  updated_at: string;
};

type LocationRow = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  long_description: string | null;
  category: string;
  difficulty: string;
  region: string;
  lat: number;
  lng: number;
  hero_image_url: string;
  hero_image_alt: string;
  tags: string[];
  best_season: string[];
  travel_time_minutes: number;
  visit_duration_min: number;
  visit_duration_max: number;
  highlights: string[];
  tips: string[];
  what_to_bring: string[];
  access_info: string;
  parking_available: boolean;
  public_transport: boolean;
  elevation: number | null;
  distance_km: number | null;
  is_featured: boolean;
  is_new: boolean;
  is_published: boolean;
  view_count: number;
  save_count: number;
  created_at: string;
  updated_at: string;
};

type Table<Row, Insert = Partial<Row>, Update = Partial<Insert>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export interface Database {
  public: {
    Tables: {
      profiles: Table<Profile, Pick<Profile, "id" | "email"> & Partial<Profile>>;
      locations: Table<LocationRow, Pick<LocationRow, "id" | "slug" | "name"> & Partial<LocationRow>>;
      location_images: Table<{
        id: string; location_id: string; url: string; alt: string;
        width: number | null; height: number | null; credit: string | null;
        sort_order: number; created_at: string;
      }>;
      favorites: Table<{
        id: string; user_id: string; location_id: string; created_at: string;
      }, { id?: string; user_id: string; location_id: string; created_at?: string }>;
      purchases: Table<{
        id: string; user_id: string; stripe_session_id: string;
        stripe_payment_intent_id: string | null; amount: number; currency: string;
        status: "pending" | "completed" | "refunded"; created_at: string; updated_at: string;
      }>;
      testimonials: Table<{
        id: string; name: string; age: number | null; city: string; country: string;
        avatar_url: string | null; content: string; rating: number;
        is_published: boolean; location_visited: string | null; created_at: string;
      }>;
      audit_logs: Table<{
        id: string; user_id: string | null; action: string; resource: string;
        resource_id: string | null; metadata: Json | null; created_at: string;
      }>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: "user" | "admin";
      purchase_status: "pending" | "completed" | "refunded";
    };
    CompositeTypes: Record<string, never>;
  };
}
