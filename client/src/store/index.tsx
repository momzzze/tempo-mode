import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import type { AuthState, User, LoginPayload, RegisterPayload } from './types';
import type { AuthAction } from './actions';
import {
  AUTH_LOGOUT,
  AUTH_LOGIN_FAILURE,
  AUTH_LOGIN_REQUEST,
  AUTH_LOGIN_SUCCESS,
  AUTH_REGISTER_SUCCESS,
  AUTH_REHYDRATE,
  loginFailure,
  loginRequest,
  loginSuccess,
  logout as logoutAction,
  rehydrate,
  registerSuccess,
} from './actions';

const PERSIST_KEY = 'tempo-mode-auth-v1';

const initialState: AuthState = {
  user: null,
  status: 'rehydrating',
};

function reducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case AUTH_REHYDRATE:
      return {
        user: action.payload,
        status: action.payload ? 'authenticated' : 'idle',
      };
    case AUTH_LOGIN_REQUEST:
      return { ...state, status: 'loading', error: undefined };
    case AUTH_LOGIN_SUCCESS:
      return {
        user: action.payload,
        status: 'authenticated',
        error: undefined,
      };
    case AUTH_LOGIN_FAILURE:
      return { ...state, status: 'error', error: action.error, user: null };
    case AUTH_REGISTER_SUCCESS:
      return {
        ...state,
        user: action.payload,
        status: 'authenticated',
        error: undefined,
      };
    case AUTH_LOGOUT:
      return { user: null, status: 'idle', error: undefined };
    default:
      return state;
  }
}

function readPersisted(): User | null {
  try {
    const raw = window.localStorage.getItem(PERSIST_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { user?: User | null };
    if (parsed && parsed.user && typeof parsed.user.token === 'string')
      return parsed.user;
    return null;
  } catch {
    return null;
  }
}

function writePersisted(user: User | null) {
  try {
    window.localStorage.setItem(PERSIST_KEY, JSON.stringify({ user }));
  } catch {}
}

const AuthStateCtx = createContext<AuthState>(initialState);
const AuthDispatchCtx = createContext<React.Dispatch<AuthAction> | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const user = readPersisted();
    dispatch(rehydrate(user));
  }, []);

  useEffect(() => {
    writePersisted(state.user);
  }, [state.user]);

  const memoState = useMemo(() => state, [state]);
  return (
    <AuthStateCtx.Provider value={memoState}>
      <AuthDispatchCtx.Provider value={dispatch}>
        {children}
      </AuthDispatchCtx.Provider>
    </AuthStateCtx.Provider>
  );
}

export function useAuth() {
  return useContext(AuthStateCtx);
}

export function useAuthDispatch() {
  const ctx = useContext(AuthDispatchCtx);
  if (!ctx) throw new Error('AuthDispatchCtx not provided');
  return ctx;
}

// Async helpers for actions
export async function performLogin(
  dispatch: React.Dispatch<AuthAction>,
  apiLogin: (email: string, password: string) => Promise<User>,
  payload: LoginPayload
): Promise<void> {
  dispatch(loginRequest());
  try {
    const user = await apiLogin(payload.email, payload.password);
    dispatch(loginSuccess(user));
  } catch (e: any) {
    dispatch(loginFailure(e?.message ?? 'Login failed'));
  }
}

export async function performRegister(
  dispatch: React.Dispatch<AuthAction>,
  apiRegister: (email: string, password: string) => Promise<User>,
  payload: RegisterPayload
): Promise<void> {
  try {
    const user = await apiRegister(payload.email, payload.password);
    dispatch(registerSuccess(user));
  } catch (e: any) {
    dispatch(loginFailure(e?.message ?? 'Register failed'));
  }
}

export function logout(dispatch: React.Dispatch<AuthAction>) {
  writePersisted(null);
  dispatch(logoutAction());
}
