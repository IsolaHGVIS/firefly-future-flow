
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, getCurrentUser } from '@/lib/supabase';

type User = {
  id: string;
  email?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for current session
    const checkUser = async () => {
      try {
        const { user: currentUser, error } = await getCurrentUser();
        if (error) {
          console.error('Auth session missing or error fetching user');
          setUser(null);
        } else if (currentUser) {
          setUser({
            id: currentUser.id,
            email: currentUser.email,
          });
        }
      } catch (error) {
        console.error('Auth error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
          });
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signOutUser = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signOut: signOutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
