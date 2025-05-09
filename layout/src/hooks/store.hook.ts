import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/User/user.store';
import adminReducer from '../features/Admin/admin.store';

const store = configureStore({
  reducer: {
    user: userReducer,
    admin: adminReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
