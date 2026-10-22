import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import MobileDrawer from "@/components/MobileDrawer";
import NavProgress from "@/components/NavProgress";
import { ShellProvider } from "@/components/ShellProvider";
import { ToastProvider } from "@/components/Toast";
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <ShellProvider>
        <div className="flex min-h-screen">
          <NavProgress />
          <Sidebar />
          <MobileDrawer />
          <div className="flex min-w-0 flex-1 flex-col">
            <Navbar />
            <main className="min-w-0 flex-1 p-4 sm:p-6">{children}</main>
          </div>
        </div>
      </ShellProvider>
    </ToastProvider>
  );
}
