"use client"
import React from 'react'
import SearchBar from './SearchBar'
import ThemeSwitch from './ThemeSwitch'
import UserDropdown from './UserDropdown'
import { SidebarTrigger } from '@/components/ui/sidebar'

const TopBar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-4">
        {/* Sidebar Trigger - Always visible */}
        <SidebarTrigger className="-ml-1" />
        
        {/* Page Title */}
        <div className="hidden sm:block">
          <h2 className="text-lg font-semibold">AdminDashboard</h2>
        </div>

        {/* Search Bar */}
        <div className="flex-1 flex justify-center">
          <SearchBar />
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          <ThemeSwitch />
          <UserDropdown />
        </div>
      </div>
    </header>
  )
}

export default TopBar