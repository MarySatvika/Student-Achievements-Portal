import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import achievementReducer from './achievementSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    achievement: achievementReducer,
  },
});

export default store;
