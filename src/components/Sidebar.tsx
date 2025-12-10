import { NavLink } from "react-router-dom";
import {
  Home,
  Store,
  Truck,
  PackageCheck,
  X,
  MapPin,
  Settings,
  Package,
  Bike,
} from "lucide-react";
import { useAuth } from "../store/authStore";
import AddOrderMenu from "../pages/AddOrderMenu";
import { useState } from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { role } = useAuth();
  const [isAddOrderOpen, setAddOrderOpen] = useState(false);

  const handleAddOrderClick = () => {
    setAddOrderOpen(true);
    onClose(); // close sidebar
  };
  return (
    <>
      {/* Overlay (sidebar) */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity lg:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      <div
        className={`fixed top-0 right-0 bottom-0 w-70 bg-[#21114A] text-white h-screen p-4 flex flex-col pt-5 z-50 transition-transform duration-300
        ${isOpen ? "translate-x-0" : "translate-x-full"} lg:translate-x-0`}>
        {/* Close button on mobile */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 lg:hidden text-white">
          <X size={28} />
        </button>

        {/* Logo */}
        <div className="flex mb-3 pb-1 justify-center">
          <h1 className="text-4xl font-bold text-[#fff] mb-2 mt-2">Routes</h1>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col gap-3">
          {[
            {
              to: "/home",
              icon: <Home size={22} />,
              label: "الرئيسيه",
              roles: ["ADMIN", "COMPANY_ADMIN"],
            },
            {
              to: "/current-deliveries",
              icon: <Bike size={22} />,
              label: "قائمه عرض الطيارين",
              roles: ["COMPANY_ADMIN"],
            },
            {
              to: "/orders",
              icon: <PackageCheck size={22} />,
              label: "متابعه الطلبات",
              roles: ["ADMIN", "COMPANY_ADMIN"],
            },
            // 🔹 replace route with button action
            {
              action: handleAddOrderClick,
              icon: <Package size={22} />,
              label: "اوردر سريع",
              roles: ["COMPANY_ADMIN"],
            },
            {
              to: "/companies",
              icon: <Store size={22} />,
              label: "الشركات",
              roles: ["ADMIN"],
            },
            {
              to: "/clients",
              icon: <Store size={22} />,
              label: "العملاء",
              roles: ["ADMIN", "COMPANY_ADMIN"],
            },
            {
              to: "/deliveries",
              icon: <Truck size={22} />,
              label: "المناديب",
              roles: ["ADMIN", "COMPANY_ADMIN"],
            },
            {
              to: "/map",
              icon: <MapPin size={22} />,
              label: "تتبع الطيار",
              roles: ["COMPANY_ADMIN"],
            },
            {
              to: "/setting",
              icon: <Settings size={22} />,
              label: "الاعدادات",
              roles: ["COMPANY_ADMIN"],
            },
          ]
            .filter((l) => l.roles.includes(role))
            .map((item) =>
              item.action ? (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="flex items-center gap-3 p-2 rounded-[7px] 
             bg-[#878787] text-white font-bold text-md
             transition-all active:translate-y-[2px]
             shadow-[0px_4px_0px_#5c5c5c] hover:shadow-[0px_6px_0px_#4a4a4a]">
                  <span
                    className="bg-white p-[8px] rounded-[7px] text-[#121E2C]
                   shadow-[inset_0px_1px_2px_rgba(0,0,0,0.3)]">
                    {item.icon}
                  </span>

                  <span>{item.label}</span>
                </button>
              ) : (
                <NavLink
                  key={item.to}
                  to={item.to!}
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-2 rounded-[7px] transition ${
                      isActive
                        ? "bg-[#D9C8AA] text-[#404040]"
                        : "hover:bg-gray-700 text-white"
                    }`
                  }
                  onClick={() => setAddOrderOpen(false)}>
                  <span className="bg-white p-[8px] rounded-[7px] text-[#121E2C]">
                    {item.icon}
                  </span>
                  <span className="font-bold text-md">{item.label}</span>
                </NavLink>
              )
            )}
        </nav>
      </div>

      {/* ✅ Add Order Menu Overlay */}
      <AddOrderMenu
        isOpen={isAddOrderOpen}
        onClose={() => setAddOrderOpen(false)}
      />
    </>
  );
};

export default Sidebar;
