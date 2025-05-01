"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          // Apply muted background for dark theme toasts
          <Toast key={id} {...props} className="bg-muted text-muted-foreground border-border">
            <div className="grid gap-1">
              {title && <ToastTitle className="text-foreground">{title}</ToastTitle>} {/* Ensure title uses foreground */}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      {/* Ensure viewport position is top-right */}
      <ToastViewport className="sm:top-0 sm:right-0 sm:bottom-auto sm:left-auto" />
    </ToastProvider>
  )
}
