import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/Application/Admin/AppSiderbar'
import ProtectedAdminRoute from '@/components/Application/Admin/ProtectedAdminRoute'
import React from 'react'

const AdminLayout = ({ children }) => {
    return (
        <ProtectedAdminRoute>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                        <SidebarTrigger className="-ml-1" />
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg font-semibold">Admin Dashboard</h1>
                        </div>
                    </header>
                    <main className="flex flex-1 flex-col gap-4 p-4">
                        {children}
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </ProtectedAdminRoute>
    )
}

export default AdminLayout