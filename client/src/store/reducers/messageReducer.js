import {
  DELETE_ALL_MESSAGES_TO_STORE,
  MESSAGE_TO_STORE,
  MESSAGE_TO_STORE_AFTER_DELETE,
} from "../actions/actionTypes";

const initialState = {
  messages: JSON.parse(localStorage.getItem("message")) || [],
};

export default function messageReducer(state = initialState, action) {
  switch (action.type) {
    case MESSAGE_TO_STORE:
      return {
        messages: [...state.messages, action.message],
      };
    case DELETE_ALL_MESSAGES_TO_STORE:
      return {
        messages: [],
      };
    case MESSAGE_TO_STORE_AFTER_DELETE:
      return {
        messages: JSON.parse(localStorage.getItem("message")),
      };
    default:
      return state;
  }
}
