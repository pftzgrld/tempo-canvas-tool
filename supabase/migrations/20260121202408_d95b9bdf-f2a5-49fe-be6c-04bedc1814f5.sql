-- Drop the deck_team_members table and its RLS policy to eliminate PII exposure risk
DROP POLICY IF EXISTS "Public access for team members" ON public.deck_team_members;
DROP TABLE IF EXISTS public.deck_team_members;