import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import videoReducer from "../features/video/videoSlice";
import commentReducer from "../features/comment/commentSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    video: videoReducer,
    comment: commentReducer,
  },
});

export default store;
