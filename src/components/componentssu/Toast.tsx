"use client";

import React from "react";
import { CheckCircle2, AlertCircle, X, ShieldAlert, Info } from "lucide-react";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl shadow-lg border text-xs font-medium animate-in slide-in-from-bottom-2 fade-in duration-200 ${
            toast.type === "success"
              ? "bg-[#0B1A30] text-white border-emerald-500/50 shadow-emerald-950/20"
              : toast.type === "error"
              ? "bg-rose-950 text-white border-rose-500 shadow-rose-950/20"
              : toast.type === "warning"
              ? "bg-amber-950 text-amber-100 border-amber-500"
              : "bg-slate-900 text-white border-slate-700"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {toast.type === "success" && (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            {toast.type === "error" && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            {toast.type === "warning" && <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />}
            {toast.type === "info" && <Info className="w-4 h-4 text-blue-400 shrink-0" />}
            <span className="leading-snug">{toast.message}</span>
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="p-1 text-slate-400 hover:text-white rounded transition-colors ml-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
