import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import quickbooksAccountReducer from "../Slice/QuickbookAccount";
import sageAccountReducer from "../Slice/SageAccount";
import netsuiteAccountReducer from "../Slice/NetsuiteAccount";
import organizationsReducer from "../Slice/Organization";
import authReducer from "../Slice/Authentication";

const rootReducer = combineReducers({
  quickbooksAccount: quickbooksAccountReducer,
  sageAccount: sageAccountReducer,
  netsuiteAccount: netsuiteAccountReducer,
  organizations: organizationsReducer,
  auth: authReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

// Export store for use in components
export default store;
