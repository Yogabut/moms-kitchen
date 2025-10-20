import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Utensils, ShoppingCart, Menu, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Props {
  activeTab: "menu" | "order";
  setActiveTab: (tab: "menu" | "order") => void;
}

export default function Sidebar({ activeTab, setActiveTab }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { name: "Menu Management", icon: Utensils, tab: "menu" as const },
    { name: "Order Management", icon: ShoppingCart, tab: "order" as const },
  ];

  const handleBack = () => {
    navigate("/");
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-primary text-white p-2 rounded-md"
      >
        <Menu size={20} />
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky lg:top-0 top-0 left-0 h-screen w-60 bg-zinc-900 text-white p-5 border-r border-zinc-800 transition-transform duration-300 z-40 flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex items-center gap-2 mb-10">
          <LayoutDashboard className="text-primary" size={22} />
          <h2 className="text-xl font-semibold">Admin Panel</h2>
        </div>

        <nav className="space-y-2 flex-1">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                setActiveTab(item.tab);
                setIsOpen(false);
              }}
              className={cn(
                "flex items-center gap-3 w-full px-4 py-2 rounded-lg transition-colors duration-200 text-left",
                activeTab === item.tab
                  ? "bg-primary text-white"
                  : "hover:bg-zinc-800"
              )}
            >
              <item.icon size={18} />
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        {/* Back Button at Bottom */}
        <div className="mt-auto pt-4 border-t border-zinc-800">
          <Button
            onClick={handleBack}
            variant="ghost"
            className="w-full justify-start gap-3 text-white hover:bg-zinc-800"
          >
            <ArrowLeft size={18} />
            <span>Back to Home</span>
          </Button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
        />
      )}
    </>
  );
}