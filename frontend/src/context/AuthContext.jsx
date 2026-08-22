import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('vizgen_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('vizgen_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Mock login for now to demonstrate UI
    if (email) {
      const mockUser = {
        name: 'Alex Carter',
        role: 'Data Scientist',
        email: email
      };
      setUser(mockUser);
      localStorage.setItem('vizgen_user', JSON.stringify(mockUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vizgen_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
