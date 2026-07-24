"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"

import { NavUser } from "@/components/nav-user"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { 
  Activity, 
  DatabaseIcon, 
  SparklesIcon, 
  MessageSquareIcon, 
  Building2Icon, 
  UsersIcon, 
  CreditCardIcon, 
  SettingsIcon, 
  InfoIcon 
} from "lucide-react"

const data = {
  user: {
    name: "Federal Guest",
    email: "Trial Sandbox",
    avatar: "", // Will use the user icon
  },
  navCore: [
    {
      title: "Data Explorer",
      url: "/dashboard",
      icon: <DatabaseIcon />,
    },
    {
      title: "AI Bid Analyst",
      url: "/dashboard/ai-analyst",
      icon: <SparklesIcon />,
    },
    {
      title: "Ask FedPulse",
      url: "/dashboard/ask-fedpulse",
      icon: <MessageSquareIcon />,
    },
  ],
  navMarket: [
    {
      title: "Departments",
      url: "/dashboard/departments",
      icon: <Building2Icon />,
    },
    {
      title: "Incumbent Suppliers",
      url: "/dashboard/suppliers",
      icon: <UsersIcon />,
    },
  ],
  navSecondary: [
    {
      title: "Pricing & Plans",
      url: "/pricing",
      icon: <CreditCardIcon />,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: <SettingsIcon />,
    },
    {
      title: "About FedPulse",
      url: "/about",
      icon: <InfoIcon />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props} className="border-r border-[#e6ebf1] bg-white">
      <SidebarHeader className="border-b border-[#e6ebf1] p-5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<Link href="/dashboard" />}
            >
              <div className="flex items-center space-x-2.5 cursor-pointer group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#635bff] to-[#e056fd] flex items-center justify-center text-white shadow-stripe-sm group-hover:scale-105 transition-transform">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-extrabold tracking-tight text-[#0a2540]">
                    Fed<span className="text-[#635bff]">Pulse</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono -mt-1">Procurement Intel</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-3 py-4 space-y-6">
        <div>
          <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Core Intelligence
          </div>
          <NavMain items={data.navCore} />
        </div>
        <div>
          <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Market Data
          </div>
          <NavMain items={data.navMarket} />
        </div>
        <div className="mt-auto">
          <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Account & Support
          </div>
          <NavSecondary items={data.navSecondary} />
        </div>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
