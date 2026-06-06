"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiBook, FiCalendar, FiSettings, FiBarChart2 } from "react-icons/fi";

const sidebarItems = [
  { href: "/dashboard", label: "Dashboard", iconName: "dashboard" },
  { href: "/planner", label: "Planner", iconName: "planner" },
  { href: "/analytics", label: "Analytics", iconName: "analytics" },
  { href: "/settings", label: "Settings", iconName: "settings" }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r p-6 transition-colors duration-300 bg-white text-[#111827] border-[#E5E7EB] dark:border-[#1F2937] dark:bg-[#111827] dark:text-white">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2 font-display text-xl font-semibold text-[#111827] dark:text-white">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-500 dark:bg-[#22C55E]">
          <FiBook className="text-white" size={18} />
        </div>
        StudyFlow
      </Link>

      {/* Navigation */}
      <nav className="mt-12 space-y-2">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          
          let icon;
          switch(item.iconName) {
            case "dashboard":
              icon = <FiHome size={18} />;
              break;
            case "planner":
              icon = <FiCalendar size={18} />;
              break;
            case "analytics":
              icon = <FiBarChart2 size={18} />;
              break;
            case "settings":
              icon = <FiSettings size={18} />;
              break;
            default:
              icon = <FiHome size={18} />;
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition duration-200 ${
                isActive
                  ? "bg-[#22C55E] text-white"
                  : "text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827] dark:text-[#9CA3AF] dark:hover:bg-[#1F2937] dark:hover:text-[#E5E7EB]"
              }`}
            >
              {icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer - Study Tip */}
      <div className="absolute bottom-6 left-6 right-6 rounded-md border bg-white text-[#111827] dark:border-[#1F2937] dark:bg-[#0F1419] dark:text-[#9CA3AF] border-[#E5E7EB] p-4 transition-colors duration-300">
        <p className="text-xs font-medium text-[#22C55E]">💡 PRO TIP</p>
        <p className="mt-2 text-xs text-[#6B7280] dark:text-[#9CA3AF]">Take a 5-minute break every 25 minutes for better focus.</p>
      </div>
    </aside>
  );
}
