// src/components/LoginPopup.jsx
import React from "react";
import style from "../styles/LoginPopup.module.css";

const LoginPopup = ({ success, message, subMessage, onClose }) => {
  return (
    <div className={style["popup-overlay"]}>
      <div className={style["popup-box"]}>
        <div className={`${style["popup-icon"]} ${success ? style["success"] : style["failed"]}`}>
          {success ? "✔" : "✖"}
        </div>
        <h2 className={style["popup-title"]}>
          {success ? "Login Success!" : "Login Failed!"}
        </h2>
        <p className={style["popup-message"]}>{subMessage}</p>
        {!success && (
          <button className={style["popup-button"]} onClick={onClose}>
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

export default LoginPopup;
