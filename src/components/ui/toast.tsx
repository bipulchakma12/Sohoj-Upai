"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ToastProps {
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
  onClose?: () => void;
}

const Toast: React.FC<ToastProps> = ({ title, description, variant = "default", onClose }) => {
  return (
    <div
      className={cn(
        "pointer-events-auto flex w-full max-w-md items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 shadow-lg transition-all",
        variant === "default" && "bg-background text-foreground border-border",
        variant === "destructive" && "bg-destructive text-destructive-foreground border-destructive",
        variant === "success" && "bg-emerald-600 text-white border-emerald-700"
      )}
    >
      <div className="grid gap-1">
        {title && <div className="text-sm font-semibold">{title}</div>}
        {description && <div className="text-sm opacity-90">{description}</div>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="rounded-md p-1 opacity-70 hover:opacity-100 focus:outline-none"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export { Toast };
