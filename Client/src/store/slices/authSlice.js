import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";
import { toggleAuthPopup } from "./popupSlice";

export const register = createAsyncThunk(
  "auth/register",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/auth/register", data); //data from the form
      //url from axios + /auth/register from backend

      thunkAPI.dispatch(toggleAuthPopup()); //dispatching the toggleAuthPopup action to close the auth popup after successful registration
      toast.success(res.data.message);
      // message will be sent from jwtToken to registerContoller in the backend
      return res.data.user;
    } catch (error) {
      toast.error(error.response.data.message);
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  },
);

export const login = createAsyncThunk("auth/login", async (data, thunkAPI) => {
  try {
    const res = await axiosInstance.post("/auth/login", data);
    toast.success(res.data.message);
    thunkAPI.dispatch(toggleAuthPopup()); // Close auth popup on successful login basically dispatching the action
    return res.data.user;
  } catch (error) {
    toast.error(error.response.data.message);
    return thunkAPI.rejectWithValue(error.response.data.message); // Rejecting with value to handle error in extraReducers
  }
});

//getUser m koi data send nai kr rhe isliye data send nai kiye h like login signup
export const getUser = createAsyncThunk("auth/getUser", async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data.user; // Returning user data to be stored in the state
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response.data.message || "Failed to get user.",
    );
  }
});

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    // eslint-disable-next-line no-unused-vars
    const res = await axiosInstance.get("/auth/logout");
    thunkAPI.dispatch(toggleAuthPopup());
    // Close auth popup on logout
    return null; // No user data to return on logout, so returning null
  } catch (error) {
    toast.error(error.response.data.message);
    return thunkAPI.rejectWithValue(
      error.response.data.message || "Failed to get user.",
    );
  }
});

export const forgotPassword = createAsyncThunk(
  "auth/forgot/password",
  async (email, thunkAPI) => {
    try {
      const res = await axiosInstance.post(
        "/auth/password/forgot?frontendUrl=http://localhost:5173",
        email,
      );
      //frontendUrl is sent to backend to create the reset link with token
      //coz in forgotPassword contoller frontendUrl is destructured from req.parms
      toast.success(res.data.message);
      return null;
    } catch (error) {
      toast.error(error.response.data.message);
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  },
);

export const resetPassword = createAsyncThunk(
  "auth/password/reset",
  async ({ token, password, confirmPassword }, thunkAPI) => {
    try {
      const res = await axiosInstance.put(`/auth/password/reset/${token}`, {
        password,
        confirmPassword,
      }); //creating the url with token from the params and sending password and confirmPassword in the body
      toast.success(res.data.message);
      return res.data.user;
    } catch (error) {
      const message =
        error.response.data.message ||
        "Something went wrong. Please try again.";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const updatePassword = createAsyncThunk(
  "auth/password/update",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.put(`/auth/password/update`, data);
      toast.success(res.data.message); //message from the backend after successful password update
      return null;
    } catch (error) {
      const message = error.response.data.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const updateProfile = createAsyncThunk(
  "auth/me/update",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.put(`/auth/profile/update`, data);
      toast.success(res.data.message);
      return res.data.user;
    } catch (error) {
      const message = error.response.data.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isUpdatingPassword: false,
    isRequestingForToken: false,
    isCheckingAuth: true,
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isSigningUp = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isSigningUp = false;
        state.authUser = action.payload; //if fullfileed h state toh state update krdo for that payload
      })
      .addCase(register.rejected, (state) => {
        state.isSigningUp = false;
      })

      // Login cases
      .addCase(login.pending, (state) => {
        state.isLoggingIn = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggingIn = false;
        state.authUser = action.payload;
      })
      .addCase(login.rejected, (state) => {
        state.isLoggingIn = false;
      })

      // Get user cases
      .addCase(getUser.pending, (state) => {
        state.isCheckingAuth = true;
        state.authUser = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isCheckingAuth = false;
        state.authUser = action.payload;
      })
      .addCase(getUser.rejected, (state) => {
        state.isCheckingAuth = false;
        state.authUser = null;
      })

      // Logout cases (ya toh fulfilled hoga ya rejected hoga)
      .addCase(logout.fulfilled, (state) => {
        state.authUser = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.authUser = action.payload;
      })

      // Forgot password cases
      .addCase(forgotPassword.pending, (state) => {
        state.isRequestingForToken = true;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isRequestingForToken = false;
      })
      .addCase(forgotPassword.rejected, (state) => {
        state.isRequestingForToken = false;
      })

      // Reset password cases
      .addCase(resetPassword.pending, (state) => {
        state.isUpdatingPassword = true;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isUpdatingPassword = false;
        state.authUser = action.payload;
        // Updating authUser with the new user data after password reset
      })
      .addCase(resetPassword.rejected, (state) => {
        state.isUpdatingPassword = false;
      })

      // Update password cases
      .addCase(updatePassword.pending, (state) => {
        state.isUpdatingPassword = true;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.isUpdatingPassword = false;
      })
      .addCase(updatePassword.rejected, (state) => {
        state.isUpdatingPassword = false;
      })

      // Update profile cases
      .addCase(updateProfile.pending, (state) => {
        state.isUpdatingProfile = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isUpdatingProfile = false;
        state.authUser = action.payload;
        // Updating authUser with the updated user data returned from the backend
      })
      .addCase(updateProfile.rejected, (state) => {
        state.isUpdatingProfile = false;
      });
  },
});

export default authSlice.reducer;
