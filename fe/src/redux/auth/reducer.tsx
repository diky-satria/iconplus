import { AUTH_LOGIN, AUTH_LOGOUT } from "./action";

const authInitialState = {
  user: null,
};

const initialState = {
  ...authInitialState,
  action: "",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const authReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case AUTH_LOGIN:
      return {
        ...state,
        action: action.type,
        user: action.payload,
      };
    case AUTH_LOGOUT:
      return {
        user: null,
      };
    default:
      return state;
  }
};

export default authReducer;
