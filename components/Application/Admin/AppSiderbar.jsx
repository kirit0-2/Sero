"use client"
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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
  const pathname = usePathname()

  const isActive = (url) => {
    if (url === '#') return false
    return pathname === url || pathname.startsWith(url + '/')
  }

  return (
    <Sidebar className="border-r">
      {/* Header with Logo */}
      <SidebarHeader className="h-16 border-b">
        <div className="flex items-center justify-center px-4 h-full">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <Image
              src={logoBlack}
              alt="E-store Logo"
              width={100}
              height={32}
              className="h-8 w-auto dark:hidden"
              priority
            />
            <Image
              src={logoWhite}
              alt="E-store Logo"
              width={100}
              height={32}
              className="h-8 w-auto hidden dark:block"
              priority
            />
          </Link>
        </div>
      </SidebarHeader>
      
      {/* Navigation Menu */}
      <SidebarContent className="px-2 py-4">
        <SidebarMenu className="space-y-1">
          {AdminSidebarMenu.map((menu, index) => (
            <Collapsible key={index} className="group/collapsible">
              <SidebarMenuItem>
                {menu.submenu && menu.submenu.length > 0 ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton 
                        className="w-full hover:bg-accent hover:text-accent-foreground transition-colors"
                        tooltip={menu.title}
                      >
                        <menu.icon className="h-5 w-5 shrink-0" />
                        <span className="flex-1 text-left">{menu.title}</span>
                        <LuChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-1">
                      <SidebarMenuSub className="ml-4 border-l pl-4 space-y-1">
                        {menu.submenu.map((submenuItem, subMenuIndex) => (
                          <SidebarMenuSubItem key={subMenuIndex}>
                            <SidebarMenuSubButton 
                              asChild
                              isActive={isActive(submenuItem.url)}
                              className="hover:bg-accent hover:text-accent-foreground transition-colors"
                            >
                              <Link 
                                href={submenuItem.url} 
                                onClick={() => setOpenMobile(false)}
                                className="flex items-center gap-2"
                              >
                                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                {submenuItem.title}
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : (
                  <SidebarMenuButton 
                    asChild
                    isActive={isActive(menu.url)}
                    tooltip={menu.title}
                    className="hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <Link 
                      href={menu.url} 
                      onClick={() => setOpenMobile(false)}
                      className="flex items-center gap-3"
                    >
                      <menu.icon className="h-5 w-5 shrink-0" />
                      <span>{menu.title}</span>
                    </Link>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t p-4">
        <div className="text-center">
          <p className="text-sm font-semibold text-muted-foreground">Admin Panel</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}