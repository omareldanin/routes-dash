import { Settings, Menu } from "lucide-react";
import { useState } from "react";
import admin from "../assets/user.png";
import { useAuth } from "../store/authStore";

interface NavbarProps {
  toggleSidebar: () => void;
}

export default function Navbar({ toggleSidebar }: NavbarProps) {
  const { name, role, avatar, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 lg:right-70 bg-white shadow-sm px-6 py-3 flex items-center justify-between z-40">
      {/* Left: Toggle button (mobile only) */}
      <div className="flex gap-2">
        <button
          className="lg:hidden text-gray-800"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar">
          <Menu size={26} />
        </button>

        <div className="flex items-center gap-3 ms-auto">
          <img
            src={"https://test.talabatk.top/" + avatar || admin}
            alt="User"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="text-right">
            <p className="font-medium text-gray-900">{name}</p>
            <p className="text-sm text-gray-500">
              {role === "ADMIN"
                ? "مدير النظام"
                : role === "COMPANY_ADMIN"
                ? "مدير الشركه"
                : role === "DELIVERY"
                ? "مندوب"
                : "مساعد "}
            </p>
          </div>
        </div>
      </div>

      {/* Left: Icons */}
      <div className="flex items-center gap-1">
        {/* Notifications */}
        <div className="relative">
          {/* <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2">
            <Bell size={22} className="text-gray-800" />
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
              3
            </span>
          </button> */}

          {showNotifications && (
            <div className="absolute left-0 top-15 w-64 bg-white border rounded-lg shadow-lg text-right">
              <div className="p-3 border-b font-semibold">الإشعارات</div>
              <ul className="max-h-60 overflow-y-auto">
                <li className="p-3 hover:bg-gray-50 cursor-pointer text-sm">
                  إشعار جديد 1
                </li>
              </ul>
              <div className="p-2 text-center text-sm text-gray-500 border-t">
                عرض الكل
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <button className="p-2" onClick={() => setShowSettings(!showSettings)}>
          <Settings size={22} className="text-gray-800" />
        </button>

        {showSettings && (
          <div className="absolute left-10 top-20 w-40 bg-white border rounded-lg shadow-lg text-right">
            <ul className="max-h-60 overflow-y-auto">
              <li
                className="p-3 hover:bg-gray-50 cursor-pointer text-sm text-[red]"
                onClick={logout}>
                تسجيل خروج
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
