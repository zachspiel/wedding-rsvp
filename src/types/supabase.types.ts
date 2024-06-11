export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      event: {
        Row: {
          address1: string | null;
          address2: string | null;
          city: string | null;
          created_at: string;
          date: string | null;
          event_id: string;
          location: string | null;
          order: number | null;
          postal: string | null;
          state: string | null;
          time: string | null;
          title: string | null;
        };
        Insert: {
          address1?: string | null;
          address2?: string | null;
          city?: string | null;
          created_at?: string;
          date?: string | null;
          event_id?: string;
          location?: string | null;
          order?: number | null;
          postal?: string | null;
          state?: string | null;
          time?: string | null;
          title?: string | null;
        };
        Update: {
          address1?: string | null;
          address2?: string | null;
          city?: string | null;
          created_at?: string;
          date?: string | null;
          event_id?: string;
          location?: string | null;
          order?: number | null;
          postal?: string | null;
          state?: string | null;
          time?: string | null;
          title?: string | null;
        };
        Relationships: [];
      };
      event_responses: {
        Row: {
          created_at: string;
          eventId: string | null;
          guestId: string | null;
          response_id: string;
          rsvp: string | null;
        };
        Insert: {
          created_at?: string;
          eventId?: string | null;
          guestId?: string | null;
          response_id?: string;
          rsvp?: string | null;
        };
        Update: {
          created_at?: string;
          eventId?: string | null;
          guestId?: string | null;
          response_id?: string;
          rsvp?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "event_responses_eventId_fkey";
            columns: ["eventId"];
            isOneToOne: false;
            referencedRelation: "event";
            referencedColumns: ["event_id"];
          },
          {
            foreignKeyName: "event_responses_guestId_fkey";
            columns: ["guestId"];
            isOneToOne: false;
            referencedRelation: "guests";
            referencedColumns: ["guest_id"];
          }
        ];
      };
      gallery: {
        Row: {
          caption: string | null;
          created_at: string;
          gallery_id: string;
          imagePath: string | null;
          isVisible: boolean | null;
        };
        Insert: {
          caption?: string | null;
          created_at?: string;
          gallery_id?: string;
          imagePath?: string | null;
          isVisible?: boolean | null;
        };
        Update: {
          caption?: string | null;
          created_at?: string;
          gallery_id?: string;
          imagePath?: string | null;
          isVisible?: boolean | null;
        };
        Relationships: [];
      };
      group: {
        Row: {
          address1: string | null;
          address2: string | null;
          affiliation: string | null;
          city: string | null;
          country: string | null;
          created_at: string;
          dietaryRestrictions: string | null;
          edited_at: string | null;
          email: string | null;
          group_id: string;
          invited: boolean | null;
          inviteSent: boolean | null;
          message: string | null;
          phone: string | null;
          postal: string | null;
          rsvpModifications: string[] | null;
          saveTheDateSent: boolean | null;
          state: string | null;
        };
        Insert: {
          address1?: string | null;
          address2?: string | null;
          affiliation?: string | null;
          city?: string | null;
          country?: string | null;
          created_at?: string;
          dietaryRestrictions?: string | null;
          edited_at?: string | null;
          email?: string | null;
          group_id?: string;
          invited?: boolean | null;
          inviteSent?: boolean | null;
          message?: string | null;
          phone?: string | null;
          postal?: string | null;
          rsvpModifications?: string[] | null;
          saveTheDateSent?: boolean | null;
          state?: string | null;
        };
        Update: {
          address1?: string | null;
          address2?: string | null;
          affiliation?: string | null;
          city?: string | null;
          country?: string | null;
          created_at?: string;
          dietaryRestrictions?: string | null;
          edited_at?: string | null;
          email?: string | null;
          group_id?: string;
          invited?: boolean | null;
          inviteSent?: boolean | null;
          message?: string | null;
          phone?: string | null;
          postal?: string | null;
          rsvpModifications?: string[] | null;
          saveTheDateSent?: boolean | null;
          state?: string | null;
        };
        Relationships: [];
      };
      guestbook: {
        Row: {
          createdAt: string;
          editedAt: string | null;
          email: string;
          id: string;
          isVisible: boolean | null;
          message: string | null;
          name: string | null;
        };
        Insert: {
          createdAt?: string;
          editedAt?: string | null;
          email: string;
          id?: string;
          isVisible?: boolean | null;
          message?: string | null;
          name?: string | null;
        };
        Update: {
          createdAt?: string;
          editedAt?: string | null;
          email?: string;
          id?: string;
          isVisible?: boolean | null;
          message?: string | null;
          name?: string | null;
        };
        Relationships: [];
      };
      guests: {
        Row: {
          createdAt: string | null;
          firstName: string | null;
          groupId: string | null;
          guest_id: string;
          lastName: string | null;
          nameUnknown: boolean | null;
          relationshipType: string | null;
          rsvp: string | null;
          title: string | null;
        };
        Insert: {
          createdAt?: string | null;
          firstName?: string | null;
          groupId?: string | null;
          guest_id?: string;
          lastName?: string | null;
          nameUnknown?: boolean | null;
          relationshipType?: string | null;
          rsvp?: string | null;
          title?: string | null;
        };
        Update: {
          createdAt?: string | null;
          firstName?: string | null;
          groupId?: string | null;
          guest_id?: string;
          lastName?: string | null;
          nameUnknown?: boolean | null;
          relationshipType?: string | null;
          rsvp?: string | null;
          title?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "guests_groupId_fkey";
            columns: ["groupId"];
            isOneToOne: false;
            referencedRelation: "group";
            referencedColumns: ["group_id"];
          },
          {
            foreignKeyName: "guests_groupId_fkey";
            columns: ["groupId"];
            isOneToOne: false;
            referencedRelation: "test_groups";
            referencedColumns: ["id"];
          }
        ];
      };
      rsvp_modifications: {
        Row: {
          createdAt: string;
          groupId: string | null;
          id: string;
        };
        Insert: {
          createdAt?: string;
          groupId?: string | null;
          id?: string;
        };
        Update: {
          createdAt?: string;
          groupId?: string | null;
          id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      test_groups: {
        Row: {
          address1: string | null;
          address2: string | null;
          affiliation: string | null;
          city: string | null;
          country: string | null;
          created_at: string | null;
          dietaryRestrictions: string | null;
          edited_at: string | null;
          email: string | null;
          firstName: string | null;
          groupId: string | null;
          id: string | null;
          invited: boolean | null;
          inviteSent: boolean | null;
          lastName: string | null;
          message: string | null;
          phone: string | null;
          postal: string | null;
          rsvpModifications: string[] | null;
          saveTheDateSent: boolean | null;
          state: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "guests_groupId_fkey";
            columns: ["groupId"];
            isOneToOne: false;
            referencedRelation: "group";
            referencedColumns: ["group_id"];
          },
          {
            foreignKeyName: "guests_groupId_fkey";
            columns: ["groupId"];
            isOneToOne: false;
            referencedRelation: "test_groups";
            referencedColumns: ["id"];
          }
        ];
      };
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
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] & PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;
