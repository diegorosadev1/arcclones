import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { supabase } from "../lib/supabase";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { Profile } from "../types";
import { useStore } from "../store/useStore";

interface AuthContextType {
  user: SupabaseUser | null;
  profile: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updatePassword: (password: string) => Promise<{ error: any }>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const lastUserIdRef = useRef<string | null>(null);
  const initializedRef = useRef(false);

  const fetchProfile = async (
    userId: string,
    userEmail?: string,
    userName?: string,
  ): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        if (error.code === "PGRST116" && userEmail) {
          const { data: newProfile, error: createError } = await supabase
            .from("profiles")
            .insert([
              {
                id: userId,
                name: userName || userEmail.split("@")[0] || "Usuário",
                email: userEmail,
                role: "customer",
              },
            ])
            .select()
            .single();

          if (createError) {
            console.error("Error creating profile:", createError);
            return null;
          }

          return newProfile as Profile;
        }

        console.error("Error fetching profile:", error);
        return null;
      }

      return data as Profile;
    } catch (err) {
      console.error("Unexpected error fetching profile:", err);
      return null;
    }
  };

  const applySession = async (
    session: any,
    options?: { withLoading?: boolean },
  ) => {
    const withLoading = options?.withLoading ?? true;
    const currentUser = session?.user ?? null;

    if (withLoading) {
      setLoading(true);
    }

    try {
      setUser(currentUser);

      if (!currentUser) {
        setProfile(null);
        lastUserIdRef.current = null;
        return;
      }

      lastUserIdRef.current = currentUser.id;

      const profileData = await fetchProfile(
        currentUser.id,
        currentUser.email,
        currentUser.user_metadata?.full_name,
      );

      setProfile(profileData);
    } catch (error) {
      console.error("applySession error:", error);
      setProfile(null);
    } finally {
      if (withLoading) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        setLoading(true);

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        await applySession(session, { withLoading: true });
        initializedRef.current = true;
      } catch (error) {
        console.error("Auth init error:", error);
        if (mounted) {
          setUser(null);
          setProfile(null);
          setLoading(false);
          initializedRef.current = true;
        }
      }
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === "SIGNED_OUT") {
        useStore.getState().clearCart();
        lastUserIdRef.current = null;
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      if (event === "SIGNED_IN") {
        const newUserId = session?.user?.id ?? null;

        if (
          lastUserIdRef.current &&
          newUserId &&
          lastUserIdRef.current !== newUserId
        ) {
          useStore.getState().clearCart();
        }

        await applySession(session, { withLoading: true });
        initializedRef.current = true;
        return;
      }

      if (event === "USER_UPDATED") {
        await applySession(session, { withLoading: false });
        return;
      }

      if (event === "TOKEN_REFRESHED") {
        const refreshedUser = session?.user ?? null;
        setUser(refreshedUser);
        return;
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      useStore.getState().clearCart();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  };

  const refreshProfile = async () => {
    if (!user) return;

    setLoading(true);

    try {
      const profileData = await fetchProfile(
        user.id,
        user.email,
        user.user_metadata?.full_name,
      );
      setProfile(profileData);
    } catch (error) {
      console.error("refreshProfile error:", error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password });
    return { error };
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error("User not authenticated") };

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id);

    if (!error) {
      await refreshProfile();
    }

    return { error };
  };

  const value = {
    user,
    profile,
    loading,
    isAdmin: profile?.role === "admin",
    signOut,
    refreshProfile,
    updatePassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}