

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pgsodium";






CREATE SCHEMA IF NOT EXISTS "private";


ALTER SCHEMA "private" OWNER TO "postgres";


CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."check_request"() RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$declare
  req_app_api_key text := current_setting('request.headers', true)::json->>'x-app-api-key';
  is_app_api_key_registered boolean;
begin
  if current_role <> 'anon' then
    -- not `anon` role, allow the request to pass
    return;
  end if;
  
  select
    true into is_app_api_key_registered
  from private.anon_api_keys
  where
    id = req_app_api_key
  limit 1;

  if is_app_api_key_registered is true then
    -- api key is registered, allow the request to pass
    return;
  end if;

  raise sqlstate 'PGRST' using
    message = json_build_object(
      'message', 'No registered API key found in x-app-api-key header.')::text,
    detail = json_build_object(
      'status', 403)::text;
end;$$;


ALTER FUNCTION "public"."check_request"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."decrement_comment_likes"("x" integer, "row_id" "uuid") RETURNS "void"
    LANGUAGE "sql"
    AS $$
  update guest_image_comments 
  set likes = GREATEST(likes - x, 0)
  where comment_id = row_id
$$;


ALTER FUNCTION "public"."decrement_comment_likes"("x" integer, "row_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."decrement_likes"("x" integer, "row_id" "uuid") RETURNS "void"
    LANGUAGE "sql"
    AS $$
  update guest_uploaded_images 
  set likes = GREATEST(likes - x, 0)
  where file_id = row_id
$$;


ALTER FUNCTION "public"."decrement_likes"("x" integer, "row_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."increment_comment_likes"("x" integer, "row_id" "uuid") RETURNS "void"
    LANGUAGE "sql"
    AS $$update guest_image_comments
  set likes = likes + x
  where comment_id = row_id$$;


ALTER FUNCTION "public"."increment_comment_likes"("x" integer, "row_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."increment_downloads"("x" integer, "row_id" "uuid") RETURNS "void"
    LANGUAGE "sql"
    AS $$
  update guest_uploaded_images 
  set downloads = downloads + x
  where file_id = row_id
$$;


ALTER FUNCTION "public"."increment_downloads"("x" integer, "row_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."increment_likes"("x" integer, "row_id" "uuid") RETURNS "void"
    LANGUAGE "sql"
    AS $$
  update guest_uploaded_images 
  set likes = likes + x
  where file_id = row_id
$$;


ALTER FUNCTION "public"."increment_likes"("x" integer, "row_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."increment_likes_comment"("row_id" "uuid") RETURNS "void"
    LANGUAGE "sql"
    AS $$
  update public.guest_image_comments 
  set likes = likes + 1
  where comment_id = row_id;
$$;


ALTER FUNCTION "public"."increment_likes_comment"("row_id" "uuid") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "private"."anon_api_keys" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


ALTER TABLE "private"."anon_api_keys" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."event" (
    "event_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "order" bigint,
    "title" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "date" "text",
    "time" "text",
    "address1" "text",
    "address2" "text",
    "city" "text",
    "state" "text",
    "postal" "text",
    "location" "text",
    "emoji" "text",
    "auto_invite" boolean DEFAULT false,
    "attire" "text" DEFAULT ''::"text",
    "imageUrl" "text"
);


ALTER TABLE "public"."event" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."event_responses" (
    "response_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "eventId" "uuid",
    "rsvp" "text",
    "response_created_at" timestamp with time zone DEFAULT "now"(),
    "guestId" "uuid"
);


ALTER TABLE "public"."event_responses" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."faq" (
    "faq_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "question" "text",
    "answer" "text",
    "element" "text",
    "position" bigint NOT NULL
);


ALTER TABLE "public"."faq" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."gallery" (
    "gallery_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "caption" "text",
    "imagePath" "text",
    "isVisible" boolean
);


ALTER TABLE "public"."gallery" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."group" (
    "group_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "edited_at" timestamp without time zone DEFAULT "now"(),
    "phone" "text",
    "email" "text",
    "affiliation" "text",
    "address1" "text",
    "address2" "text",
    "city" "text",
    "state" "text",
    "postal" "text",
    "country" "text",
    "inviteSent" boolean,
    "invited" boolean,
    "message" "text",
    "saveTheDateSent" boolean,
    "dietaryRestrictions" "text",
    "rsvpModifications" "uuid"[],
    "table" "text"
);


ALTER TABLE "public"."group" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."guest_image_comments" (
    "comment_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "first_name" "text" DEFAULT ''::"text",
    "last_name" "text" DEFAULT ''::"text",
    "message" "text" DEFAULT ''::"text",
    "likes" numeric DEFAULT '0'::numeric,
    "file_id" "uuid"
);


ALTER TABLE "public"."guest_image_comments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."guest_image_likes" (
    "guest_like_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "file_id" "uuid" DEFAULT "gen_random_uuid"()
);


ALTER TABLE "public"."guest_image_likes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."guest_uploaded_images" (
    "file_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "first_name" "text",
    "last_name" "text",
    "file_name" "text",
    "mime_type" "text",
    "downloads" numeric DEFAULT '0'::numeric NOT NULL,
    "likes" numeric DEFAULT '0'::numeric NOT NULL,
    "image_tag" "text"
);


ALTER TABLE "public"."guest_uploaded_images" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."guestbook" (
    "createdAt" timestamp with time zone DEFAULT "now"() NOT NULL,
    "editedAt" timestamp without time zone,
    "name" "text",
    "email" "text" NOT NULL,
    "message" "text",
    "isVisible" boolean,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


ALTER TABLE "public"."guestbook" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."guests" (
    "guest_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "guest_created_at" timestamp with time zone DEFAULT "now"(),
    "title" "text" DEFAULT ''::"text",
    "firstName" "text",
    "lastName" "text",
    "nameUnknown" boolean DEFAULT false,
    "rsvp" "text",
    "relationshipType" "text",
    "groupId" "uuid"
);


ALTER TABLE "public"."guests" OWNER TO "postgres";


ALTER TABLE ONLY "private"."anon_api_keys"
    ADD CONSTRAINT "anon_api_keys_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."event"
    ADD CONSTRAINT "event_pkey" PRIMARY KEY ("event_id");



ALTER TABLE ONLY "public"."event_responses"
    ADD CONSTRAINT "event_responses_pkey" PRIMARY KEY ("response_id");



ALTER TABLE ONLY "public"."faq"
    ADD CONSTRAINT "faq_pkey" PRIMARY KEY ("faq_id");



ALTER TABLE ONLY "public"."gallery"
    ADD CONSTRAINT "gallery_pkey" PRIMARY KEY ("gallery_id");



ALTER TABLE ONLY "public"."group"
    ADD CONSTRAINT "group_pkey" PRIMARY KEY ("group_id");



ALTER TABLE ONLY "public"."guest_image_likes"
    ADD CONSTRAINT "guest_image_likes_pkey" PRIMARY KEY ("guest_like_id");



ALTER TABLE ONLY "public"."guest_image_comments"
    ADD CONSTRAINT "guest_photo_comments_pkey" PRIMARY KEY ("comment_id");



ALTER TABLE ONLY "public"."guest_uploaded_images"
    ADD CONSTRAINT "guest_uploaded_files_pkey" PRIMARY KEY ("file_id");



ALTER TABLE ONLY "public"."guestbook"
    ADD CONSTRAINT "guestbook_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."guests"
    ADD CONSTRAINT "guests_pkey" PRIMARY KEY ("guest_id");



ALTER TABLE ONLY "public"."event_responses"
    ADD CONSTRAINT "event_responses_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."event"("event_id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."event_responses"
    ADD CONSTRAINT "event_responses_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "public"."guests"("guest_id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."guest_image_likes"
    ADD CONSTRAINT "guest_image_likes_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "public"."guest_uploaded_images"("file_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."guest_image_comments"
    ADD CONSTRAINT "guest_photo_comments_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "public"."guest_uploaded_images"("file_id");



ALTER TABLE ONLY "public"."guests"
    ADD CONSTRAINT "guests_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."group"("group_id") ON UPDATE CASCADE ON DELETE CASCADE;



CREATE POLICY "allow authenticator to access" ON "private"."anon_api_keys" FOR SELECT TO "authenticator" USING (true);



ALTER TABLE "private"."anon_api_keys" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Allow authenticated users to remove event" ON "public"."event" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "Allow authenticated users to update" ON "public"."event" FOR UPDATE TO "authenticated", "service_role", "supabase_admin" USING (true);



CREATE POLICY "Allow guests to find RSVP" ON "public"."guests" FOR SELECT TO "anon" USING (true);



CREATE POLICY "Allow guests to find event" ON "public"."event" FOR SELECT USING (true);



CREATE POLICY "Allow guests to modify RSVP" ON "public"."guests" FOR UPDATE WITH CHECK (true);



CREATE POLICY "Allow guests to view gallery" ON "public"."guest_uploaded_images" FOR SELECT USING (true);



CREATE POLICY "Allow to search for RSVP" ON "public"."group" FOR SELECT USING (true);



CREATE POLICY "Allow users to modify RSVP status" ON "public"."group" FOR UPDATE WITH CHECK (true);



CREATE POLICY "Enable delete for admin users" ON "public"."guest_image_comments" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "Enable delete for authenticated users" ON "public"."gallery" FOR DELETE TO "authenticated" USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Enable delete for authenticated users only" ON "public"."faq" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "Enable insert for all users" ON "public"."guestbook" FOR INSERT WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."event" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."faq" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."gallery" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for guests" ON "public"."guest_image_comments" FOR INSERT WITH CHECK (true);



CREATE POLICY "Enable insert for guests" ON "public"."guest_uploaded_images" FOR INSERT WITH CHECK (true);



CREATE POLICY "Enable insert for users based on user_id" ON "public"."gallery" TO "service_role" USING (true);



CREATE POLICY "Enable modifications for authenticated users only" ON "public"."group" TO "authenticated", "service_role" USING (true) WITH CHECK (true);



CREATE POLICY "Enable modifications to authenticated users only" ON "public"."guests" TO "authenticated", "service_role" USING (true) WITH CHECK (true);



CREATE POLICY "Enable read access for all users" ON "public"."event_responses" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."faq" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."gallery" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."guest_image_comments" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."guest_uploaded_images" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."guestbook" FOR SELECT USING (true);



CREATE POLICY "Enable update for authenticated users only" ON "public"."faq" FOR UPDATE TO "authenticated" USING (true);



CREATE POLICY "Enable update for guests" ON "public"."guest_uploaded_images" FOR UPDATE USING (true);



CREATE POLICY "Enable update for users" ON "public"."event_responses" FOR UPDATE USING (true);



CREATE POLICY "Enable update for users based on email" ON "public"."guestbook" FOR UPDATE USING (true) WITH CHECK (true);



CREATE POLICY "Enable updates for authenticated users only" ON "public"."gallery" FOR UPDATE TO "authenticated" USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "admin all commands" ON "public"."event_responses" TO "authenticated" USING (true);



CREATE POLICY "admin_access" ON "public"."gallery" TO "authenticated";



ALTER TABLE "public"."event" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."event_responses" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."faq" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."gallery" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."group" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."guest_image_comments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."guest_image_likes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."guest_uploaded_images" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."guestbook" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."guests" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."guestbook";



REVOKE USAGE ON SCHEMA "public" FROM PUBLIC;
GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

















































































































































































GRANT ALL ON FUNCTION "public"."check_request"() TO "anon";
GRANT ALL ON FUNCTION "public"."check_request"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_request"() TO "service_role";



GRANT ALL ON FUNCTION "public"."decrement_comment_likes"("x" integer, "row_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."decrement_comment_likes"("x" integer, "row_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."decrement_comment_likes"("x" integer, "row_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."decrement_likes"("x" integer, "row_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."decrement_likes"("x" integer, "row_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."decrement_likes"("x" integer, "row_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."increment_comment_likes"("x" integer, "row_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."increment_comment_likes"("x" integer, "row_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."increment_comment_likes"("x" integer, "row_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."increment_downloads"("x" integer, "row_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."increment_downloads"("x" integer, "row_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."increment_downloads"("x" integer, "row_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."increment_likes"("x" integer, "row_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."increment_likes"("x" integer, "row_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."increment_likes"("x" integer, "row_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."increment_likes_comment"("row_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."increment_likes_comment"("row_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."increment_likes_comment"("row_id" "uuid") TO "service_role";


















GRANT ALL ON TABLE "public"."event" TO "anon";
GRANT ALL ON TABLE "public"."event" TO "authenticated";
GRANT ALL ON TABLE "public"."event" TO "service_role";



GRANT ALL ON TABLE "public"."event_responses" TO "anon";
GRANT ALL ON TABLE "public"."event_responses" TO "authenticated";
GRANT ALL ON TABLE "public"."event_responses" TO "service_role";



GRANT ALL ON TABLE "public"."faq" TO "anon";
GRANT ALL ON TABLE "public"."faq" TO "authenticated";
GRANT ALL ON TABLE "public"."faq" TO "service_role";



GRANT ALL ON TABLE "public"."gallery" TO "anon";
GRANT ALL ON TABLE "public"."gallery" TO "authenticated";
GRANT ALL ON TABLE "public"."gallery" TO "service_role";



GRANT ALL ON TABLE "public"."group" TO "anon";
GRANT ALL ON TABLE "public"."group" TO "authenticated";
GRANT ALL ON TABLE "public"."group" TO "service_role";



GRANT ALL ON TABLE "public"."guest_image_comments" TO "anon";
GRANT ALL ON TABLE "public"."guest_image_comments" TO "authenticated";
GRANT ALL ON TABLE "public"."guest_image_comments" TO "service_role";



GRANT ALL ON TABLE "public"."guest_image_likes" TO "anon";
GRANT ALL ON TABLE "public"."guest_image_likes" TO "authenticated";
GRANT ALL ON TABLE "public"."guest_image_likes" TO "service_role";



GRANT ALL ON TABLE "public"."guest_uploaded_images" TO "anon";
GRANT ALL ON TABLE "public"."guest_uploaded_images" TO "authenticated";
GRANT ALL ON TABLE "public"."guest_uploaded_images" TO "service_role";



GRANT ALL ON TABLE "public"."guestbook" TO "anon";
GRANT ALL ON TABLE "public"."guestbook" TO "authenticated";
GRANT ALL ON TABLE "public"."guestbook" TO "service_role";



GRANT ALL ON TABLE "public"."guests" TO "anon";
GRANT ALL ON TABLE "public"."guests" TO "authenticated";
GRANT ALL ON TABLE "public"."guests" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























