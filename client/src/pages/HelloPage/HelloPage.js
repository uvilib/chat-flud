import React from "react";
import { connect } from "react-redux";
import { createUser } from "../../store/actions/userActions";
import "./HelloPage.scss";

const HelloPage = (props) => {
  return (
    <div className="hellopage-wrapper">
      <div className="hellopage-hellotext">
        <h1>Вы попали в чат-флудилку</h1>
        <span>
          Нажмите кнопку, которая находится ниже, чтобы попасть в общую комнату
          с посетителями этого сайта для обмена сообщениями
        </span>
      </div>
      <div className="hellopage-button">
        <button onClick={props.createUser}>Начать переписку</button>
      </div>
    </div>
  );
};

function mapDispatchToProps(dispatch) {
  return {
    createUser: () => dispatch(createUser()),
  };
}

export default connect(null, mapDispatchToProps)(HelloPage);
