import type { ToastType } from "@/context/ToastContext";

type ToastHandler = (message: string, type?: ToastType, duration?: number) => void;

class ToastService {
  private handler: ToastHandler | null = null;

  register(handler: ToastHandler) {
    this.handler = handler;
  }

  show(message: string, type: ToastType = "info", duration: number = 3000) {
    if (this.handler && message) {
      this.handler(message, type, duration);
    }
  }

  success(message: string, duration?: number) {
    this.show(message, "success", duration);
  }

  error(message: string, duration?: number) {
    this.show(message, "error", duration);
  }

  warning(message: string, duration?: number) {
    this.show(message, "warning", duration);
  }

  info(message: string, duration?: number) {
    this.show(message, "info", duration);
  }
}

export const toastService = new ToastService();
