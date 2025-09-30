import { ReactNode, useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { label: "Dashboard", path: "/" },
  { label: "Dealflow Triage", path: "/dealflow-triage" },
  { label: "Meeting Preparation", path: "/meeting-prep" },
  { label: "CRM Hygiene", path: "/crm-hygiene" },
  { label: "Research & Outbound", path: "/research-outbound" },
  { label: "Portfolio & LP Ops", path: "/portfolio-lp" },
  { label: "Agents Library", path: "/agents" },
  { label: "Runs", path: "/runs" },
  { label: "Audit Logs", path: "/audit" },
  { label: "Settings", path: "/settings" },
];

export const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-full bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } transition-all duration-200 border-r border-border bg-background overflow-hidden`}
      >
        <div className="p-4 border-b border-border">
          <h1 className="text-xl font-bold">VC Agent Builder</h1>
        </div>
        <nav className="p-4">
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `block px-3 py-2 text-sm border border-transparent hover:bg-grey-light transition-colors ${
                    isActive ? "bg-accent text-accent-foreground" : ""
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-14 border-b border-border flex items-center px-4 gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="border border-border"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          <div className="flex-1 max-w-2xl">
            <input
              type="text"
              placeholder="Describe what to automate… e.g., 'Automate deal triage from inbound emails to Pipedrive with approvals'"
              className="w-full px-4 py-2 text-sm border border-border bg-background focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Save
            </Button>
            <Button variant="outline" size="sm">
              Preview
            </Button>
            <Button size="sm" className="bg-primary text-primary-foreground">
              Run
            </Button>
          </div>

          <div className="ml-4 px-3 py-2 border border-border text-sm">
            User Menu
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
};
