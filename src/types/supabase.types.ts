export type Json =
  string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "12.0.2";
  };
  public: {
    Tables: {
      event: {
        Row: {
          address1: string | null;
          address2: string | null;
          attire: string | null;
          auto_invite: boolean | null;
          city: string | null;
          created_at: string;
          date: string | null;
          emoji: string | null;
          event_id: string;
          imageUrl: string | null;
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
          attire?: string | null;
          auto_invite?: boolean | null;
          city?: string | null;
          created_at?: string;
          date?: string | null;
          emoji?: string | null;
          event_id?: string;
          imageUrl?: string | null;
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
          attire?: string | null;
          auto_invite?: boolean | null;
          city?: string | null;
          created_at?: string;
          date?: string | null;
          emoji?: string | null;
          event_id?: string;
          imageUrl?: string | null;
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
          eventId: string | null;
          guestId: string | null;
          response_created_at: string | null;
          response_id: string;
          rsvp: string | null;
        };
        Insert: {
          eventId?: string | null;
          guestId?: string | null;
          response_created_at?: string | null;
          response_id?: string;
          rsvp?: string | null;
        };
        Update: {
          eventId?: string | null;
          guestId?: string | null;
          response_created_at?: string | null;
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
          },
        ];
      };
      faq: {
        Row: {
          answer: string;
          created_at: string;
          element: string | null;
          faq_id: string;
          position: number;
          question: string;
        };
        Insert: {
          answer: string;
          created_at?: string;
          element?: string | null;
          faq_id?: string;
          position: number;
          question: string;
        };
        Update: {
          answer?: string;
          created_at?: string;
          element?: string | null;
          faq_id?: string;
          position?: number;
          question?: string;
        };
        Relationships: [];
      };
      gallery: {
        Row: {
          caption: string | null;
          created_at: string;
          gallery_id: string;
          imagePath: string;
          isVisible: boolean;
        };
        Insert: {
          caption?: string | null;
          created_at?: string;
          gallery_id?: string;
          imagePath: string;
          isVisible?: boolean;
        };
        Update: {
          caption?: string | null;
          created_at?: string;
          gallery_id?: string;
          imagePath?: string;
          isVisible?: boolean;
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
          created_at: string | null;
          dietaryRestrictions: string | null;
          edited_at: string | null;
          email: string | null;
          group_id: string;
          invited: boolean | null;
          inviteSent: boolean;
          message: string | null;
          phone: string | null;
          postal: string | null;
          rsvpModifications: string[] | null;
          saveTheDateSent: boolean;
          state: string | null;
          table: string | null;
        };
        Insert: {
          address1?: string | null;
          address2?: string | null;
          affiliation?: string | null;
          city?: string | null;
          country?: string | null;
          created_at?: string | null;
          dietaryRestrictions?: string | null;
          edited_at?: string | null;
          email?: string | null;
          group_id?: string;
          invited?: boolean | null;
          inviteSent?: boolean;
          message?: string | null;
          phone?: string | null;
          postal?: string | null;
          rsvpModifications?: string[] | null;
          saveTheDateSent?: boolean;
          state?: string | null;
          table?: string | null;
        };
        Update: {
          address1?: string | null;
          address2?: string | null;
          affiliation?: string | null;
          city?: string | null;
          country?: string | null;
          created_at?: string | null;
          dietaryRestrictions?: string | null;
          edited_at?: string | null;
          email?: string | null;
          group_id?: string;
          invited?: boolean | null;
          inviteSent?: boolean;
          message?: string | null;
          phone?: string | null;
          postal?: string | null;
          rsvpModifications?: string[] | null;
          saveTheDateSent?: boolean;
          state?: string | null;
          table?: string | null;
        };
        Relationships: [];
      };
      guest_image_comments: {
        Row: {
          comment_id: string;
          created_at: string;
          file_id: string | null;
          first_name: string | null;
          last_name: string | null;
          likes: number | null;
          message: string | null;
        };
        Insert: {
          comment_id?: string;
          created_at?: string;
          file_id?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          likes?: number | null;
          message?: string | null;
        };
        Update: {
          comment_id?: string;
          created_at?: string;
          file_id?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          likes?: number | null;
          message?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "guest_photo_comments_file_id_fkey";
            columns: ["file_id"];
            isOneToOne: false;
            referencedRelation: "guest_uploaded_images";
            referencedColumns: ["file_id"];
          },
        ];
      };
      guest_image_likes: {
        Row: {
          created_at: string;
          file_id: string | null;
          guest_like_id: string;
        };
        Insert: {
          created_at?: string;
          file_id?: string | null;
          guest_like_id?: string;
        };
        Update: {
          created_at?: string;
          file_id?: string | null;
          guest_like_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "guest_image_likes_file_id_fkey";
            columns: ["file_id"];
            isOneToOne: false;
            referencedRelation: "guest_uploaded_images";
            referencedColumns: ["file_id"];
          },
        ];
      };
      guest_uploaded_images: {
        Row: {
          created_at: string;
          downloads: number;
          file_id: string;
          file_name: string | null;
          first_name: string | null;
          image_tag: string | null;
          last_name: string | null;
          likes: number;
          mime_type: string | null;
        };
        Insert: {
          created_at?: string;
          downloads?: number;
          file_id?: string;
          file_name?: string | null;
          first_name?: string | null;
          image_tag?: string | null;
          last_name?: string | null;
          likes?: number;
          mime_type?: string | null;
        };
        Update: {
          created_at?: string;
          downloads?: number;
          file_id?: string;
          file_name?: string | null;
          first_name?: string | null;
          image_tag?: string | null;
          last_name?: string | null;
          likes?: number;
          mime_type?: string | null;
        };
        Relationships: [];
      };
      guestbook: {
        Row: {
          createdAt: string;
          editedAt: string | null;
          email: string;
          id: string;
          isVisible: boolean;
          message: string;
          name: string;
        };
        Insert: {
          createdAt?: string;
          editedAt?: string | null;
          email: string;
          id?: string;
          isVisible?: boolean;
          message: string;
          name: string;
        };
        Update: {
          createdAt?: string;
          editedAt?: string | null;
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
          firstName: string | null;
          groupId: string;
          guest_created_at: string | null;
          guest_id: string;
          lastName: string | null;
          nameUnknown: boolean | null;
          relationshipType: string | null;
          rsvp: string | null;
          title: string | null;
        };
        Insert: {
          firstName?: string | null;
          groupId: string;
          guest_created_at?: string | null;
          guest_id?: string;
          lastName?: string | null;
          nameUnknown?: boolean | null;
          relationshipType?: string | null;
          rsvp?: string | null;
          title?: string | null;
        };
        Update: {
          firstName?: string | null;
          groupId?: string;
          guest_created_at?: string | null;
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
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      check_request: { Args: never; Returns: undefined };
      decrement_comment_likes: {
        Args: { row_id: string; x: number };
        Returns: undefined;
      };
      decrement_likes: {
        Args: { row_id: string; x: number };
        Returns: undefined;
      };
      increment_comment_likes: {
        Args: { row_id: string; x: number };
        Returns: undefined;
      };
      increment_downloads: {
        Args: { row_id: string; x: number };
        Returns: undefined;
      };
      increment_likes: {
        Args: { row_id: string; x: number };
        Returns: undefined;
      };
      increment_likes_comment: { Args: { row_id: string }; Returns: undefined };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
