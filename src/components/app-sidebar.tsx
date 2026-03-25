"use client"

import * as React from "react"
import {
  Calendar,
  DollarSign,
  GalleryVerticalEnd,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Bell,
  BarChart3,
  Folder,
  LogOut,
  Shield,
  Users,
  FolderKanban,
  Briefcase,
  TrendingUp,
  Award,
  MessageSquare,
  House,
  Wallet,
} from "lucide-react"

import { NavMain } from "@/components/nav-main";
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import { GrBusinessService } from "react-icons/gr"
import { useReduxAuth } from "@/hooks/use-auth"
import { useGetConversations } from "@/hooks/use-message"
import { useSocket } from "@/context/socket-context"
import { useQueryClient } from "@tanstack/react-query"

const getRoleBasedMenuItems = (role: string, unreadCount: number = 0) => {
  const messageBadge = unreadCount > 0 ? (
    <div className="bg-destructive text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full ml-auto">
      {unreadCount}
    </div>
  ) : undefined;
  const menuItems = {
    contractor: [
      { title: "Dashboard", url: "", icon: LayoutDashboard },
      { title: "My Jobs", url: "/jobs", icon: Briefcase },
      { title: "Opportunites", url: "/opportunities", icon: TrendingUp },
      { title: "Wallet", url: "/wallet", icon: Wallet },
      { title: "Escrow & Payments", url: "/escrow-payments", icon: ShoppingCart },
      { title: "Certifications", url: "/certifications", icon: Award },
      { title: "Earnings", url: "/earnings", icon: DollarSign },
      { title: "Messages", url: "/messages", icon: MessageSquare, badge: messageBadge },
    ],
    user: [
      { title: "Dashboard", url: "", icon: LayoutDashboard },
      { title: "Properties", url: "/properties", icon: House },
      { title: "Projects", url: "/projects", icon: FolderKanban },
      { title: "Contractors", url: "/contractors", icon: Users },
      { title: "Messages", url: "/messages", icon: MessageSquare, badge: messageBadge },
      { title: "Wallet", url: "/wallet", icon: Wallet },
      { title: "Escrow & Payments", url: "/escrow-payments", icon: ShoppingCart },
      { title: "Risk Monitor", url: "/risk-monitor", icon: Shield },
      { title: "Reports", url: "/reports", icon: BarChart3 },
    ],
    admin: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
      { title: "Category", url: "/admin/category", icon: Folder },
      { title: "Service Management", url: "/services", icon: GrBusinessService },
      { title: "Inventory Management", url: "/inventory", icon: Package },
      { title: "Orders", url: "/admin/orders", icon: ShoppingCart },
      { title: "Bookings", url: "/admin/bookings-management", icon: Calendar },
      { title: "Financial Management", url: "/admin/finance", icon: DollarSign },
      { title: "Notifications", url: "/admin/notifications", icon: Bell },
      { title: "Reports", url: "/admin/reports", icon: BarChart3 },
      { title: "Settings", url: "/admin/settings", icon: Settings },
    ]
  };

  return menuItems[role as keyof typeof menuItems] || menuItems.user;
};

const data = {
  teams: [
    {
      name: "Riskfeed",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useReduxAuth();
  const userRole = user?.user?.role || "user";

  const { data: conversationsData } = useGetConversations({ limit: 50, page: 1 });
  const conversations = conversationsData?.items || [];
  const unreadCount = conversations.reduce((acc: number, conv: { unreadCount?: number }) => acc + (conv.unreadCount || 0), 0);


  const menuItems = getRoleBasedMenuItems(userRole, unreadCount);

  const queryClient = useQueryClient();
  const { addNewMessageListener, removeNewMessageListener, addMessageReadListener, removeMessageReadListener } = useSocket();

  React.useEffect(() => {
    const handleUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    };

    addNewMessageListener(handleUpdate);
    addMessageReadListener(handleUpdate);

    return () => {
      removeNewMessageListener(handleUpdate);
      removeMessageReadListener(handleUpdate);
    };
  }, [addNewMessageListener, removeNewMessageListener, addMessageReadListener, removeMessageReadListener, queryClient]);

  const [showLogoutDialog, setShowLogoutDialog] = React.useState(false);
  const navigate = useNavigate();
  const { state, setOpenMobile } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={menuItems} onItemClick={() => setOpenMobile(false)} />
      </SidebarContent>
      <SidebarFooter>
        {/* <NavUser user={{ name: user?.firstName || "Codre", email: user?.email || "codre@gmail.com", avatar: user?.profilePicture || ""}} /> */}
        {!isCollapsed ? (
          <button
            onClick={() => setShowLogoutDialog(true)}
            className="w-full bg-[#ffe5e5] text-[#ff4b4b] border-2 border-[#ffb3b3] rounded-lg font-inter font-bold text-base py-2 flex items-center justify-center gap-2 transition duration-200 cursor-pointer outline-none hover:bg-[#ffd6d6] h-12"
          >
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAZCAYAAAArK+5dAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGRSURBVHgB3VVLTsMwEH0OFWLZG1Bu4CUCJJoTACeocgK4QcoJOELCScgCEBILwg1yhK6hrZlxrdT52K2VFX1S+hk779lvPGPgv0O0A2oqx/jB7TaABZaoxGdZYqiAupApReaOuRVWiMVHWSEAo5r8XE4NeUWrfsQRrZxXv8aE4lOKzyiW0neCANQCiIwtAol4K4vWvJx2d22EghBZv081/2uH3MYCgdjuQGDsJVgjxkl3nHYm8UuvOw6BvQOvACdXFGV3XCDDMb7UpZz5BZQWCIfSSWfhvE8kwkCId7JGkX0OkdG+RNprQHqm5PQ8GBHQSXwOEtBe+wVssFCgwAp3NHviHFda/AnQBVoX494CpkVUvdxsn9BVzuSxzovB4CQb8pfNnyZ5U0CEV6l5L3ORM2yLWGAC30r7KpZzQxXeW4QNAe6c1C74PvBULBfjWSO8o33bOfjWn0vHUVQ7epUDdrsuiCSlJyM7+AxXNXGEG2zsyxGI5o12JedEeA/09qWC/E5Cb7T+O7lt0wilK4mHjz+zg5Q82WFjiAAAAABJRU5ErkJggg=="
              alt="Log Out"
              width={18}
              height={18}
            />
            Logout
          </button>
        ) : (
          <>
            <Tooltip>
              <TooltipTrigger className="">
                <Button
                  variant="ghost"
                  onClick={() => setShowLogoutDialog(true)}
                  className="cursor-pointer bg-[#ffe5e5] text-[#ff4b4b] border-2 border-[#ffb3b3] hover:bg-[#ffd6d6] transition duration-200 h-12 w-12"
                >
                  <LogOut className="size-4 text-[#ff4b4b] " />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Logout</p>
              </TooltipContent>
            </Tooltip>

          </>

        )}

        <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to log out of your account?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive hover:bg-destructive/80" onClick={() => navigate("/logout")}>
                Logout
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
