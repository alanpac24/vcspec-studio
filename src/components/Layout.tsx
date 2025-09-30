import { ReactNode, useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  Filter, 
  Calendar, 
  Database, 
  Search, 
  Briefcase, 
  Box, 
  Play, 
  FileText, 
  Settings 
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: ReactNode;
}

const navSections = [
  {
    title: "Workflows",
    items: [
      { label: "Dashboard", path: "/", icon: LayoutDashboard },
      { label: "Dealflow Triage", path: "/dealflow-triage", icon: Filter },
      { label: "Meeting Preparation", path: "/meeting-prep", icon: Calendar },
      { label: "CRM Hygiene", path: "/crm-hygiene", icon: Database },
      { label: "Research & Outbound", path: "/research-outbound", icon: Search },
      { label: "Portfolio & LP Ops", path: "/portfolio-lp", icon: Briefcase },
    ],
  },
  {
    title: "Management",
    items: [
      { label: "Agents Library", path: "/agents", icon: Box },
      { label: "Runs", path: "/runs", icon: Play },
      { label: "Audit Logs", path: "/audit", icon: FileText },
    ],
  },
  {
    title: "Configuration",
    items: [
      { label: "Settings", path: "/settings", icon: Settings },
    ],
  },
];

export const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-full bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-60" : "w-0"
        } transition-all duration-200 border-r border-sidebar-border bg-sidebar overflow-hidden flex-shrink-0`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="px-3 py-4 border-b border-sidebar-border flex items-center gap-2">
            <div className="w-6 h-6 bg-foreground" />
            <span className="font-semibold text-sm text-sidebar-primary">VC Agent Builder</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-2">
            {navSections.map((section) => (
              <div key={section.title} className="mb-4">
                <div className="px-3 py-1 text-xs font-medium text-sidebar-foreground uppercase tracking-wider">
                  {section.title}
                </div>
                <div className="mt-1 space-y-0.5">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                          `flex items-center gap-2 px-3 py-1.5 mx-1 text-sm transition-colors ${
                            isActive
                              ? "bg-sidebar-accent text-sidebar-primary font-medium"
                              : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                          }`
                        }
                      >
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        <span>{item.label}</span>
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-12 border-b border-border flex items-center px-3 gap-3 flex-shrink-0 bg-background">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="h-7 w-7 text-grey-600 hover:bg-grey-100"
          >
            {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>

          <div className="flex-1 max-w-2xl">
            <input
              type="text"
              placeholder="Type to create or search workflows..."
              className="w-full px-3 py-1.5 text-sm border border-input bg-background text-foreground placeholder:text-grey-400 focus:outline-none focus:border-grey-300 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="sm" className="h-7 text-xs text-grey-600 hover:bg-grey-100 hover:text-grey-900">
              Save
            </Button>
            <Button variant="ghost" size="sm" className="h-7 text-xs text-grey-600 hover:bg-grey-100 hover:text-grey-900">
              Preview
            </Button>
            <Button size="sm" className="h-7 bg-primary text-primary-foreground hover:bg-grey-800 text-xs px-3">
              Run
            </Button>
          </div>

          <div className="ml-2 flex items-center gap-2 px-2 py-1 text-xs text-grey-600">
            <div className="w-5 h-5 bg-grey-300" />
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-background">{children}</main>
      </div>
    </div>
  );
};
