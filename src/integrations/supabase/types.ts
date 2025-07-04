export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      agency_settings: {
        Row: {
          agency_email: string
          company_name: string | null
          created_at: string
          id: string
          organization_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          agency_email: string
          company_name?: string | null
          created_at?: string
          id?: string
          organization_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          agency_email?: string
          company_name?: string | null
          created_at?: string
          id?: string
          organization_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_response_templates: {
        Row: {
          category: string
          created_at: string
          id: string
          is_custom: boolean | null
          is_default: boolean | null
          name: string
          personality_style: string
          template_content: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          is_custom?: boolean | null
          is_default?: boolean | null
          name: string
          personality_style: string
          template_content: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          is_custom?: boolean | null
          is_default?: boolean | null
          name?: string
          personality_style?: string
          template_content?: string
          updated_at?: string
        }
        Relationships: []
      }
      business_scans: {
        Row: {
          ai_recommendations: string | null
          business_location: string
          business_name: string
          completeness_score: number | null
          created_at: string
          email: string | null
          engagement_score: number | null
          google_place_id: string | null
          id: string
          lead_qualified: boolean | null
          overall_score: number | null
          phone: string | null
          photos_score: number | null
          postcode: string | null
          reviews_score: number | null
          scan_results: Json | null
          scan_status: string | null
          updated_at: string
        }
        Insert: {
          ai_recommendations?: string | null
          business_location: string
          business_name: string
          completeness_score?: number | null
          created_at?: string
          email?: string | null
          engagement_score?: number | null
          google_place_id?: string | null
          id?: string
          lead_qualified?: boolean | null
          overall_score?: number | null
          phone?: string | null
          photos_score?: number | null
          postcode?: string | null
          reviews_score?: number | null
          scan_results?: Json | null
          scan_status?: string | null
          updated_at?: string
        }
        Update: {
          ai_recommendations?: string | null
          business_location?: string
          business_name?: string
          completeness_score?: number | null
          created_at?: string
          email?: string | null
          engagement_score?: number | null
          google_place_id?: string | null
          id?: string
          lead_qualified?: boolean | null
          overall_score?: number | null
          phone?: string | null
          photos_score?: number | null
          postcode?: string | null
          reviews_score?: number | null
          scan_results?: Json | null
          scan_status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      client_branding_assets: {
        Row: {
          asset_data: Json | null
          asset_type: string
          asset_url: string | null
          client_id: string
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          asset_data?: Json | null
          asset_type: string
          asset_url?: string | null
          client_id: string
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          asset_data?: Json | null
          asset_type?: string
          asset_url?: string | null
          client_id?: string
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_branding_assets_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_onboarding"
            referencedColumns: ["id"]
          },
        ]
      }
      client_onboarding: {
        Row: {
          address: string | null
          annual_revenue_range: string | null
          business_hours: Json | null
          business_name: string
          created_at: string
          current_marketing_methods: string[] | null
          existing_gbp_url: string | null
          has_existing_gbp: boolean | null
          id: string
          industry: string | null
          marketing_budget_range: string | null
          onboarding_step: number | null
          owner_email: string
          owner_name: string | null
          pain_points: string[] | null
          payment_status: string | null
          phone: string | null
          postcode: string | null
          preferred_contact_method: string | null
          previous_agency_experience: string | null
          primary_goals: string[] | null
          services_offered: string[] | null
          social_media_links: Json | null
          status: string | null
          stripe_customer_id: string | null
          stripe_session_id: string | null
          target_audience: string | null
          team_size: number | null
          trial_active: boolean | null
          trial_expires_at: string | null
          updated_at: string
          user_id: string
          website_url: string | null
          wizard_completed: boolean | null
          wizard_data: Json | null
        }
        Insert: {
          address?: string | null
          annual_revenue_range?: string | null
          business_hours?: Json | null
          business_name: string
          created_at?: string
          current_marketing_methods?: string[] | null
          existing_gbp_url?: string | null
          has_existing_gbp?: boolean | null
          id?: string
          industry?: string | null
          marketing_budget_range?: string | null
          onboarding_step?: number | null
          owner_email: string
          owner_name?: string | null
          pain_points?: string[] | null
          payment_status?: string | null
          phone?: string | null
          postcode?: string | null
          preferred_contact_method?: string | null
          previous_agency_experience?: string | null
          primary_goals?: string[] | null
          services_offered?: string[] | null
          social_media_links?: Json | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_session_id?: string | null
          target_audience?: string | null
          team_size?: number | null
          trial_active?: boolean | null
          trial_expires_at?: string | null
          updated_at?: string
          user_id: string
          website_url?: string | null
          wizard_completed?: boolean | null
          wizard_data?: Json | null
        }
        Update: {
          address?: string | null
          annual_revenue_range?: string | null
          business_hours?: Json | null
          business_name?: string
          created_at?: string
          current_marketing_methods?: string[] | null
          existing_gbp_url?: string | null
          has_existing_gbp?: boolean | null
          id?: string
          industry?: string | null
          marketing_budget_range?: string | null
          onboarding_step?: number | null
          owner_email?: string
          owner_name?: string | null
          pain_points?: string[] | null
          payment_status?: string | null
          phone?: string | null
          postcode?: string | null
          preferred_contact_method?: string | null
          previous_agency_experience?: string | null
          primary_goals?: string[] | null
          services_offered?: string[] | null
          social_media_links?: Json | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_session_id?: string | null
          target_audience?: string | null
          team_size?: number | null
          trial_active?: boolean | null
          trial_expires_at?: string | null
          updated_at?: string
          user_id?: string
          website_url?: string | null
          wizard_completed?: boolean | null
          wizard_data?: Json | null
        }
        Relationships: []
      }
      client_review_settings: {
        Row: {
          ai_responses_enabled: boolean | null
          auto_approve_negative: boolean | null
          auto_approve_neutral: boolean | null
          auto_approve_positive: boolean | null
          client_id: string
          created_at: string
          custom_templates: Json | null
          escalation_keywords: string[] | null
          id: string
          personality_style: string | null
          response_delay_hours: number | null
          updated_at: string
        }
        Insert: {
          ai_responses_enabled?: boolean | null
          auto_approve_negative?: boolean | null
          auto_approve_neutral?: boolean | null
          auto_approve_positive?: boolean | null
          client_id: string
          created_at?: string
          custom_templates?: Json | null
          escalation_keywords?: string[] | null
          id?: string
          personality_style?: string | null
          response_delay_hours?: number | null
          updated_at?: string
        }
        Update: {
          ai_responses_enabled?: boolean | null
          auto_approve_negative?: boolean | null
          auto_approve_neutral?: boolean | null
          auto_approve_positive?: boolean | null
          client_id?: string
          created_at?: string
          custom_templates?: Json | null
          escalation_keywords?: string[] | null
          id?: string
          personality_style?: string | null
          response_delay_hours?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_review_settings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_onboarding"
            referencedColumns: ["id"]
          },
        ]
      }
      client_team_members: {
        Row: {
          client_id: string
          created_at: string
          email: string | null
          id: string
          is_primary_contact: boolean | null
          name: string
          phone: string | null
          role: string
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          email?: string | null
          id?: string
          is_primary_contact?: boolean | null
          name: string
          phone?: string | null
          role: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          email?: string | null
          id?: string
          is_primary_contact?: boolean | null
          name?: string
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_team_members_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_onboarding"
            referencedColumns: ["id"]
          },
        ]
      }
      email_sequences: {
        Row: {
          client_id: string
          created_at: string
          email_clicked_at: string | null
          email_opened_at: string | null
          email_sent_at: string | null
          id: string
          sequence_type: string
          status: string | null
        }
        Insert: {
          client_id: string
          created_at?: string
          email_clicked_at?: string | null
          email_opened_at?: string | null
          email_sent_at?: string | null
          id?: string
          sequence_type: string
          status?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string
          email_clicked_at?: string | null
          email_opened_at?: string | null
          email_sent_at?: string | null
          id?: string
          sequence_type?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_sequences_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_onboarding"
            referencedColumns: ["id"]
          },
        ]
      }
      gbp_access_requests: {
        Row: {
          access_granted_at: string | null
          client_id: string
          created_at: string
          id: string
          last_follow_up: string | null
          request_url: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          access_granted_at?: string | null
          client_id: string
          created_at?: string
          id?: string
          last_follow_up?: string | null
          request_url?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          access_granted_at?: string | null
          client_id?: string
          created_at?: string
          id?: string
          last_follow_up?: string | null
          request_url?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gbp_access_requests_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_onboarding"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          status: string
          target_date: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          status?: string
          target_date?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          status?: string
          target_date?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      scan_reports: {
        Row: {
          created_at: string
          id: string
          report_data: Json
          report_type: string
          scan_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          report_data: Json
          report_type: string
          scan_id: string
        }
        Update: {
          created_at?: string
          id?: string
          report_data?: Json
          report_type?: string
          scan_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scan_reports_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "business_scans"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_customers: {
        Row: {
          created_at: string | null
          customer_id: string
          deleted_at: string | null
          id: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          deleted_at?: string | null
          id?: never
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          deleted_at?: string | null
          id?: never
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      stripe_orders: {
        Row: {
          amount_subtotal: number
          amount_total: number
          checkout_session_id: string
          created_at: string | null
          currency: string
          customer_id: string
          deleted_at: string | null
          id: number
          payment_intent_id: string
          payment_status: string
          status: Database["public"]["Enums"]["stripe_order_status"]
          updated_at: string | null
        }
        Insert: {
          amount_subtotal: number
          amount_total: number
          checkout_session_id: string
          created_at?: string | null
          currency: string
          customer_id: string
          deleted_at?: string | null
          id?: never
          payment_intent_id: string
          payment_status: string
          status?: Database["public"]["Enums"]["stripe_order_status"]
          updated_at?: string | null
        }
        Update: {
          amount_subtotal?: number
          amount_total?: number
          checkout_session_id?: string
          created_at?: string | null
          currency?: string
          customer_id?: string
          deleted_at?: string | null
          id?: never
          payment_intent_id?: string
          payment_status?: string
          status?: Database["public"]["Enums"]["stripe_order_status"]
          updated_at?: string | null
        }
        Relationships: []
      }
      stripe_subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string | null
          current_period_end: number | null
          current_period_start: number | null
          customer_id: string
          deleted_at: string | null
          id: number
          payment_method_brand: string | null
          payment_method_last4: string | null
          price_id: string | null
          status: Database["public"]["Enums"]["stripe_subscription_status"]
          subscription_id: string | null
          updated_at: string | null
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: number | null
          current_period_start?: number | null
          customer_id: string
          deleted_at?: string | null
          id?: never
          payment_method_brand?: string | null
          payment_method_last4?: string | null
          price_id?: string | null
          status: Database["public"]["Enums"]["stripe_subscription_status"]
          subscription_id?: string | null
          updated_at?: string | null
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: number | null
          current_period_start?: number | null
          customer_id?: string
          deleted_at?: string | null
          id?: never
          payment_method_brand?: string | null
          payment_method_last4?: string | null
          price_id?: string | null
          status?: Database["public"]["Enums"]["stripe_subscription_status"]
          subscription_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          completed: boolean
          completed_at: string | null
          created_at: string
          description: string | null
          due_date: string | null
          goal_id: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          goal_id: string
          id?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          goal_id?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
        ]
      }
      voice_entries: {
        Row: {
          ai_analysis: Json | null
          created_at: string
          edited_text: string | null
          id: string
          original_text: string
          user_id: string
        }
        Insert: {
          ai_analysis?: Json | null
          created_at?: string
          edited_text?: string | null
          id?: string
          original_text: string
          user_id: string
        }
        Update: {
          ai_analysis?: Json | null
          created_at?: string
          edited_text?: string | null
          id?: string
          original_text?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      stripe_user_orders: {
        Row: {
          amount_subtotal: number | null
          amount_total: number | null
          checkout_session_id: string | null
          currency: string | null
          customer_id: string | null
          order_date: string | null
          order_id: number | null
          order_status:
            | Database["public"]["Enums"]["stripe_order_status"]
            | null
          payment_intent_id: string | null
          payment_status: string | null
        }
        Relationships: []
      }
      stripe_user_subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          current_period_end: number | null
          current_period_start: number | null
          customer_id: string | null
          payment_method_brand: string | null
          payment_method_last4: string | null
          price_id: string | null
          subscription_id: string | null
          subscription_status:
            | Database["public"]["Enums"]["stripe_subscription_status"]
            | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      stripe_order_status: "pending" | "completed" | "canceled"
      stripe_subscription_status:
        | "not_started"
        | "incomplete"
        | "incomplete_expired"
        | "trialing"
        | "active"
        | "past_due"
        | "canceled"
        | "unpaid"
        | "paused"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      stripe_order_status: ["pending", "completed", "canceled"],
      stripe_subscription_status: [
        "not_started",
        "incomplete",
        "incomplete_expired",
        "trialing",
        "active",
        "past_due",
        "canceled",
        "unpaid",
        "paused",
      ],
    },
  },
} as const
