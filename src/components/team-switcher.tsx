"use client"

import * as React from "react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar"
import AppLogo from '@/assets/images/logo.png'
import { useLocation, useNavigate } from "react-router-dom";

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string
    logo: React.ElementType
    plan: string
  }[]
}) {
  const [activeTeam] = React.useState(teams[0])
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"
  const location = useLocation();
  const navigate = useNavigate();

  if (!activeTeam) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          onClick={() => {
            if (location.pathname === "/dashboard") {
              navigate('/');
            } else {
              navigate('/dashboard');
            }
          }}
          className={`data-[state=open]:bg-sidebar-accent hover:bg-transparent cursor-pointer data-[state=open]:text-sidebar-accent-foreground ${isCollapsed ? 'justify-start' : 'justify-center my-3'}`}
        >
          <img
            src={AppLogo}
            alt="logo"
            className={isCollapsed ? "w-8 h-auto" : "h-[50px] w-auto"}
          />

        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
