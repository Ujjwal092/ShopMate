import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";
import { toggleAIModal } from "./popupSlice";


export const fetchAllProducts = createAsyncThunk(
  "product/fetchAll",
  async (
    {
      availability = "",
      price = "0-10000",
      category = "",
      ratings = "",
      search = "",
      page = 1,
    },
    thunkAPI
  ) => {
    try {
      const params = new URLSearchParams(); //URLSearchParams is a built-in JavaScript class that provides an easy way to create and manipulate query strings for URLs. 
      // In this code, we use it to construct the query parameters for the API request based on the provided filters (category, price, search, ratings, availability, and page)
      // . We append each filter to the params object only if it has a value, ensuring that we only include relevant parameters in the API request.

      if (category) params.append("category", category);
      if (price) params.append("price", price);
      if (search) params.append("search", search);
      if (ratings) params.append("ratings", ratings);
      if (availability) params.append("availability", availability);
      if (page) params.append("page", page);

      const res = await axiosInstance.get(`/product?${params.toString()}`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response.data.message || "Failed to fetch products."
      );
    }
  }
);

export const fetchProductDetails = createAsyncThunk(
  "product/singleProduct",
  async (id, thunkAPI) => {
    try {
      console.log("PRODUCT DETAILS FETCHING");
      console.log(id);
      const res = await axiosInstance.get(`/product/singleProduct/${id}`);
      console.log(res);//res is the response from the backend after fetching the product details.
      //  It contains the product information, including reviews, which is then stored in the Redux state for use in the product detail page.
      return res.data.product;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response.data.message || "Failed to fetch product details."
      );
    }
  }
);

export const postReview = createAsyncThunk(
  "product/post-new/review",
  async ({ productId, review }, thunkAPI) => {
    const state = thunkAPI.getState();
    const authUser = state.auth.authUser;
    try {
      const res = await axiosInstance.put(
        `/product/post-new/review/${productId}`,
        review
      );
      toast.success(res.data.message);
      return {
        review: res.data.review,
        authUser,
      };
    } catch (error) {
      toast.error(error.response.data.message || "Failed to post review.");
      return thunkAPI.rejectWithValue(
        error.response.data.message || "Failed to post review."
      );
    }
  }
);

export const deleteReview = createAsyncThunk(
  "product/delete/review",
  async ({ productId, reviewId }, thunkAPI) => {
    try {
      const res = await axiosInstance.delete(
        `/product/delete/review/${productId}`
      );
      toast.success(res.data.message);
      return reviewId;
    } catch (error) {
      toast.error(error.response.data.message || "Failed to delete review.");
      return thunkAPI.rejectWithValue(
        error.response.data.message || "Failed to delete review."
      );
    }
  }
);

export const fetchProductWithAI = createAsyncThunk(
  "product/ai-search",
  async (userPrompt, thunkAPI) => {
    try {
      const res = await axiosInstance.post(`/product/ai-search`, {
        userPrompt,
      });
      thunkAPI.dispatch(toggleAIModal());
      return res.data;
    } catch (error) {
      toast.error(error.response.data.message);
      return thunkAPI.rejectWithValue(
        error.response.data.message || "Failed to fetch AI Filtered products."
      );
    }
  }
);

// const { authUser } = useSelector((state) => state.auth);

const productSlice = createSlice({
  name: "product",
  initialState: {
    loading: false,
    products: [],
    productDetails: {},
    totalProducts: 0,
    topRatedProducts: [],
    newProducts: [],
    aiSearching: false,
    isReviewDeleting: false,
    isPostingReview: false,
    productReviews: [],
  },
  extraReducers: (builder) => {
    builder 
    //for all prducts fetching, product details fetching, posting review, deleting review, and AI-based product fetching, we handle the pending, fulfilled, and rejected states to update the Redux state accordingly. This includes setting loading states, updating product lists and details, managing reviews, and handling errors with toast notifications.
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.newProducts = action.payload.newProducts;
        state.topRatedProducts = action.payload.topRatedProducts;
        state.totalProducts = action.payload.totalProducts;
      })
      .addCase(fetchAllProducts.rejected, (state) => {
        state.loading = false;
      })

      //fetching single product details along with its reviews and storing them in the Redux state for use in the product detail page.
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.productDetails = action.payload; //payload contains the product details returned from the backend, 
        // which we store in the Redux state above  for use in the product detail page.
        state.productReviews = action.payload.reviews;
      })
      .addCase(fetchProductDetails.rejected, (state) => {
        state.loading = false;
      })

      // For posting a review, we manage the loading state while the review is being posted. Upon successful posting, we check if the user has already reviewed the product. If they have, we update their existing review; if not, we add the new review to the list of reviews in the Redux state. We also handle errors by showing toast notifications.
      .addCase(postReview.pending, (state) => {
        state.isPostingReview = true;
      })
      .addCase(postReview.fulfilled, (state, action) => {
        state.isPostingReview = false;
        const newReview = action.payload.review;
        const authUser = action.payload.authUser;

        const existingReviewIndex = state.productReviews.findIndex(
          (rev) => rev.reviewer?.id === newReview.user_id
        );

// If the user has already reviewed, update the existing review. Otherwise, add the new review to the list of reviews in the Redux state.
        if (existingReviewIndex !== -1) {
          state.productReviews[existingReviewIndex].rating = Number(
            newReview.rating
          );
          state.productReviews[existingReviewIndex].comment = newReview.comment;
        } else {
          state.productReviews = [
            {
              ...newReview,
              reviewer: {
                id: authUser?.id,
                name: authUser?.name,
                avatar: authUser?.avatar?.url,
              },
            },
            ...state.productReviews,
          ];
        }
      })
      .addCase(postReview.rejected, (state) => {
        state.isPostingReview = false;
      })

      // For deleting a review, we manage the loading state while the review is being deleted. Upon successful deletion, we filter out the deleted review from the list of reviews in the Redux state. We also handle errors by showing toast notifications.
      .addCase(deleteReview.pending, (state) => {
        state.isReviewDeleting = true;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.isReviewDeleting = false;
        state.productReviews = state.productReviews.filter(
          (review) => review.review_id !== action.payload
        );
      })
      .addCase(deleteReview.rejected, (state) => {
        state.isReviewDeleting = false;
      })

      // For AI-based product fetching, we manage the loading state while the AI search is being performed. Upon successful fetching, we update the products list and total products count in the Redux state with the results returned from the AI search. We also handle errors by showing toast notifications.
      .addCase(fetchProductWithAI.pending, (state) => {
        state.aiSearching = true;
      })
      .addCase(fetchProductWithAI.fulfilled, (state, action) => {
        state.aiSearching = false;
        state.products = action.payload.products;
        state.totalProducts = action.payload.products.length;
      })
      .addCase(fetchProductWithAI.rejected, (state) => {
        state.aiSearching = false;
      });
  },
});

export default productSlice.reducer;
