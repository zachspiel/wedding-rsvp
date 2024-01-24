import { Guest } from "@spiel-wedding/types/Guest";

export type Json =
  | string
  | number
  | boolean
  | { [key: string]: Json | undefined }
  | Json[];

export type NewGroup = Database["public"]["Tables"]["group"]["Update"];
export type NewGuest = Database["public"]["Tables"]["guests"]["Insert"];
export type UpdateGuest = Database["public"]["Tables"]["guests"]["Update"];

export interface UpdateGuestFormState extends NewGroup {
  guests: Guest[];
}

export interface Database {
  public: {
    Tables: {
      gallery: {
        Row: {
          caption: string;
          created_at: string;
          id: string;
          imagePath: string;
          isVisible: boolean;
        };
        Insert: {
          caption?: string;
          created_at?: string;
          id?: string;
          imagePath?: string;
          isVisible?: boolean;
        };
        Update: {
          caption?: string;
          created_at?: string;
          id?: string;
          imagePath?: string;
          isVisible?: boolean;
        };
        Relationships: [];
      };
      group: {
        Row: {
          address1: string;
          address2: string;
          affiliation: string;
          city: string;
          country: string;
          created_at: string;
          dietaryRestrictions: string;
          edited_at: string;
          email: string;
          id: string;
          invited: boolean;
          inviteSent: boolean;
          message: string;
          phone: string;
          postal: string;
          rsvpModifications: string[];
          saveTheDateSent: boolean;
          state: string;
        };
        Insert: {
          address1?: string;
          address2?: string;
          affiliation?: string;
          city?: string;
          country?: string;
          created_at?: string;
          dietaryRestrictions?: string;
          edited_at?: string;
          email?: string;
          id?: string;
          invited?: boolean;
          inviteSent?: boolean;
          message?: string;
          phone?: string;
          postal?: string;
          rsvpModifications?: string[];
          saveTheDateSent?: boolean;
          state?: string;
        };
        Update: {
          address1?: string;
          address2?: string;
          affiliation?: string;
          city?: string;
          country?: string;
          created_at?: string;
          dietaryRestrictions?: string;
          edited_at?: string;
          email?: string;
          id?: string;
          invited?: boolean;
          inviteSent?: boolean;
          message?: string;
          phone?: string;
          postal?: string;
          rsvpModifications?: string[];
          saveTheDateSent?: boolean;
          state?: string;
        };
        Relationships: [];
      };
      guestbook: {
        Row: {
          createdAt: string;
          editedAt: string;
          email: string;
          id: string;
          isVisible: boolean;
          message: string;
          name: string;
        };
        Insert: {
          createdAt?: string;
          editedAt?: string;
          email: string;
          id?: string;
          isVisible?: boolean;
          message?: string;
          name?: string;
        };
        Update: {
          createdAt?: string;
          editedAt?: string;
          email?: string;
          id?: string;
          isVisible?: boolean;
          message?: string;
          name?: string;
        };
        Relationships: [];
      };
      guests: {
        Row: {
          createdAt: string;
          firstName: string;
          groupId: string;
          id: string;
          lastName: string;
          nameUnknown: boolean;
          relationshipType: string;
          rsvp: string;
          title: string;
        };
        Insert: {
          createdAt?: string;
          firstName?: string;
          groupId?: string;
          id?: string;
          lastName?: string;
          nameUnknown?: boolean;
          relationshipType?: string;
          rsvp?: string;
          title?: string;
        };
        Update: {
          createdAt?: string;
          firstName?: string;
          groupId?: string;
          id?: string;
          lastName?: string;
          nameUnknown?: boolean;
          relationshipType?: string;
          rsvp?: string;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "guests_groupId_fkey";
            columns: ["groupId"];
            isOneToOne: false;
            referencedRelation: "group";
            referencedColumns: ["id"];
          },
        ];
      };
      rsvp_modifications: {
        Row: {
          createdAt: string;
          groupId: string;
          id: string;
        };
        Insert: {
          createdAt?: string;
          groupId?: string;
          id?: string;
        };
        Update: {
          createdAt?: string;
          groupId?: string;
          id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "rsvp_modifications_groupId_fkey";
            columns: ["groupId"];
            isOneToOne: false;
            referencedRelation: "group";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never;
