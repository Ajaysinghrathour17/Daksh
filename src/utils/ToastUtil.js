// src/utils/ToastUtil.js
// ❌ DO NOT import Toast component here
// import Toast from '../components/Toast'; // ← Remove this line

// Global toast instance state
let toastInstance = null;

// Function to set the toast instance (called by ToastProvider)
export const setToastInstance = (instance) => {
  toastInstance = instance;
};

// Global functions to show toast from anywhere
export const showSuccessToast = (message) => {
  if (toastInstance) {
    toastInstance.showToast(message, 'success');
  } else {
    console.warn('Toast instance not available. Wrap your app with ToastProvider.');
  }
};

export const showErrorToast = (message) => {
  if (toastInstance) {
    toastInstance.showToast(message, 'error');
  } else {
    console.warn('Toast instance not available. Wrap your app with ToastProvider.');
  }
};

export const showInfoToast = (message) => {
  if (toastInstance) {
    toastInstance.showToast(message, 'info');
  } else {
    console.warn('Toast instance not available. Wrap your app with ToastProvider.');
  }
};