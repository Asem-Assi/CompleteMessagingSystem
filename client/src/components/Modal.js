// Modal.js
import React from 'react';

const Modal = ({ isOpen, onClose, onAccept, onReject ,caller}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
      <div
        className="bg-white p-6 rounded-lg shadow-lg relative w-4/5 max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">A new call from {caller?.name}</h2>
        <div className="flex justify-between">
          <button
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
            onClick={onAccept}
          >
            Accept
          </button>
          <button
            className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
            onClick={onReject}
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
