import {configureStore} from "@reduxjs/toolkit";
import authReducer from "../redux/features/auth/authslice";
import uiReducer from "../redux/features/ui/uislice";


export const store = configureStore({
  reducer:{
    auth:authReducer,
    ui:uiReducer,
  }
})