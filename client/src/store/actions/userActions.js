import uuid from "react-uuid";
import { identicon } from "minidenticons";
import {
  DELETE_USER_TO_STORE,
  USERICON_TO_STORE,
  USERID_TO_STORE,
  USERNICKNAME_TO_STORE,
} from "./actionTypes";

export function createUser() {
  return (dispatch) => {
    new Promise((resolve) => {
      const userId = uuid();

      const first = [
        "Ледянная",
        "Крутая",
        "Зеленая",
        "Круглая",
        "Толстая",
        "Горячая",
        "Варенная",
        "Пухлая",
        "Горелая",
        "Микро",
      ];
      const second = [
        "Лама",
        "Коза",
        "Панда",
        "Дубина",
        "Сердцевина",
        "Овца",
        "Гроза",
        "Грудка",
        "Кофеварка",
        "Помидорка",
        "Балка",
      ];

      const userNickname =
        first[Math.floor(Math.random() * first.length)] +
        " " +
        second[Math.floor(Math.random() * second.length)];

      const data = {
        userId,
        userNickname,
      };

      resolve(data);
    })
      .then((data) => {
        return new Promise((resolve) => {
          const icon = identicon(data.userNickname, 100, 40);
          data.userIcon = icon;
          resolve(data);
        });
      })
      .then((data) => {
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("userNickname", data.userNickname);
        localStorage.setItem("userIcon", data.userIcon);

        dispatch(userIdToStore(data.userId));
        dispatch(userNicknameToStore(data.userNickname));
        dispatch(userIconToStore(data.userIcon));
      });
  };
}

export function deleteUser() {
  return (dispatch) => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userNickname");
    localStorage.removeItem("userIcon");

    dispatch(deleteUserToStore());
  };
}

export function userIdToStore(userId) {
  return {
    type: USERID_TO_STORE,
    userId,
  };
}

export function userNicknameToStore(userNickname) {
  return {
    type: USERNICKNAME_TO_STORE,
    userNickname,
  };
}

export function userIconToStore(userIcon) {
  return {
    type: USERICON_TO_STORE,
    userIcon,
  };
}

export function deleteUserToStore() {
  return {
    type: DELETE_USER_TO_STORE,
  };
}
