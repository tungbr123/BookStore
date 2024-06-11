import { toast } from 'react-toastify';

// type = 0 => success
// type = 1 => error
const showToast = (message, type = 0, options = {}) => {
  const defaultOptions = {
      position: 'top-right',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
  };

  const toastOptions = { ...defaultOptions, ...options };
  if (type === 0) {
      confirm(message);
    //   toast.success(message, toastOptions);
  } else if(type === 1) {
      confirm(message);
    //   toast.error(message, toastOptions);
  }
};

export default showToast