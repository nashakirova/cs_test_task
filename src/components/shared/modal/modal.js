import React from "react";
import styles from "./modal.scss";

export const Modal = (props) => {
    return (
        <div className={props.className ||styles.modal} onClick={props.backgroundClicked}>
            {props.children}
        </div>
    )
}