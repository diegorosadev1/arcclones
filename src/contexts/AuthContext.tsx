import React, { createContext, useContext, useEffect, useState } from "react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
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

async function fetchProfileByUser(
  user: SupabaseUser | null,
): Promise<Profile | null> {
  if (!user) return null;

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }

    if (data) {
      return data as Profile;
    }

    const email = user.email;
    if (!email) return null;

    const fallbackName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      email.split("@")[0] ||
      "Usuário";

    const { data: createdProfile, error: createError } = await supabase
      .from("profiles")
      .insert([
        {
          id: user.id,
          name: fallbackName,
          email,
          role: "customer",
        },
      ])
      .select()
      .single();

    if (createError) {
      console.error("Error creating profile:", createError);
      return null;
    }

    return createdProfile as Profile;
  } catch (error) {
    console.error("Unexpected profile error:", error);
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const hydrateFromSession = async (sessionUser: SupabaseUser | null) => {
    setUser(sessionUser);

    if (!sessionUser) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(false);

    const profileData = await fetchProfileByUser(sessionUser);
    setProfile(profileData);
  };

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        setLoading(true);

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("getSession error:", error);
        }

        if (!isMounted) return;

        await hydrateFromSession(session?.user ?? null);
      } catch (error) {
        console.error("Auth init error:", error);

        if (!isMounted) return;

        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;

      const sessionUser = session?.user ?? null;

      if (event === "SIGNED_OUT") {
        useStore.getState().clearCart();
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      setUser(sessionUser);

      if (!sessionUser) {
        setProfile(null);
        setLoading(false);
        return;
      }

      setLoading(false);

      Promise.resolve(fetchProfileByUser(sessionUser))
        .then((profileData) => {
          if (!isMounted) return;
          setProfile(profileData);
        })
        .catch((error) => {
          console.error("Profile hydration error:", error);
          if (!isMounted) return;
          setProfile(null);
        });
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      useStore.getState().clearCart();

      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setProfile(null);
      setLoading(false);
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  };

  const refreshProfile = async () => {
    if (!user) return;

    try {
      const profileData = await fetchProfileByUser(user);
      setProfile(profileData);
    } catch (error) {
      console.error("refreshProfile error:", error);
      setProfile(null);
    }
  };

  const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password });
    return { error };
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) {
      return { error: new Error("Usuário não autenticado") };
    }

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id);

    if (!error) {
      await refreshProfile();
    }

    return { error };
  };

  const value: AuthContextType = {
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

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}