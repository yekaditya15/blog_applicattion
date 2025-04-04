import { toast } from "react-toastify";

const toastConfig = {
  position: "bottom-right", // Changed to bottom-right for better UX
  autoClose: 2000, // Reduced to 2 seconds
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored", // Added theme
  style: {
    fontSize: "14px",
    fontWeight: "500",
  },
};

export const showToast = {
  success: (message) =>
    toast.success(message, {
      ...toastConfig,
      icon: "👍",
    }),
  error: (message) => toast.error(message, toastConfig),
  info: (message) =>
    toast.info(message, {
      ...toastConfig,
      icon: "ℹ️",
    }),
  warning: (message) => toast.warning(message, toastConfig),
};
