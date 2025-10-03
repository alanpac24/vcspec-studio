import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Box, 
  Play,
  ChevronRight,
  User,
  LogOut
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { workflowCategories } from "@/config/workflows";

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const currentPath = location.pathname;

  const isCollapsed = state === "collapsed";

  const quickAccessItems = [
    { label: "Dashboard", path: "/", icon: LayoutDashboard },
  ];

  const managementItems = [
    { label: "Agents Library", path: "/agents", icon: Box },
    { label: "Runs", path: "/runs", icon: Play },
  ];

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      {/* Header */}
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-foreground flex-shrink-0" />
          {!isCollapsed && (
            <span className="font-semibold text-sm text-sidebar-primary">
              Vibe Business
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="py-2">
        {/* Quick Access */}
        <SidebarGroup>
          <SidebarGroupLabel>Quick Access</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {quickAccessItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild isActive={isActive(item.path)}>
                      <NavLink to={item.path}>
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Workflow Categories */}
        {workflowCategories.map((category) => {
          const hasActiveWorkflow = category.workflows.some((w) =>
            isActive(w.path)
          );

          return (
            <Collapsible
              key={category.title}
              defaultOpen={hasActiveWorkflow}
              className="group/collapsible"
            >
              <SidebarGroup>
                <SidebarGroupLabel asChild>
                  <CollapsibleTrigger className="flex items-center justify-between w-full hover:bg-sidebar-accent px-2 py-1.5 rounded-sm transition-colors">
                    <span className="text-xs uppercase tracking-wider">
                      {category.title}
                    </span>
                    <ChevronRight className="h-3 w-3 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {category.workflows.map((workflow) => (
                        <SidebarMenuItem key={workflow.path}>
                          <SidebarMenuButton
                            asChild
                            isActive={isActive(workflow.path)}
                          >
                            <NavLink to={workflow.path}>
                              <span className="text-base">{workflow.emoji}</span>
                              <span className="text-xs">{workflow.title}</span>
                            </NavLink>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          );
        })}

        {/* Management */}
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild isActive={isActive(item.path)}>
                      <NavLink to={item.path}>
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with User */}
      {user && (
        <SidebarFooter className="border-t border-sidebar-border p-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 h-9"
              >
                <User className="h-4 w-4" />
                {!isCollapsed && (
                  <span className="text-xs truncate">
                    {user.email?.split("@")[0]}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
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
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
