import { ChevronRight, type LucideIcon } from "lucide-react"
import { useLocation } from "react-router-dom"
import { type IconType } from "react-icons"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Link } from "react-router-dom"

export function NavMain({
  items,
  onItemClick,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon | IconType;
    isActive?: boolean
    badge?: React.ReactNode
    items?: {
      title: string
      url: string
    }[]
  }[]
  onItemClick?: () => void
}) {
  const location = useLocation()
  const isItemActive = (itemUrl: string) => itemUrl === "" ? location.pathname === "/" : location.pathname.startsWith(itemUrl);
  
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = isItemActive(item.url);
          
          if (item.items && item.items.length > 0) {
            return (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="h-12" tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => {
                        const isSubActive = location.pathname === subItem.url
                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild isActive={isSubActive}>
                              <Link to={subItem.url} onClick={onItemClick}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            )
          }
          
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title} isActive={isActive} className="h-10">
                <Link to={item.url} onClick={onItemClick} className="flex items-center w-full">
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  {item.badge}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
