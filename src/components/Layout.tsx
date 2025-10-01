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
  Settings,
  LogOut,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface LayoutProps {
  children: ReactNode;
}

const navSections = [
  {
    title: "Workflows",
    items: [
      { label: "Dashboard", path: "/", icon: LayoutDashboard },
    ],
  },
  {
    title: "Management",
    items: [
      { label: "Runs", path: "/runs", icon: Play },
      { label: "Agents Library", path: "/agents", icon: Box },
    ],
  },
];

export const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, signOut } = useAuth();

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
            className="h-7 w-7 text-muted-foreground hover:bg-accent"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>

          <div className="ml-auto flex items-center gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 px-2 gap-2">
                    <User className="h-4 w-4" />
                    <span className="text-xs">{user.email?.split('@')[0]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem disabled className="text-xs">
                    {user.email}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-xs">
                    <LogOut className="h-3 w-3 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild size="sm" variant="outline" className="h-8 text-xs">
                <NavLink to="/auth">Sign in</NavLink>
              </Button>
            )}
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-background">{children}</main>
      </div>
    </div>
  );
};
