import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import placeReducer from "./placeSlice";
import userReducer from "./userSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    places: placeReducer,
    users: userReducer,
  },
});

export default store;
