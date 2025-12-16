"use client"
import { Input } from "@/components/ui/input"
import { LuSearch } from "react-icons/lu"

const SearchBar = () => {
    return (
        <div className="relative w-full max-w-sm">
            <LuSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Search component"
                className="pl-9"
            />
        </div>
    )
}

export default SearchBar
