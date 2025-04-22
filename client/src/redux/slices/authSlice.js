import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../utils/api";

// Async thunk for login
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/login`, {
        email,
        password,
      });
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("username", response.data.username);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for register
export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ name, email, username, password, gender }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/register`, {
        name,
        email,
        username,
        password,
        gender,
      });
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("username", response.data.username);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Function to initiate Google login
export const initiateGoogleLogin = () => {
  window.location.href = `${BASE_URL}/api/auth/google`;
};

const initialState = {
  isAuthenticated: !!localStorage.getItem("authToken"),
  username: localStorage.getItem("username") || "",
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("authToken");
      localStorage.removeItem("username");
      state.isAuthenticated = false;
      state.username = "";
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    // Handle Google login success
    googleLoginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.username = action.payload.username;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.username = action.payload.username;
        state.loading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";
      })
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.username = action.payload.username;
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Registration failed";
      });
  },
});

export const { logout, clearError, googleLoginSuccess } = authSlice.actions;
export default authSlice.reducer;
