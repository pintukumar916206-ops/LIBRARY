import React from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";
const Modal = ({ isOpen, onClose, title, children, buttons, size = "md" }) => {
  if (!isOpen) return null;
  const sizeClasses = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-lg", xl: "max-w-2xl" };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {" "}
      <div className={`bg-white rounded-lg shadow-lg p-6 ${sizeClasses[size]}`}>
        {" "}
        <div className="flex justify-between items-center mb-4">
          {" "}
          <h2 className="text-xl font-bold">{title}</h2>{" "}
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            {" "}
            <X size={24} />{" "}
          </button>{" "}
        </div>{" "}
        <div className="mb-6">{children}</div>{" "}
        <div className="flex gap-2 justify-end">
          {" "}
          {buttons.map((btn, idx) => (
            <button
              key={idx}
              onClick={btn.onClick}
              className={`px-4 py-2 rounded ${btn.variant === "danger" ? "bg-red-500 hover:bg-red-600 text-white" : btn.variant === "primary" ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-black"}`}
            >
              {" "}
              {btn.label}{" "}
            </button>
          ))}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
      variant: PropTypes.oneOf(["primary", "danger", "default"]),
    })
  ).isRequired,
  size: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
};
export default Modal;
