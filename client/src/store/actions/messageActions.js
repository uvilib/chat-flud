import {
  DELETE_ALL_MESSAGES_TO_STORE,
  MESSAGE_TO_STORE,
  MESSAGE_TO_STORE_AFTER_DELETE,
} from "./actionTypes";

const messageStore = JSON.parse(localStorage.getItem("message")) || [];

export function createMessage(message) {
  return (dispatch) => {
    messageStore.push(message);

    localStorage.setItem("message", JSON.stringify(messageStore));

    dispatch(messageToStore(message));
  };
}

export function deleteAllMessages() {
  return (dispatch) => {
    localStorage.removeItem("message");
    messageStore.splice(0, messageStore.length);
    dispatch(deleteAllMessagesToStore());
  };
}

export function deleteSelectedMessages(array) {
  return (dispatch) => {
    array.map((item) => {
      messageStore.splice(item, 1, null);
    });

    for (let index = 0; index < messageStore.length; index++) {
      if (messageStore[index] === null) {
        messageStore.splice(index, 1);
        index--;
      }
    }

    localStorage.removeItem("message");
    localStorage.setItem("message", JSON.stringify(messageStore));

    dispatch(messageToStoreAfterDelete(messageStore));
  };
}

export function messageToStore(message) {
  return {
    type: MESSAGE_TO_STORE,
    message,
  };
}

export function deleteAllMessagesToStore() {
  return {
    type: DELETE_ALL_MESSAGES_TO_STORE,
  };
}

export function messageToStoreAfterDelete(messages) {
  return {
    type: MESSAGE_TO_STORE_AFTER_DELETE,
    messages,
  };
}
