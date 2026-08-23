import { createContext, useContext, useReducer, useEffect, useMemo } from 'react';

// ─── Constants ───────────────────────────────────────────────────────────────
const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
};

// ─── Action Types ────────────────────────────────────────────────────────────
const AUTH_ACTIONS = {
  SET_CREDENTIALS: 'SET_CREDENTIALS',
  LOGOUT: 'LOGOUT',
  INIT_COMPLETE: 'INIT_COMPLETE',
};

// ─── Initial State ───────────────────────────────────────────────────────────
const initialState = {
  user: null,   // User object (e.g. { id, name, email })
  token: null,  // JWT or session token
  loading: true, // True while we hydrate from localStorage on mount
};

// ─── Reducer ─────────────────────────────────────────────────────────────────
function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTIONS.SET_CREDENTIALS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
      };

    case AUTH_ACTIONS.INIT_COMPLETE:
      // Marks initial hydration as finished (even if no stored session found)
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
}

// ─── Context Creation ────────────────────────────────────────────────────────
const AuthContext = createContext(null);

// ─── Provider Component ──────────────────────────────────────────────────────
/**
 * AuthProvider wraps the application and manages authentication state.
 *
 * On mount it checks localStorage for an existing session. During that
 * check `loading` is true so downstream components can show a spinner
 * instead of flashing unauthenticated UI.
 */
function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // ── Hydrate from localStorage on first mount ──────────────────────────────
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);

      if (storedToken && storedUser) {
        dispatch({
          type: AUTH_ACTIONS.SET_CREDENTIALS,
          payload: {
            token: storedToken,
            user: JSON.parse(storedUser),
          },
        });
      } else {
        // Nothing stored — just mark init as done
        dispatch({ type: AUTH_ACTIONS.INIT_COMPLETE });
      }
    } catch {
      // Corrupted storage — clear it and continue unauthenticated
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      dispatch({ type: AUTH_ACTIONS.INIT_COMPLETE });
    }
  }, []);

  // ── login: persist credentials to state + localStorage ────────────────────
  const login = (token, user) => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    dispatch({
      type: AUTH_ACTIONS.SET_CREDENTIALS,
      payload: { token, user },
    });
  };

  // ── logout: wipe credentials from state + localStorage ────────────────────
  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  // ── Derived boolean — true when a token is present ────────────────────────
  const isAuthenticated = Boolean(state.token);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      user: state.user,
      token: state.token,
      loading: state.loading,
      isAuthenticated,
      login,
      logout,
    }),
    [state.user, state.token, state.loading, isAuthenticated],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Custom Hook ─────────────────────────────────────────────────────────────
/** 
 * useAuth — convenience hook that returns the auth context.
 * Throws if used outside of an AuthProvider.
 */
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an <AuthProvider>');
  }
  return context;
}

export { AuthContext, AuthProvider, useAuth };
