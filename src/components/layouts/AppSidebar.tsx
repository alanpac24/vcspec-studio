import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Lightbulb,
  TrendingUp,
  Rocket,
  DollarSign,
  Building2,
  BarChart3,
  User,
  LogOut,
  ChevronRight,
  Box,
  Play
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
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

// Category icons mapping
const categoryIcons: Record<string, any> = {
  "Product": Lightbulb,
  "Market": TrendingUp,
  "Growth": Rocket,
  "Finance": DollarSign,
  "Operations": Building2,
  "Analytics": BarChart3
};

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const currentPath = location.pathname;

  const isCollapsed = state === "collapsed";
  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar collapsible="icon" className="border-r bg-background">
      {/* Header */}
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-primary rounded flex-shrink-0" />
          {!isCollapsed && (
            <span className="font-semibold text-base">
              Vibe Business
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {/* Dashboard Link */}
        <SidebarGroup className="mb-2">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={isActive("/")}
                  className="h-9 text-sm"
                >
                  <NavLink to="/" className="flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    {!isCollapsed && <span>Dashboard</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Workflow Categories */}
        {workflowCategories.map((category) => {
          const CategoryIcon = categoryIcons[category.title] || Lightbulb;
          const hasActiveWorkflow = category.workflows.some((w) =>
            isActive(w.path)
          );

          return (
            <Collapsible
              key={category.title}
              defaultOpen={hasActiveWorkflow}
              className="group/collapsible mb-1"
            >
              <SidebarGroup>
                <SidebarGroupLabel asChild>
                  <CollapsibleTrigger className="flex items-center justify-between w-full hover:bg-sidebar-accent px-2 py-1.5 rounded-md transition-colors">
                    <div className="flex items-center gap-2">
                      <CategoryIcon className="h-3.5 w-3.5" />
                      <span className="text-xs font-medium">
                        {category.title}
                      </span>
                    </div>
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
                            className="h-8 pl-7 text-xs"
                          >
                            <NavLink to={workflow.path} className="flex items-center gap-2">
                              <span className="text-xs">{workflow.emoji}</span>
                              <span>{workflow.title}</span>
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

        {/* Management Section */}
        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground mb-1">
            MANAGEMENT
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={isActive("/agents")}
                  className="h-8 text-xs"
                >
                  <NavLink to="/agents" className="flex items-center gap-2">
                    <Box className="h-3.5 w-3.5" />
                    {!isCollapsed && <span>Agents Library</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={isActive("/runs")}
                  className="h-8 text-xs"
                >
                  <NavLink to="/runs" className="flex items-center gap-2">
                    <Play className="h-3.5 w-3.5" />
                    {!isCollapsed && <span>Runs</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with User */}
      {user && (
        <SidebarFooter className="p-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 h-9"
              >
                <User className="h-4 w-4" />
                {!isCollapsed && (
                  <span className="text-sm truncate">
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