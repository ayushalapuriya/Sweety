import { createContext, useContext, useMemo, useState } from 'react';
import { api, request } from '../api';

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('sweety_user') || 'null'));
  async function signIn(payload) {
    const data = await request(api.post('/auth/login', payload));
    localStorage.setItem('sweety_token', data.token); localStorage.setItem('sweety_user', JSON.stringify(data.user)); setUser(data.user);
  }
  async function signUp(payload) {
    const data = await request(api.post('/auth/register', payload));
    localStorage.setItem('sweety_token', data.token); localStorage.setItem('sweety_user', JSON.stringify(data.user)); setUser(data.user);
  }
  function signOut() { localStorage.removeItem('sweety_token'); localStorage.removeItem('sweety_user'); setUser(null); }
  const value = useMemo(() => ({ user, signIn, signUp, signOut }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
