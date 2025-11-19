import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { achievementAPI } from '../services/api';

export const fetchAchievements = createAsyncThunk(
  'achievement/fetchAchievements',
  async (_, { rejectWithValue }) => {
    try {
      const response = await achievementAPI.getMyAchievements();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch achievements');
    }
  }
);

export const createAchievement = createAsyncThunk(
  'achievement/createAchievement',
  async (achievementData, { rejectWithValue }) => {
    try {
      const response = await achievementAPI.createAchievement(achievementData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create achievement');
    }
  }
);

const achievementSlice = createSlice({
  name: 'achievement',
  initialState: {
    achievements: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAchievements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAchievements.fulfilled, (state, action) => {
        state.loading = false;
        state.achievements = action.payload;
      })
      .addCase(fetchAchievements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createAchievement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAchievement.fulfilled, (state, action) => {
        state.loading = false;
        state.achievements.push(action.payload);
      })
      .addCase(createAchievement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = achievementSlice.actions;
export default achievementSlice.reducer;
