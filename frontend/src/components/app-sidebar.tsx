"use client";

import * as React from "react";
import { Package2, LayoutGrid, Image } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Product",
      url: "#",
      icon: Package2,
      isActive: true,
      items: [
        {
          title: "Add Product",
          url: "#",
        },
        {
          title: "All Products",
          url: "#",
        },
      ],
    },
    {
      title: "Category",
      url: "#",
      icon: LayoutGrid,
      items: [
        {
          title: "Add Category",
          url: "#",
        },
        {
          title: "All Category",
          url: "#",
        },
      ],
    },
    {
      title: "Banner",
      url: "#",
      icon: Image,
      items: [
        {
          title: "Add Banner",
          url: "#",
        },
        {
          title: "All Banner",
          url: "#",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const userDetails = useSelector((state: RootState) => state.user.userDetails);
  const user = {
    name: userDetails?.fullName,
    email: userDetails?.email,
    avatar: userDetails?.avatar,
  };
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
