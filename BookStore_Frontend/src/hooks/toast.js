import { useToast } from "@chakra-ui/react";

const useCustomToast = () => {
  const toast = useToast();

  const showToast = (message, type = 0, options = {}) => {
    const defaultOptions = {
      position: "top-right",
      duration: 2000, // Thời gian tự động đóng (ms)
      isClosable: true,
    };

    const toastOptions = { ...defaultOptions, ...options };

    if (type === 0) {
      toast({
        title: message,
        status: "success",
        ...toastOptions,
      });
    } else if (type === 1) {
      toast({
        title: message,
        status: "error",
        ...toastOptions,
      });
    }
  };

  return showToast;
};

export default useCustomToast;
