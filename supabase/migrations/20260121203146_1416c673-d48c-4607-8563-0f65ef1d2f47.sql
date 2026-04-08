-- Drop existing permissive policies and create read-only public access
-- Anyone can read, only authenticated users can write

-- DECKS TABLE
DROP POLICY IF EXISTS "Public read access for decks" ON public.decks;
DROP POLICY IF EXISTS "Public insert access for decks" ON public.decks;
DROP POLICY IF EXISTS "Public update access for decks" ON public.decks;
DROP POLICY IF EXISTS "Public delete access for decks" ON public.decks;

CREATE POLICY "Anyone can read decks" ON public.decks FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert decks" ON public.decks FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update decks" ON public.decks FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete decks" ON public.decks FOR DELETE TO authenticated USING (true);

-- DECK_EXECUTIVE_SUMMARY
DROP POLICY IF EXISTS "Public access for executive summary" ON public.deck_executive_summary;

CREATE POLICY "Anyone can read executive summary" ON public.deck_executive_summary FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert executive summary" ON public.deck_executive_summary FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update executive summary" ON public.deck_executive_summary FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete executive summary" ON public.deck_executive_summary FOR DELETE TO authenticated USING (true);

-- DECK_GOALS
DROP POLICY IF EXISTS "Public access for goals" ON public.deck_goals;

CREATE POLICY "Anyone can read goals" ON public.deck_goals FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert goals" ON public.deck_goals FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update goals" ON public.deck_goals FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete goals" ON public.deck_goals FOR DELETE TO authenticated USING (true);

-- DECK_METRICS
DROP POLICY IF EXISTS "Public access for metrics" ON public.deck_metrics;

CREATE POLICY "Anyone can read metrics" ON public.deck_metrics FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert metrics" ON public.deck_metrics FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update metrics" ON public.deck_metrics FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete metrics" ON public.deck_metrics FOR DELETE TO authenticated USING (true);

-- DECK_USE_CASES
DROP POLICY IF EXISTS "Public access for use cases" ON public.deck_use_cases;

CREATE POLICY "Anyone can read use cases" ON public.deck_use_cases FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert use cases" ON public.deck_use_cases FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update use cases" ON public.deck_use_cases FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete use cases" ON public.deck_use_cases FOR DELETE TO authenticated USING (true);

-- DECK_PROGRAMS
DROP POLICY IF EXISTS "Public access for programs" ON public.deck_programs;

CREATE POLICY "Anyone can read programs" ON public.deck_programs FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert programs" ON public.deck_programs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update programs" ON public.deck_programs FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete programs" ON public.deck_programs FOR DELETE TO authenticated USING (true);

-- DECK_MILESTONES
DROP POLICY IF EXISTS "Public access for milestones" ON public.deck_milestones;

CREATE POLICY "Anyone can read milestones" ON public.deck_milestones FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert milestones" ON public.deck_milestones FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update milestones" ON public.deck_milestones FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete milestones" ON public.deck_milestones FOR DELETE TO authenticated USING (true);

-- DECK_RESOURCES
DROP POLICY IF EXISTS "Public access for resources" ON public.deck_resources;

CREATE POLICY "Anyone can read resources" ON public.deck_resources FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert resources" ON public.deck_resources FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update resources" ON public.deck_resources FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete resources" ON public.deck_resources FOR DELETE TO authenticated USING (true);

-- DECK_AGENDA
DROP POLICY IF EXISTS "Public access for agenda" ON public.deck_agenda;

CREATE POLICY "Anyone can read agenda" ON public.deck_agenda FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert agenda" ON public.deck_agenda FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update agenda" ON public.deck_agenda FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete agenda" ON public.deck_agenda FOR DELETE TO authenticated USING (true);

-- DECK_PRIORITIES
DROP POLICY IF EXISTS "Public access for priorities" ON public.deck_priorities;

CREATE POLICY "Anyone can read priorities" ON public.deck_priorities FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert priorities" ON public.deck_priorities FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update priorities" ON public.deck_priorities FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete priorities" ON public.deck_priorities FOR DELETE TO authenticated USING (true);

-- Drop unused tables entirely
DROP POLICY IF EXISTS "Public access for calls" ON public.deck_calls;
DROP TABLE IF EXISTS public.deck_calls;

DROP POLICY IF EXISTS "Public access for governance" ON public.deck_governance;
DROP TABLE IF EXISTS public.deck_governance;

DROP POLICY IF EXISTS "Public access for next meeting" ON public.deck_next_meeting;
DROP TABLE IF EXISTS public.deck_next_meeting;

DROP POLICY IF EXISTS "Public access for risks" ON public.deck_risks;
DROP TABLE IF EXISTS public.deck_risks;