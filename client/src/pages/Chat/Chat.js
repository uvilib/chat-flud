import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import { useSocket } from "../../context/SocketContext";
import {
  createMessage,
  deleteAllMessages,
  deleteSelectedMessages,
} from "../../store/actions/messageActions";
import { deleteUser } from "../../store/actions/userActions";
import {
  dropMenu,
  closeDropMenu,
  autosizeTextArea,
  dropHeaderMenu,
  closeHeaderMenu,
} from "../../utils/DOMEdit";
import "./Chat.scss";

const Chat = (props) => {
  const [clients, setClients] = useState();
  const [textMessage, setTextMessage] = useState("");
  const [messages, setMessages] = useState();
  const [image, setImage] = useState();

  const socket = useSocket();

  useEffect(() => {
    setMessages(props.messages);
  }, [props.messages]);

  const setRef = useCallback((node) => {
    if (node) {
      node.scrollIntoView({ smooth: true });
    }
  }, []);

  useEffect(() => {
    if (socket) {
      socket.emit("connect-room", JSON.stringify(props.userNickname));

      socket.on("new-connect", (data) => {
        setClients(data);
      });

      socket.on("client-disconnect", (data) => {
        setClients(data);
      });

      socket.on("redux-message", (data) => {
        props.createMessage(data);
      });
    }
  }, [socket, props.userNickname]);

  function sendMessage() {
    if (textMessage.trim() !== "" || image) {
      socket.emit(
        "send-message",
        JSON.stringify({
          icon: props.userIcon,
          text: textMessage.trim(),
          image,
        })
      );
      setTextMessage("");
      setImage(null);
      const imageBlock = document.querySelector(".chat-footer-preview");
      document.getElementById("input__file").value = "";
      imageBlock.style.display = "none";
    }
  }

  function enterPress(e) {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      sendMessage();
      setTextMessage("");
    }
  }

  function encodeImageFileAsURL(element) {
    const file = element.target.files[0];
    var reader = new FileReader();
    const imageBlock = document.querySelector(".chat-footer-preview");
    const image = document.querySelector("#preview-image");
    reader.onloadend = function () {
      imageBlock.style.display = "flex";
      image.src = reader.result;
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  }

  function closePreview() {
    const imageBlock = document.querySelector(".chat-footer-preview");
    imageBlock.style.display = "none";
    setImage(null);
    document.getElementById("input__file").value = "";
  }

  let arr = [];
  function selectMessageItem(index) {
    const item = document.getElementsByClassName("chat-main-content-item");
    const deletebtn = document.querySelector(".chat-footer-delete");

    if (item[index].classList.contains("selected-item-message")) {
      item[index].classList.remove("selected-item-message");
      arr.splice(arr.indexOf(index), 1);
    } else {
      item[index].classList.add("selected-item-message");
      arr.push(index);
    }

    if (arr.length === 0) {
      deletebtn.style.display = "none";
    } else {
      deletebtn.style.display = "flex";
    }
  }

  function deleteMessages() {
    props.deleteSelectedMessages(arr);
    setMessages(props.messages);

    const item = document.getElementsByClassName("chat-main-content-item");
    const deletebtn = document.querySelector(".chat-footer-delete");

    for (let index = 0; index < item.length; index++) {
      item[index].classList.remove("selected-item-message");
    }
    deletebtn.style.display = "none";

    arr = [];
  }
  function deleteAllMessages() {
    props.deleteAllMessages();

    closeHeaderMenu();
  }

  return (
    <div className="chat">
      <div className="chat-wrapper">
        <div className="chat-header">
          <div
            className="chat-header-icon"
            dangerouslySetInnerHTML={{ __html: props.userIcon }}
          ></div>
          <span>{props.userNickname}</span>
          <button>
            <ion-icon
              name="ellipsis-horizontal-outline"
              onClick={dropHeaderMenu}
            ></ion-icon>
            <div className="chat-header-menu" onMouseLeave={closeHeaderMenu}>
              <span
                onClick={() => {
                  props.deleteUser();
                  props.deleteAllMessages();
                }}
              >
                Выйти и удалить аккаунт
              </span>
              <span onClick={deleteAllMessages}>Удалить все сообщения</span>
            </div>
          </button>
        </div>
        <div className="chat-main">
          <div className="chat-main-sidebar app-scroll">
            <div className="chat-main-sidebar-drop" onClick={dropMenu}>
              <ion-icon name="menu"></ion-icon>
            </div>
            <div className="chat-main-sidebar-list ">
              <ion-icon name="close" onClick={closeDropMenu}></ion-icon>
              <div className="chat-main-sidebar-list__list">
                <span>Подключенные пользователи</span>
                <ul>
                  {clients
                    ? clients.map((item, index) => {
                        return <li key={index}>{item}</li>;
                      })
                    : null}
                </ul>
              </div>
            </div>
          </div>
          <div className="chat-main-content app-scroll">
            {messages
              ? messages.map((item, index) => {
                  const lastMessage = messages.length - 1 === index;
                  return (
                    <div
                      className="chat-main-content-item"
                      ref={lastMessage ? setRef : null}
                      onClick={() => selectMessageItem(index)}
                      key={index}
                    >
                      <div
                        className={`chat-main-content-item-message ${
                          item.id === props.userId ? "fromMe" : "fromSender"
                        }`}
                      >
                        <div
                          className="chat-main-content-item-message__icon"
                          dangerouslySetInnerHTML={{ __html: item.icon }}
                        ></div>
                        <div className="chat-main-content-item-message-data">
                          <span>
                            {item.id === props.userId ? "Вы" : item.nickname}
                          </span>
                          <div className="chat-main-content-item-message-data-text">
                            <span>{item.text}</span>
                            {item.image ? (
                              <img src={item.image} alt="" />
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              : null}
          </div>
        </div>
        <div className="chat-footer">
          <div className="chat-footer-delete">
            <span onClick={deleteMessages}>Удалить выбранные элементы</span>
          </div>
          <div className="chat-footer-preview">
            <div className="chat-footer-preview__item">
              <img src="" alt="" id="preview-image" />
              <ion-icon name="close-sharp" onClick={closePreview}></ion-icon>
            </div>
          </div>
          <div className="chat-footer-form">
            <div className="chat-footer__wrapper">
              <input
                name="file"
                type="file"
                id="input__file"
                className="chat-footer__input"
                accept="image/*"
                onChange={(e) => {
                  encodeImageFileAsURL(e);
                }}
              />
              <label
                htmlFor="input__file"
                className="chat-footer__input-button"
              >
                <span className="chat-footer__input-icon">
                  <ion-icon name="document-attach-outline"></ion-icon>
                </span>
              </label>
            </div>
            <textarea
              rows="1"
              value={textMessage}
              className="app-scroll"
              onFocus={autosizeTextArea}
              onChange={(e) => {
                setTextMessage(e.target.value);
              }}
              onKeyDown={enterPress}
            />
            <div className="chat-footer__sendbtn" onClick={sendMessage}>
              <span>Send</span>
              <ion-icon name="send"></ion-icon>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    userId: state.user.userId,
    userNickname: state.user.userNickname,
    userIcon: state.user.userIcon,
    messages: state.message.messages,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createMessage: (data) => dispatch(createMessage(data)),
    deleteUser: () => dispatch(deleteUser()),
    deleteAllMessages: () => dispatch(deleteAllMessages()),
    deleteSelectedMessages: (array) => dispatch(deleteSelectedMessages(array)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
