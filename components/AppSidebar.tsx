"use client";

import * as React from "react";
import { Package, LogOut, LayoutDashboard, UserCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarRail,
} from "@/components/ui/sidebar";
import { BrandLogo } from "@/components/BrandLogo";
import type { Role, Session } from "@/lib/types/auth";
import { logout } from "@/app/actions/auth";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: Session;
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const pathname = usePathname();

  const routes = React.useMemo(() => {
    const allRoutes: {
      title: string;
      url: string;
      icon: typeof LayoutDashboard;
      roles: Role[];
    }[] = [
      {
        title: "Analytics",
        url: "/analytics",
        icon: LayoutDashboard,
        roles: ["admin"],
      },
      {
        title: "Products",
        url: "/products",
        icon: Package,
        roles: ["admin", "user"],
      },
      {
        title: "Profile",
        url: "/profile",
        icon: UserCircle,
        roles: ["admin", "user"],
      },
    ];

    return allRoutes.filter((route) => route.roles.includes(user.role));
  }, [user.role]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/products" className="flex items-center gap-2">
                <BrandLogo className="size-9 transition-[width,height] group-data-[collapsible=icon]:size-8" />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Alpha</span>
                  <span className="truncate text-xs text-sidebar-foreground/60">
                    {user.role === "admin" ? "Admin" : "User"}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {routes.map((route) => (
                <SidebarMenuItem key={route.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === route.url}
                    tooltip={route.title}
                  >
                    <Link href={route.url}>
                      <route.icon />
                      <span>{route.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => logout()} tooltip="Log out">
              <LogOut />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
