"use client";

import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastProvider,
  ToastTitle,
  ToastDescription,
  ToastViewport,
} from "@/components/ui/toast";

export function Toaster() {
  const { toasts, dismiss } = useToast();
  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, variant }) => (
        <Toast key={id} variant={variant} onClose={() => dismiss(id)}>
          <div className="grid gap-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && (
              <ToastDescription>{description}</ToastDescription>
            )}
          </div>
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  );
}