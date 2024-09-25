import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Make sure to import the CSS

// Function to trigger notifications
export const notify = (message, type = 'info') => {
  switch (type) {
    case 'success':
      toast.success(message, { position: "top-right" });
      break;
    case 'error':
      toast.error(message, { position: "top-right" });
      break;
    case 'warning':
      toast.warn(message, { position: "top-right" });
      break;
    default:
      toast.info(message, { position: "top-right" });
      break;
  }
};

const ToastNotifications = () => {
  return (
    <ToastContainer
      position="top-right"  // Set the default position
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  );
};

export default ToastNotifications;