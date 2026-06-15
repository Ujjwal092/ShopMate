import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

// Fetch full wishlist (with product details) — used on the Wishlist page
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/wishlist");
      return res.data.wishlist;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch wishlist.",
      );
    }
  },
);

// Fetch just the product IDs — lightweight, used to show filled/empty heart icons on product cards
export const fetchWishlistIds = createAsyncThunk(
  "wishlist/fetchIds",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/wishlist/ids");
      return res.data.wishlistIds;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch wishlist.",
      );
    }
  },
);

// Toggle a product in/out of the wishlist (used on the heart icon button)
export const toggleWishlistItem = createAsyncThunk(
  "wishlist/toggle",
  async (productId, thunkAPI) => {
    try {
      const res = await axiosInstance.post(`/wishlist/toggle/${productId}`);
      toast.success(res.data.message);
      return { productId, inWishlist: res.data.inWishlist };
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update wishlist.",
      );
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update wishlist.",
      );
    }
  },
);

// Remove a product from the wishlist (used on the Wishlist page itself)
export const removeFromWishlist = createAsyncThunk(
  "wishlist/remove",
  async (productId, thunkAPI) => {
    try {
      const res = await axiosInstance.delete(`/wishlist/remove/${productId}`);
      toast.success(res.data.message);
      return productId;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove item.");
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to remove item.",
      );
    }
  },
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    wishlist: [], // full items with product details (for Wishlist page)
    wishlistIds: [], // just product IDs (for heart icons across the app)
    loading: false,
    togglingId: null, // tracks which product's heart icon is currently toggling
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch full wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state) => {
        state.loading = false;
      })

      // Fetch wishlist IDs (lightweight)
      .addCase(fetchWishlistIds.fulfilled, (state, action) => {
        state.wishlistIds = action.payload;
      })

      // Toggle wishlist item
      .addCase(toggleWishlistItem.pending, (state, action) => {
        state.togglingId = action.meta.arg; // productId being toggled
      })
      .addCase(toggleWishlistItem.fulfilled, (state, action) => {
        state.togglingId = null;
        const { productId, inWishlist } = action.payload;

        if (inWishlist) {
          // Add to wishlistIds if not already present
          if (!state.wishlistIds.includes(productId)) {
            state.wishlistIds.push(productId);
          }
        } else {
          // Remove from wishlistIds and from full wishlist list
          state.wishlistIds = state.wishlistIds.filter(
            (id) => id !== productId,
          );
          state.wishlist = state.wishlist.filter(
            (item) => item.id !== productId,
          );
        }
      })
      .addCase(toggleWishlistItem.rejected, (state) => {
        state.togglingId = null;
      })

      // Remove from wishlist (explicit remove on Wishlist page)
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        const productId = action.payload;
        state.wishlist = state.wishlist.filter((item) => item.id !== productId);
        state.wishlistIds = state.wishlistIds.filter((id) => id !== productId);
      });
  },
});

export default wishlistSlice.reducer;
