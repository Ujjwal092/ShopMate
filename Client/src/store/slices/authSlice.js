import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";
import { toggleAuthPopup } from "./popupSlice";

export const register = createAsyncThunk(
  "auth/register",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/auth/register", data); //data from the form
      //url from axios + /auth/register
      thunkAPI.dispatch(toggleAuthPopup()); //dispatching the toggleAuthPopup action to close the auth popup after successful registration
      toast.success(res.data.message);
      // message will be sent from jwtToken to registerContoller in the backend
      return res.data.user;
    } catch (error) {
      toast.error(error.response.data.message);
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
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

export const getUser = createAsyncThunk("auth/getUser", async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data.user;  // Returning user data to be stored in the state
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response.data.message || "Failed to get user."
    );
  }
});

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    // eslint-disable-next-line no-unused-vars
    const res = await axiosInstance.get("/auth/logout");
    thunkAPI.dispatch(toggleAuthPopup()); // Close auth popup on logout
    return null; // No user data to return on logout, so returning null
  } catch (error) {
    toast.error(error.response.data.message);
    return thunkAPI.rejectWithValue(
      error.response.data.message || "Failed to get user."
    );
  }
});

export const forgotPassword = createAsyncThunk(
  "auth/forgot/password",
  async (email, thunkAPI) => {
    try {
      const res = await axiosInstance.post(
        "/auth/password/forgot?frontendUrl=http://localhost:5173",
        email
      );
      //frontendUrl is sent to backend to create the reset link with token 
      //coz in forgotPassword contoller frontendUrl is destructured from req.parms 
      toast.success(res.data.message);
      return null;
    } catch (error) {
      toast.error(error.response.data.message);
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
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
  }
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
  }
);

export const updateProfile = createAsyncThunk(
  "auth/me/update",
  async (data, thunkAPI) => { 
    //data from the form is sent to the backend to update the profile
    //and thunkAPI is used to dispatch actions and handle errors
    //createAsyncThunk automatically provides thunkAPI as the second argument to the payload creator function, which can be used to dispatch actions, get the current state, and reject with a value in case of an error.
    //In this case, we are using thunkAPI to dispatch the toggleAuthPopup action to close the auth popup after successful profile update and to handle errors by rejecting with a value that can be used in the extraReducers to update the state accordingly.
    //createAsyncThunk is a utility function from Redux Toolkit that simplifies the process of creating asynchronous actions and handling their lifecycle (pending, fulfilled, rejected) in the reducers. It automatically generates action types and action creators for the different states of the asynchronous operation, making it easier to manage complex async logic in Redux.
    //createAsyncThunk (API call to backend)
    try {
      const res = await axiosInstance.put(`/auth/profile/update`, data);
      toast.success(res.data.message); 
      return res.data.user;
    } catch (error) {
      const message = error.response.data.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

//where ever user is returned from the backend we will update the authUser state with that user data like in updateProfile, resetPassword, getUser, login, register
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
    //builder is used to add cases for the different states of the asynchronous actions created with createAsyncThunk. It allows us to handle the pending, fulfilled, and rejected states of each action and update the state accordingly. 
    // For example, when the register action is pending, we set isSigningUp to true to indicate that the registration process is in progress. When it is fulfilled, we set isSigningUp to false and update authUser with the user data returned from the backend. If it is rejected, we set isSigningUp back to false.
    //  This pattern is repeated for each asynchronous action to manage the state based on the lifecycle of the API calls.
    builder
      
    // Register cases
      .addCase(register.pending, (state) => {
        state.isSigningUp = true; 
        //pending state of the register action, setting isSigningUp to true to indicate that the registration process is in progress. This can be used to show a loading spinner or disable the registration button while the request is being processed.
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isSigningUp = false;
        state.authUser = action.payload; 
        //fulfilled state of the register action, setting isSigningUp to false to indicate that the registration process has completed and updating authUser with the user data returned from the backend (action.payload). This allows the application to reflect the newly registered user's information in the state.
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
