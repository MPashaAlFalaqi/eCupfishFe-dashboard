"use client";

import React from "react";
import { History, ShieldCheck, ShieldAlert, UserX, UserCheck, PlusCircle, CheckCircle2 } from "lucide-react";
import { ActivityLog } from "@/data/mockData";

interface ActivityLogsViewProps {
  logs: ActivityLog[];
}

export const ActivityLogsView: React.FC<ActivityLogsViewProps> = ({ logs }) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Log Aktivitas & Audit Akun
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Riwayat lengkap verifikasi, penolakan, penangguhan, dan pemblokiran akun oleh Super Admin.
        </p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-xs border border-slate-200/80">
        <div className="relative border-l-2 border-slate-200 ml-4 space-y-6 py-2">
          {logs.map((log) => (
            <div key={log.id} className="relative pl-6 group">
              {/* Dot Icon */}
              <div
                className={`absolute -left-3 top-1 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white ${
                  log.badgeVariant === "green"
                    ? "bg-emerald-500 text-white"
                    : log.badgeVariant === "red"
                    ? "bg-rose-500 text-white"
                    : log.badgeVariant === "amber"
                    ? "bg-amber-500 text-white"
                    : "bg-blue-600 text-white"
                }`}
              >
                {log.badgeVariant === "green" && <CheckCircle2 className="w-3.5 h-3.5" />}
                {log.badgeVariant === "red" && <ShieldAlert className="w-3.5 h-3.5" />}
                {log.badgeVariant === "amber" && <ShieldCheck className="w-3.5 h-3.5" />}
                {log.badgeVariant === "blue" && <PlusCircle className="w-3.5 h-3.5" />}
              </div>

              {/* Log Card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{log.judul}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        log.targetRole === "Pembudidaya"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {log.targetRole}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">{log.timestamp}</span>
                </div>

                <p className="text-xs text-slate-600 mb-2 leading-relaxed">{log.detail}</p>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-200/60">
                  <span>
                    Target: <strong className="text-slate-700">{log.targetName}</strong>
                  </span>
                  <span>
                    Oleh: <span className="font-semibold text-slate-700">{log.adminName}</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
