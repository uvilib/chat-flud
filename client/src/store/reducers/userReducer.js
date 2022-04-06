import {
  DELETE_USER_TO_STORE,
  USERICON_TO_STORE,
  USERID_TO_STORE,
  USERNICKNAME_TO_STORE,
} from "../actions/actionTypes";

const initialState = {
  userId: localStorage.getItem("userId") || null,
  userIcon: localStorage.getItem("userIcon") || null,
  userNickname: localStorage.getItem("userNickname") || null,
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case USERID_TO_STORE:
      return {
        ...state,
        userId: action.userId,
      };
    case USERNICKNAME_TO_STORE:
      return {
        ...state,
        userNickname: action.userNickname,
      };
    case USERICON_TO_STORE:
      return {
        ...state,
        userIcon: action.userIcon,
      };
    case DELETE_USER_TO_STORE:
      return {
        userId: null,
        userIcon: null,
        userNickname: null,
      };
    default:
      return state;
  }
}
