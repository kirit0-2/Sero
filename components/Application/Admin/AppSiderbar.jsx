"use client"
import Image from 'next/image'
import Link from 'next/link'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { AdminSidebarMenu } from "@/lib/adminSidebarMenu"
import logoBlack from '@/public/assets/images/logo-black.png'
import logoWhite from '@/public/assets/images/logo-white.png'
import { LuChevronRight } from "react-icons/lu"
import { useSidebar } from "@/components/ui/sidebar"

export function AppSidebar() {
  const { setOpenMobile } = useSidebar()

  return (
    <Sidebar>
      <SidebarHeader className="p-0 h-16 border-b">
        <div className="flex justify-between items-center px-4 h-full">
          <Image
            src={logoBlack}
            alt="Logo"
            width={120}
            height={40}
            className="h-10 w-auto dark:hidden"
          />
          <Image
            src={logoWhite}
            alt="Logo"
            width={120}
            height={40}
            className="h-10 w-auto hidden dark:block"
          />
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
          {AdminSidebarMenu.map((menu, index) => (
            <Collapsible key={index} className="group/collapsible">
              <SidebarMenuItem>
                {menu.submenu && menu.submenu.length > 0 ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton>
                        <menu.icon className="h-4 w-4" />
                        <span>{menu.title}</span>
                        <LuChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {menu.submenu.map((submenuItem, subMenuIndex) => (
                          <SidebarMenuSubItem key={subMenuIndex}>
                            <SidebarMenuSubButton asChild>
                              <Link href={submenuItem.url} onClick={() => setOpenMobile(false)}>
                                {submenuItem.title}
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : (
                  <SidebarMenuButton asChild>
                    <Link href={menu.url} onClick={() => setOpenMobile(false)}>
                      <menu.icon className="h-4 w-4" />
                      <span>{menu.title}</span>
                    </Link>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}