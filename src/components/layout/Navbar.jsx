// src/components/layout/Navbar.jsx
"use client";

import { Menu, Sun, Moon, UserCircle } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../../store/slices/uiSlice";

export default function Navbar({ onOpenSidebar }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const theme = useSelector((state) => state.ui.theme);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-base font-semibold text-slate-800 dark:text-slate-100 hidden sm:block">
          CRM Workspace
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Dark Mode Toggle */}
        <button
          onClick={() => dispatch(toggleTheme())}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle Theme"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-slate-600" />
          )}
        </button>

        {/* User Pill */}
        <div className="flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-slate-800">
          <UserCircle className="w-7 h-7 text-slate-400" />
          <div className="text-left hidden md:block">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              {user?.name || "CRM User"}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              {user?.role || "Sales Representative"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}