import { createSlice } from '@reduxjs/toolkit';
import { storeTokens, removeTokens, parseJwt, getTokens } from '@/utils/auth';

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isAddressProvided: false,
  isLoading: false,
};

const loadInitialState = () => {
  if (typeof window !== 'undefined') {
    const { accessToken, refreshToken } =getTokens();
    if (accessToken) {
      const decoded = parseJwt(accessToken);
      return {
        ...initialState,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        user: decoded ? {
          id: decoded.id,
          profileId: decoded.profileId,
          email: decoded.email,
          role: decoded.role,
        } : null,
        isAddressProvided: typeof window !== 'undefined' && localStorage.getItem('isAddressProvided') === 'true' ? true : false,
      };
    }
  }
  return initialState;
};

const authSlice = createSlice({
  name: 'auth',
  initialState: loadInitialState(),
  reducers: {
    setCredentials: (state, action) => {
      const { accessToken, refreshToken, isAddressProvided } = action.payload;
      const decoded = parseJwt(accessToken);
      
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      state.isAddressProvided = isAddressProvided || false;
      state.user = decoded ? {
        id: decoded.id,
        profileId: decoded.profileId,
        email: decoded.email,
        role: decoded.role,
      } : null;

      if (typeof window !== 'undefined') {
        storeTokens(accessToken, refreshToken);
        if (typeof isAddressProvided !== 'undefined') {
          localStorage.setItem('isAddressProvided', isAddressProvided ? 'true' : 'false');
        }
      }
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isAddressProvided = false;
      
      if (typeof window !== 'undefined') {
        removeTokens();
        localStorage.removeItem('isAddressProvided');
        
        // Clear refreshToken cookie
        document.cookie = 'refreshToken=; path=/; max-age=0; SameSite=Lax';
        if (process.env.NODE_ENV === 'production') {
          document.cookie = 'refreshToken=; path=/; max-age=0; SameSite=Lax; Secure';
        }
      }
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    updateAddressStatus: (state, action) => {
      state.isAddressProvided = action.payload;
    },
  },
});

export const { setCredentials, logout, setLoading, updateAddressStatus } = authSlice.actions;

export default authSlice.reducer;

