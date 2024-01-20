import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllPlaces, getPlaceReviews } from "../services/place";
import axios from "axios";
import { BASE_URL } from "../config/url";
import { toast } from "react-hot-toast";

// Async thunk action to fetch all places
export const fetchPlaces = createAsyncThunk("places/fetchPlaces", async () => {
  try {
    const response = await getAllPlaces();
    return response;
  } catch (error) {
    throw new Error("Failed to fetch places");
  }
});

// Async thunk action to get reviews for a place
export const getReviews = createAsyncThunk(
  "places/getReviews",
  async (placeId, { rejectWithValue }) => {
    try {
      const response = await getPlaceReviews(placeId);
      return response;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const addPlace = createAsyncThunk(
  "api/addPlaces",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/places/`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const getPlace = createAsyncThunk(
  "api/places/:id",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/places/${payload.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      return response.data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const updatePlace = createAsyncThunk(
  "places/updatePlace",
  async ({ id, place }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${BASE_URL}/api/places/${id}`, place, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const deletePlace = createAsyncThunk(
  "places/deletePlace",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/api/places/${payload.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const fetchUserPlaces = createAsyncThunk(
  "places/fetchUserPlaces",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/places/myPlaces`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const addReview = createAsyncThunk(
  "places/addReview",
  async ({ placeId, comment, rating }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/places/${placeId}/reviews`,
        { comment, rating },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const deleteReview = createAsyncThunk(
  "places/deleteReview",
  async ({ placeId, reviewId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/api/places/${placeId}/reviews/${reviewId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const editReview = createAsyncThunk(
  "places/editReview",
  async ({ placeId, reviewId, comment, rating }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/api/places/${placeId}/reviews/${reviewId}`,
        { comment, rating },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

// placeSlice
const placeSlice = createSlice({
  name: "places",
  initialState: {
    places: [],
    place: {},
    reviews: [],
    user: {},
    userPlaces: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlaces.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPlaces.fulfilled, (state, action) => {
        state.loading = false;
        state.places = action.payload.places;
      })
      .addCase(fetchPlaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(getPlace.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPlace.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.place = payload.place;
        state.reviews = payload.place.reviews;
      })
      .addCase(getPlace.rejected, (state, { payload }) => {
        state.loading = false;
      });

    builder
      .addCase(addPlace.pending, (state) => {
        state.loading = true;
      })
      .addCase(addPlace.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.place = payload.place;
        toast.success("Place added successfully");
      })
      .addCase(addPlace.rejected, (state, { payload }) => {
        state.loading = false;
        toast.error(payload.message);
      });

    builder
      .addCase(updatePlace.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePlace.fulfilled, (state, action) => {
        state.loading = false;
        state.place = action.payload.place;
        toast.success("Place updated successfully");
      })
      .addCase(updatePlace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error("Failed to update place");
      });

    builder
      .addCase(deletePlace.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePlace.fulfilled, (state, action) => {
        state.loading = false;
        state.places = action.payload.places;
        toast.success("Place deleted successfully");
      })
      .addCase(deletePlace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(fetchUserPlaces.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserPlaces.fulfilled, (state, action) => {
        state.loading = false;
        state.userPlaces = action.payload;
      })
      .addCase(fetchUserPlaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(getReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.reviews;
      })
      .addCase(getReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(addReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.reviews;
        toast.success("Review added successfully");
      })
      .addCase(addReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(editReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(editReview.fulfilled, (state, action) => {
        state.loading = false;
        const editedReview = action.payload?.review;
        if (editedReview) {
          // Finding the edited review and updating its comment
          state.reviews = state.reviews.map((review) => {
            if (review._id === editedReview._id) {
              return { ...review, comment: editedReview.comment };
            }
            return review;
          });
        }
      })
      .addCase(editReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        // Removing the deleted review from the place's reviews
        state.reviews = state.reviews.filter(
          (review) => review._id !== action.payload.reviewId
        );
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default placeSlice.reducer;
