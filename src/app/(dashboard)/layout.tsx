import Sidebar from "@/components/Sidebar";
import NavProgress from "@/components/NavProgress";
import { ToastProvider } from "@/components/Toast";
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <ToastProvider><div className="flex min-h-screen"><NavProgress /><Sidebar /><main className="min-w-0 flex-1 p-6">{children}</main></div></ToastProvider>;
}
