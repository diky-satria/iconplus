import { combineReducers } from "redux";
import authReducer from "./auth/reducer";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const reducer: any = combineReducers({
  auth: authReducer,
});

export default reducer;
