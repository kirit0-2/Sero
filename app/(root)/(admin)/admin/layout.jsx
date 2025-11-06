import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/Application/Admin/AppSiderbar'
import ProtectedAdminRoute from '@/components/Application/Admin/ProtectedAdminRoute'
import TopBar from '@/components/Application/Admin/TopBar'
import React from 'react'

const AdminLayout = ({ children }) => {
    return (
        <ProtectedAdminRoute>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <TopBar />
                    <main className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                        {children}
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </ProtectedAdminRoute>
    )
}

export default AdminLayout