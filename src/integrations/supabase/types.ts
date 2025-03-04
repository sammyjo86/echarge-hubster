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
      capacity_limit_overrides: {
        Row: {
          capacity_limit: number
          created_at: string | null
          grid_connection_transformer: string
          id: string
          schedule_id: string | null
          updated_at: string | null
        }
        Insert: {
          capacity_limit: number
          created_at?: string | null
          grid_connection_transformer: string
          id?: string
          schedule_id?: string | null
          updated_at?: string | null
        }
        Update: {
          capacity_limit?: number
          created_at?: string | null
          grid_connection_transformer?: string
          id?: string
          schedule_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "capacity_limit_overrides_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "schedules"
            referencedColumns: ["id"]
          },
        ]
      }
      chargers: {
        Row: {
          charge_point_id: string
          created_at: string | null
          id: string
          is_authorized: boolean | null
          last_boot_payload: Json | null
          location: string | null
          name: string
          password: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          charge_point_id: string
          created_at?: string | null
          id?: string
          is_authorized?: boolean | null
          last_boot_payload?: Json | null
          location?: string | null
          name: string
          password?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          charge_point_id?: string
          created_at?: string | null
          id?: string
          is_authorized?: boolean | null
          last_boot_payload?: Json | null
          location?: string | null
          name?: string
          password?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      charging_stations: {
        Row: {
          charge_point_id: string
          created_at: string | null
          firmware_version: string | null
          id: string
          last_heartbeat: string | null
          location: string | null
          name: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          charge_point_id: string
          created_at?: string | null
          firmware_version?: string | null
          id?: string
          last_heartbeat?: string | null
          location?: string | null
          name: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          charge_point_id?: string
          created_at?: string | null
          firmware_version?: string | null
          id?: string
          last_heartbeat?: string | null
          location?: string | null
          name?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      charging_transactions: {
        Row: {
          created_at: string | null
          end_time: string | null
          energy_delivered: number | null
          id: string
          meter_start: number | null
          meter_stop: number | null
          start_time: string | null
          station_id: string | null
          status: string | null
          transaction_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          end_time?: string | null
          energy_delivered?: number | null
          id?: string
          meter_start?: number | null
          meter_stop?: number | null
          start_time?: string | null
          station_id?: string | null
          status?: string | null
          transaction_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          end_time?: string | null
          energy_delivered?: number | null
          id?: string
          meter_start?: number | null
          meter_stop?: number | null
          start_time?: string | null
          station_id?: string | null
          status?: string | null
          transaction_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "charging_transactions_station_id_fkey"
            columns: ["station_id"]
            isOneToOne: false
            referencedRelation: "charging_stations"
            referencedColumns: ["id"]
          },
        ]
      }
      energy_price_overrides: {
        Row: {
          created_at: string | null
          grid_connection_transformer: string
          id: string
          price: number
          schedule_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          grid_connection_transformer: string
          id?: string
          price: number
          schedule_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          grid_connection_transformer?: string
          id?: string
          price?: number
          schedule_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "energy_price_overrides_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "schedules"
            referencedColumns: ["id"]
          },
        ]
      }
      recurrence_patterns: {
        Row: {
          created_at: string | null
          end_days: string[] | null
          end_time: string
          id: string
          recurring_days: string[] | null
          schedule_id: string | null
          start_day: string | null
          start_time: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          end_days?: string[] | null
          end_time: string
          id?: string
          recurring_days?: string[] | null
          schedule_id?: string | null
          start_day?: string | null
          start_time: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          end_days?: string[] | null
          end_time?: string
          id?: string
          recurring_days?: string[] | null
          schedule_id?: string | null
          start_day?: string | null
          start_time?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recurrence_patterns_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "schedules"
            referencedColumns: ["id"]
          },
        ]
      }
      schedules: {
        Row: {
          created_at: string | null
          dates_to_exclude: string[] | null
          description: string | null
          end: string | null
          id: string
          name: string
          parking_prohibited_chargers: string[] | null
          recurring: boolean | null
          schedule_type: string | null
          start: string
          time_zone_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          dates_to_exclude?: string[] | null
          description?: string | null
          end?: string | null
          id?: string
          name: string
          parking_prohibited_chargers?: string[] | null
          recurring?: boolean | null
          schedule_type?: string | null
          start: string
          time_zone_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          dates_to_exclude?: string[] | null
          description?: string | null
          end?: string | null
          id?: string
          name?: string
          parking_prohibited_chargers?: string[] | null
          recurring?: boolean | null
          schedule_type?: string | null
          start?: string
          time_zone_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      static_power_overrides: {
        Row: {
          chargers: string[] | null
          created_at: string | null
          id: string
          schedule_id: string | null
          updated_at: string | null
          value: number
        }
        Insert: {
          chargers?: string[] | null
          created_at?: string | null
          id?: string
          schedule_id?: string | null
          updated_at?: string | null
          value: number
        }
        Update: {
          chargers?: string[] | null
          created_at?: string | null
          id?: string
          schedule_id?: string | null
          updated_at?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "static_power_overrides_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "schedules"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
