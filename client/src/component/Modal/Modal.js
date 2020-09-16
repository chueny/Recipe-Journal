import React from 'react';
import './Modal.css';
import FontAwesome from 'react-fontawesome';

const Modal = (props) => {

    const { closeModal } = props;

    const closeIcon = () => (
        <FontAwesome
        // Any close icon can be used
        className="close-modal"
        name="times"
        onClick={closeModal}
        style={{
            padding: '10px',
            cursor: 'pointer',
            backgroundColor: 'transparent',
            border: 0,
            position: 'absolute',
            top: '0.3rem',
            right: '0.5rem',
        }}
        />
    );

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                {props.noClose ? "" : closeIcon()}
                {props.children}
            </div>
        </div>
    );
};

export default Modal;