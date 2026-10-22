"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface Shell { collapsed: boolean; toggleCollapsed: () => void; mobileOpen: boolean; setMobileOpen: (v: boolean) => void }
const Ctx = createContext<Shell>({ collapsed: false, toggleCollapsed: () => {}, mobileOpen: false, setMobileOpen: () => {} });
export const useShell = () => useContext(Ctx);

/** Status sidebar bersama: ciut di desktop (diingat di browser) dan laci di layar kecil. */
export function ShellProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => { try { setCollapsed(localStorage.getItem("ecupfish-sidebar") === "1"); } catch { /* abaikan */ } }, []);
  const toggleCollapsed = () => setCollapsed(c => { const n = !c; try { localStorage.setItem("ecupfish-sidebar", n ? "1" : "0"); } catch { /* abaikan */ } return n; });
  return <Ctx.Provider value={{ collapsed, toggleCollapsed, mobileOpen, setMobileOpen }}>{children}</Ctx.Provider>;
}
