"use client"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { useDispatch } from "react-redux"
import { logout } from "@/store/reducer/authReducer"
import { useRouter } from "next/navigation"
import { showToast } from "@/lib/showToast"
import { LuUser, LuLogOut } from "react-icons/lu"

const UserDropdown = () => {
    const { userName } = useAuth()
    const dispatch = useDispatch()
    const router = useRouter()

    const handleLogout = () => {
        dispatch(logout())
        showToast('success', 'Logged out successfully')
        router.push('/auth/login')
    }

    // Get first name only
    const firstName = userName?.split(' ')[0] || 'Admin'

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <LuUser className="h-4 w-4" />
                    <span className="hidden sm:inline">{firstName}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{firstName}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            Admin Account
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <LuUser className="mr-2 h-4 w-4" />
                    Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LuLogOut className="mr-2 h-4 w-4" />
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserDropdown
