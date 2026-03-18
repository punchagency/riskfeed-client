import { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Outlet, Link } from "react-router-dom";
import { ChevronDown, Moon, Sun, User, Bell, Settings, LogOut, ChevronUp } from "lucide-react";
import { useLogout, useReduxAuth } from "@/hooks/use-auth";
import { useReduxTheme } from "@/hooks/useReduxTheme";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SocketProvider } from "@/context/socket-context";

export default function DashboardLayout() {
  const { user } = useReduxAuth();
  const { theme, toggleTheme } = useReduxTheme();
  const logout = useLogout();
  const [open, setOpen] = useState(false);

  const getInitials = () => {
    if (user?.user?.firstName && user?.user?.lastName) {
      return `${user.user.firstName[0]}${user.user.lastName[0]}`.toUpperCase();
    }
    return user?.user?.firstName?.[0]?.toUpperCase() || "U";
  };

  const handleLogout = () => {
    logout.mutate();
    setOpen(false);
  };

  return (
    <SocketProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-14 sm:h-16 shrink-0 sticky top-0 z-50 bg-card items-center justify-between px-2 sm:px-4 border-b shadow-sm">
            <div className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-1 sm:mr-2 h-4 hidden sm:block"
              />
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="h-11 w-11 rounded-xl"
              >
                {theme === 'dark' ? (
                  <Sun className="size-5" />
                ) : (
                  <Moon className="size-5" />
                )}
              </Button>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-2 border rounded-xl hover:bg-accent transition-colors">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.user?.profilePicture} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-col hidden md:flex items-start">
                      <span className="font-medium text-sm text-foreground leading-tight">
                        {user?.user?.firstName} {user?.user?.lastName}
                      </span>
                      <span className="text-xs text-muted-foreground leading-tight capitalize">
                        {user?.user?.role === "user" ? "Homeowner" : user?.user?.role}
                      </span>
                    </div>
                    {open ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> :<ChevronUp className="h-4 w-4 text-muted-foreground" />}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-0" align="end">
                  <div className="p-4 border-b">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.user?.profilePicture} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-foreground truncate">
                          {user?.user?.firstName} {user?.user?.lastName}
                        </p>
                        <span className="text-xs font-medium text-primary capitalize">
                          {user?.user?.role === "user" ? "Homeowner" : user?.user?.role}
                        </span>
                      </div>
                    </div>
                      <p className="text-xs text-muted-foreground truncate mt-2">
                        {user?.user?.email}
                      </p>
                  </div>
                  <div className="p-2">
                    <Link
                      to="/profile"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors"
                    >
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">My Profile</span>
                    </Link>
                    <Link
                      to="/notifications"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors"
                    >
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">Notifications</span>
                      {/* <span className="ml-auto bg-destructive text-destructive-foreground text-xs px-2 py-0.5 rounded-full">3</span> */}
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors"
                    >
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">Settings</span>
                    </Link>
                  </div>
                  <div className="p-2 border-t">
                    <button
                      onClick={handleLogout}
                      disabled={logout.isPending}
                      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-destructive/10 transition-colors w-full"
                    >
                      <LogOut className="h-4 w-4 text-destructive" />
                      <span className="text-sm text-destructive">
                        {logout.isPending ? 'Logging out...' : 'Log Out'}
                      </span>
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </header>
          <main className="flex-1 p-3 sm:p-4 md:p-6">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </SocketProvider>
  );
}
