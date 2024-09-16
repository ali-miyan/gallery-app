import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { userApiSlice } from "./reducers/userSlice";

const rootReducer = combineReducers({
  [userApiSlice.reducerPath]: userApiSlice.reducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApiSlice.middleware),
});

export default store;

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
