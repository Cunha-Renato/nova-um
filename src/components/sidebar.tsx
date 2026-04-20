import { ChevronLeft, Settings } from "lucide-react";
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "../lib/routes";
import { SettingsPopup } from "./settings";

export function Sidebar() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [settings_state, setSettingsState] = useState(false);

  // Theme
  const [dark, setDark] = useState(
    () => localStorage.getItem('theme') === 'dark'
  )
  const toggle = () => {
    const next = !dark
    setDark(next)
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  return (
    <aside className={`flex h-screen flex-col border-r border-gray-200 bg-background transition-all duration-100 ${collapsed ? "w-15" : "w-50"}`}>
      <div className={`flex h-14 items-center border-b border-gray-200 px-3 ${collapsed ? "justify-center" : "justify-between"}`}>
        {!collapsed && <span className="font-semibold text-foreground">NovaUm</span>}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-background-hover-sidebar"
        >
          <ChevronLeft className={`h-4 w-4 text-foreground-inactive-sidebar transition-transform ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </div>

      <nav className="flex flex-col h-full space-y-1 p-2">
        {ROUTES.map(({ icon: Icon, label, href }) => (
          <button
            type="button"
            key={label}
            onClick={() => navigate(href)}
            title={collapsed ? label : ""}
            className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${collapsed ? "justify-center" : "justify-start"
              } ${location.pathname === href ? "bg-background-active-sidebar text-foreground-active-sidebar" : "text-foreground-inactive-sidebar hover:bg-background-hover-sidebar hover:text-foreground-active-sidebar"}`}
          >
            <Icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{label}</span>}
          </button>
        ))}
        <button
          type="button"
          className={`mt-auto flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground-inactive-sidebar hover:bg-background-hover-sidebar hover:text-foreground-active-sidebar`}
          onClick={() => setSettingsState((o) => !o)}
        >
          <Settings className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Settings</span>}
        </button>
      </nav>

      {settings_state && <SettingsPopup
        dark={dark}
        toggle={toggle}
        onClose={() => setSettingsState(false)}
      />}
    </aside>
  )
}