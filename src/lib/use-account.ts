import { useCallback, useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Session = ReturnType<typeof supabase.auth.getSession> extends Promise<infer R>
  ? R["data"]["session"]
  : never;

/**
 * Tracks the signed-in session and the user's profile row.
 * Auth is optional in Aura: signed-out visitors use the app normally.
 */
export function useAccount() {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [ready, setReady] = useState(false);

  const loadProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    setProfile((data as Profile | null) ?? null);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setReady(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const userId = session?.user.id;

  useEffect(() => {
    if (userId) void loadProfile(userId);
    else setProfile(null);
  }, [userId, loadProfile]);

  const refreshProfile = useCallback(() => {
    if (userId) return loadProfile(userId);
    return Promise.resolve();
  }, [userId, loadProfile]);

  return { ready, session, user: session?.user ?? null, profile, refreshProfile };
}
