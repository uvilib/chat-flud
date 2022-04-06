import React, { useEffect, useState } from "react";
import Chat from "./pages/Chat/Chat";
import HelloPage from "./pages/HelloPage/HelloPage";
import { connect } from "react-redux";
import { SocketProvider } from "./context/SocketContext";
import "./App.scss";

function App(props) {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    setIsAuth(props.userId);
  }, [props.userId]);
  return (
    <div className="app">
      {isAuth ? (
        <SocketProvider id={props.userId} nickname={props.userNickname}>
          <Chat />
        </SocketProvider>
      ) : (
        <HelloPage />
      )}
    </div>
  );
}

function mapStateToProps(state) {
  return {
    userId: state.user.userId,
    userNickname: state.user.userNickname,
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
