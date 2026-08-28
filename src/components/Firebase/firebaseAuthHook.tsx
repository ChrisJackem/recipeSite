import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';

const auth = getAuth();

function useAuthState() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return user;
}
export default useAuthState;