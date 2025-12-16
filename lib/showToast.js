import { toast, Zoom } from "react-toastify"

export const showToast = (type, message) => {
    let options = {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        newestOnTop: false,
        closeOnClick: true,
        rtl: false,
        pauseOnFocusLoss: true,
        draggable: true,
        pauseOnHover: true,
        theme: "colored",
        transition: Zoom
    }

    switch (type) {
        case 'info':
            toast.info(message, options)
            break;
        case 'success':
            toast.success(message, options)
            break;
        case 'warning':
            toast.warning(message, options)
            break;
        case 'error':
            toast.error(message, options)
            break;
        default:
            toast(message, options)
            break;
    }
}