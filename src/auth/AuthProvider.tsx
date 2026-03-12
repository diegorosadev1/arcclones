import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "../lib/supabase";

export type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  avatar?: string | null;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

type ProfileRow = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  avatar: string | null;
};

async function getProfile(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, name, role, avatar")
    .eq("id", userId)
    .single<ProfileRow>();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    email: data.email,
    name: data.name,
    role: data.role,
    avatar: data.avatar,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user && mounted) {
        const profile = await getProfile(session.user.id);
        setUser(profile);
      }

      if (mounted) {
        setLoading(false);
      }
    }

    bootstrap();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      if (!session?.user) {
        setUser(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      setTimeout(async () => {
        if (!mounted || !session.user) return;
        const profile = await getProfile(session.user.id);
        if (mounted) {
          setUser(profile);
          setLoading(false);
        }
      }, 0);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function login(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }
  }

  async function logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}