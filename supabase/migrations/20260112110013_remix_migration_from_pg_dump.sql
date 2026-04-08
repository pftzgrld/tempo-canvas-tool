CREATE EXTENSION IF NOT EXISTS "pg_graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "plpgsql";
CREATE EXTENSION IF NOT EXISTS "supabase_vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
BEGIN;

--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: deck_agenda; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.deck_agenda (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    deck_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    duration integer DEFAULT 5,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: deck_calls; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.deck_calls (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    deck_id uuid NOT NULL,
    title text NOT NULL,
    call_date timestamp with time zone,
    notes text,
    action_items text[],
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: deck_executive_summary; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.deck_executive_summary (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    deck_id uuid NOT NULL,
    summary_title text,
    summary_description text,
    focus_title text,
    focus_description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: deck_goals; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.deck_goals (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    deck_id uuid NOT NULL,
    title text NOT NULL,
    status text DEFAULT 'not-started'::text,
    priority text,
    due_date date,
    progress_percent integer DEFAULT 0,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: deck_governance; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.deck_governance (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    deck_id uuid NOT NULL,
    title text NOT NULL,
    governance_type text,
    frequency text,
    attendees text[],
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: deck_metrics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.deck_metrics (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    deck_id uuid NOT NULL,
    title text NOT NULL,
    baseline_value text,
    target_value text,
    current_value text,
    status text DEFAULT 'on-track'::text,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: deck_milestones; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.deck_milestones (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    deck_id uuid NOT NULL,
    program_id uuid,
    title text NOT NULL,
    milestone_date date,
    status text DEFAULT 'upcoming'::text,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: deck_next_meeting; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.deck_next_meeting (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    deck_id uuid NOT NULL,
    title text,
    meeting_date date,
    meeting_time time without time zone,
    agenda_items text[],
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: deck_priorities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.deck_priorities (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    deck_id uuid NOT NULL,
    title text NOT NULL,
    status text DEFAULT 'not-started'::text,
    owner_type text,
    due_date date,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: deck_programs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.deck_programs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    deck_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    status text DEFAULT 'planned'::text,
    start_date date,
    end_date date,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: deck_resources; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.deck_resources (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    deck_id uuid NOT NULL,
    title text NOT NULL,
    url text,
    category text,
    icon text,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: deck_risks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.deck_risks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    deck_id uuid NOT NULL,
    title text NOT NULL,
    risk_type text,
    severity text DEFAULT 'medium'::text,
    mitigation text,
    status text DEFAULT 'open'::text,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: deck_team_members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.deck_team_members (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    deck_id uuid NOT NULL,
    name text NOT NULL,
    title text,
    email text,
    phone text,
    photo_url text,
    linkedin_url text,
    calendar_link text,
    team_type text DEFAULT 'internal'::text,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: deck_use_cases; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.deck_use_cases (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    deck_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    category text,
    status text DEFAULT 'planned'::text,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: decks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.decks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    status text DEFAULT 'draft'::text,
    slide_order text[],
    hidden_slides text[],
    visible_sections text[],
    closing_next_steps text[],
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: deck_agenda deck_agenda_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deck_agenda
    ADD CONSTRAINT deck_agenda_pkey PRIMARY KEY (id);


--
-- Name: deck_calls deck_calls_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deck_calls
    ADD CONSTRAINT deck_calls_pkey PRIMARY KEY (id);


--
-- Name: deck_executive_summary deck_executive_summary_deck_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deck_executive_summary
    ADD CONSTRAINT deck_executive_summary_deck_id_key UNIQUE (deck_id);


--
-- Name: deck_executive_summary deck_executive_summary_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deck_executive_summary
    ADD CONSTRAINT deck_executive_summary_pkey PRIMARY KEY (id);


--
-- Name: deck_goals deck_goals_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deck_goals
    ADD CONSTRAINT deck_goals_pkey PRIMARY KEY (id);


--
-- Name: deck_governance deck_governance_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deck_governance
    ADD CONSTRAINT deck_governance_pkey PRIMARY KEY (id);


--
-- Name: deck_metrics deck_metrics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deck_metrics
    ADD CONSTRAINT deck_metrics_pkey PRIMARY KEY (id);


--
-- Name: deck_milestones deck_milestones_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deck_milestones
    ADD CONSTRAINT deck_milestones_pkey PRIMARY KEY (id);


--
-- Name: deck_next_meeting deck_next_meeting_deck_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deck_next_meeting
    ADD CONSTRAINT deck_next_meeting_deck_id_key UNIQUE (deck_id);


--
-- Name: deck_next_meeting deck_next_meeting_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deck_next_meeting
    ADD CONSTRAINT deck_next_meeting_pkey PRIMARY KEY (id);


--
-- Name: deck_priorities deck_priorities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deck_priorities
    ADD CONSTRAINT deck_priorities_pkey PRIMARY KEY (id);


--
-- Name: deck_programs deck_programs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deck_programs
    ADD CONSTRAINT deck_programs_pkey PRIMARY KEY (id);


--
-- Name: deck_resources deck_resources_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deck_resources
    ADD CONSTRAINT deck_resources_pkey PRIMARY KEY (id);


--
-- Name: deck_risks deck_risks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deck_risks
    ADD CONSTRAINT deck_risks_pkey PRIMARY KEY (id);


--
-- Name: deck_team_members deck_team_members_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deck_team_members
    ADD CONSTRAINT deck_team_members_pkey PRIMARY KEY (id);


--
-- Name: deck_use_cases deck_use_cases_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deck_use_cases
    ADD CONSTRAINT deck_use_cases_pkey PRIMARY KEY (id);


--
-- Name: decks decks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.decks
    ADD CONSTRAINT decks_pkey PRIMARY KEY (id);


--
-- Name: deck_agenda update_deck_agenda_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_deck_agenda_updated_at BEFORE UPDATE ON public.deck_agenda FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: deck_calls update_deck_calls_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_deck_calls_updated_at BEFORE UPDATE ON public.deck_calls FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: deck_executive_summary update_deck_executive_summary_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_deck_executive_summary_updated_at BEFORE UPDATE ON public.deck_executive_summary FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: deck_goals update_deck_goals_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_deck_goals_updated_at BEFORE UPDATE ON public.deck_goals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: deck_governance update_deck_governance_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_deck_governance_updated_at BEFORE UPDATE ON public.deck_governance FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: deck_metrics update_deck_metrics_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_deck_metrics_updated_at BEFORE UPDATE ON public.deck_metrics FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: deck_milestones update_deck_milestones_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_deck_milestones_updated_at BEFORE UPDATE ON public.deck_milestones FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: deck_next_meeting update_deck_next_meeting_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_deck_next_meeting_updated_at BEFORE UPDATE ON public.deck_next_meeting FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: deck_priorities update_deck_priorities_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_deck_priorities_updated_at BEFORE UPDATE ON public.deck_priorities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: deck_programs update_deck_programs_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_deck_programs_updated_at BEFORE UPDATE ON public.deck_programs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: deck_resources update_deck_resources_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_deck_resources_updated_at BEFORE UPDATE ON public.deck_resources FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: deck_risks update_deck_risks_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_deck_risks_updated_at BEFORE UPDATE ON public.deck_risks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: deck_team_members update_deck_team_members_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_deck_team_members_updated_at BEFORE UPDATE ON public.deck_team_members FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: deck_use_cases update_deck_use_cases_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_deck_use_cases_updated_at BEFORE UPDATE ON public.deck_use_cases FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: decks update_decks_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_decks_updated_at BEFORE UPDATE ON public.decks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: deck_agenda deck_agenda_deck_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deck_agenda
    ADD CONSTRAINT deck_agenda_deck_id_fkey FOREIGN KEY (deck_id) REFERENCES public.decks(id) ON DELETE CASCADE;


--
-- Name: deck_calls deck_calls_deck_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deck_calls
    ADD CONSTRAINT deck_calls_deck_id_fkey FOREIGN KEY (deck_id) REFERENCES public.decks(id) ON DELETE CASCADE;


--
-- Name: deck_executive_summary deck_executive_summary_deck_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deck_executive_summary
    ADD CONSTRAINT deck_executive_summary_deck_id_fkey FOREIGN KEY (deck_id) REFERENCES public.decks(id) ON DELETE CASCADE;


--
-- Name: deck_goals deck_goals_deck_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deck_goals
    ADD CONSTRAINT deck_goals_deck_id_fkey FOREIGN KEY (deck_id) REFERENCES public.decks(id) ON DELETE CASCADE;


--
-- Name: deck_governance deck_governance_deck_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deck_governance
    ADD CONSTRAINT deck_governance_deck_id_fkey FOREIGN KEY (deck_id) REFERENCES public.decks(id) ON DELETE CASCADE;


--
-- Name: deck_metrics deck_metrics_deck_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deck_metrics
    ADD CONSTRAINT deck_metrics_deck_id_fkey FOREIGN KEY (deck_id) REFERENCES public.decks(id) ON DELETE CASCADE;


--
-- Name: deck_milestones deck_milestones_deck_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deck_milestones
    ADD CONSTRAINT deck_milestones_deck_id_fkey FOREIGN KEY (deck_id) REFERENCES public.decks(id) ON DELETE CASCADE;


--
-- Name: deck_milestones deck_milestones_program_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deck_milestones
    ADD CONSTRAINT deck_milestones_program_id_fkey FOREIGN KEY (program_id) REFERENCES public.deck_programs(id) ON DELETE SET NULL;


--
-- Name: deck_next_meeting deck_next_meeting_deck_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deck_next_meeting
    ADD CONSTRAINT deck_next_meeting_deck_id_fkey FOREIGN KEY (deck_id) REFERENCES public.decks(id) ON DELETE CASCADE;


--
-- Name: deck_priorities deck_priorities_deck_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deck_priorities
    ADD CONSTRAINT deck_priorities_deck_id_fkey FOREIGN KEY (deck_id) REFERENCES public.decks(id) ON DELETE CASCADE;


--
-- Name: deck_programs deck_programs_deck_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deck_programs
    ADD CONSTRAINT deck_programs_deck_id_fkey FOREIGN KEY (deck_id) REFERENCES public.decks(id) ON DELETE CASCADE;


--
-- Name: deck_resources deck_resources_deck_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deck_resources
    ADD CONSTRAINT deck_resources_deck_id_fkey FOREIGN KEY (deck_id) REFERENCES public.decks(id) ON DELETE CASCADE;


--
-- Name: deck_risks deck_risks_deck_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deck_risks
    ADD CONSTRAINT deck_risks_deck_id_fkey FOREIGN KEY (deck_id) REFERENCES public.decks(id) ON DELETE CASCADE;


--
-- Name: deck_team_members deck_team_members_deck_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deck_team_members
    ADD CONSTRAINT deck_team_members_deck_id_fkey FOREIGN KEY (deck_id) REFERENCES public.decks(id) ON DELETE CASCADE;


--
-- Name: deck_use_cases deck_use_cases_deck_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deck_use_cases
    ADD CONSTRAINT deck_use_cases_deck_id_fkey FOREIGN KEY (deck_id) REFERENCES public.decks(id) ON DELETE CASCADE;


--
-- Name: deck_agenda Public access for agenda; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public access for agenda" ON public.deck_agenda USING (true) WITH CHECK (true);


--
-- Name: deck_calls Public access for calls; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public access for calls" ON public.deck_calls USING (true) WITH CHECK (true);


--
-- Name: deck_executive_summary Public access for executive summary; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public access for executive summary" ON public.deck_executive_summary USING (true) WITH CHECK (true);


--
-- Name: deck_goals Public access for goals; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public access for goals" ON public.deck_goals USING (true) WITH CHECK (true);


--
-- Name: deck_governance Public access for governance; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public access for governance" ON public.deck_governance USING (true) WITH CHECK (true);


--
-- Name: deck_metrics Public access for metrics; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public access for metrics" ON public.deck_metrics USING (true) WITH CHECK (true);


--
-- Name: deck_milestones Public access for milestones; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public access for milestones" ON public.deck_milestones USING (true) WITH CHECK (true);


--
-- Name: deck_next_meeting Public access for next meeting; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public access for next meeting" ON public.deck_next_meeting USING (true) WITH CHECK (true);


--
-- Name: deck_priorities Public access for priorities; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public access for priorities" ON public.deck_priorities USING (true) WITH CHECK (true);


--
-- Name: deck_programs Public access for programs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public access for programs" ON public.deck_programs USING (true) WITH CHECK (true);


--
-- Name: deck_resources Public access for resources; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public access for resources" ON public.deck_resources USING (true) WITH CHECK (true);


--
-- Name: deck_risks Public access for risks; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public access for risks" ON public.deck_risks USING (true) WITH CHECK (true);


--
-- Name: deck_team_members Public access for team members; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public access for team members" ON public.deck_team_members USING (true) WITH CHECK (true);


--
-- Name: deck_use_cases Public access for use cases; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public access for use cases" ON public.deck_use_cases USING (true) WITH CHECK (true);


--
-- Name: decks Public delete access for decks; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public delete access for decks" ON public.decks FOR DELETE USING (true);


--
-- Name: decks Public insert access for decks; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public insert access for decks" ON public.decks FOR INSERT WITH CHECK (true);


--
-- Name: decks Public read access for decks; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public read access for decks" ON public.decks FOR SELECT USING (true);


--
-- Name: decks Public update access for decks; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public update access for decks" ON public.decks FOR UPDATE USING (true);


--
-- Name: deck_agenda; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.deck_agenda ENABLE ROW LEVEL SECURITY;

--
-- Name: deck_calls; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.deck_calls ENABLE ROW LEVEL SECURITY;

--
-- Name: deck_executive_summary; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.deck_executive_summary ENABLE ROW LEVEL SECURITY;

--
-- Name: deck_goals; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.deck_goals ENABLE ROW LEVEL SECURITY;

--
-- Name: deck_governance; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.deck_governance ENABLE ROW LEVEL SECURITY;

--
-- Name: deck_metrics; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.deck_metrics ENABLE ROW LEVEL SECURITY;

--
-- Name: deck_milestones; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.deck_milestones ENABLE ROW LEVEL SECURITY;

--
-- Name: deck_next_meeting; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.deck_next_meeting ENABLE ROW LEVEL SECURITY;

--
-- Name: deck_priorities; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.deck_priorities ENABLE ROW LEVEL SECURITY;

--
-- Name: deck_programs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.deck_programs ENABLE ROW LEVEL SECURITY;

--
-- Name: deck_resources; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.deck_resources ENABLE ROW LEVEL SECURITY;

--
-- Name: deck_risks; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.deck_risks ENABLE ROW LEVEL SECURITY;

--
-- Name: deck_team_members; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.deck_team_members ENABLE ROW LEVEL SECURITY;

--
-- Name: deck_use_cases; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.deck_use_cases ENABLE ROW LEVEL SECURITY;

--
-- Name: decks; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.decks ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--




COMMIT;