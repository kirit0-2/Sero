import { Checkbox } from "@/components/ui/checkbox";
import React from 'react'
import Image, { Link } from 'next/image'
import { HiOutlineDotsVertical } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import { LuLink } from "react-icons/lu";
import { MdOutlineEdit } from "react-icons/md";
import { Admin_Media_Edit } from '@/routes/Admin'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";


const Media = ({ media, handleDelete, deleteType, selectMedia, setSelectedMedia }) => {
    const handleCheck = () => {
        let newSelectedMedia = []  
        if (selectMedia.includes(media._id)) {
            newSelectedMedia = newSelectedMedia.filter(m => m !== media._id)
        } else {
            newSelectedMedia = [...newSelectedMedia, media._id]
        }
        setSelectedMedia(newSelectMedia)
    } 
    const handleCopyLink = () => {
        navigator.clipboard.writeText(media?.secure_url)
    }
    return (
        <div
            className={`
                relative group rounded-xl overflow-hidden cursor-pointer transition-all duration-300
                border-2 ${selectMedia.includes(media._id) ? 'border-primary shadow-md' : 'border-transparent hover:border-gray-200 dark:hover:border-gray-800'}
            `}
            onClick={() => {
                if (selectMedia.includes(media._id)) {
                    setSelectedMedia((prev) => prev.filter((id) => id !== media._id))
                } else {
                    setSelectedMedia((prev) => [...prev, media._id])
                }
            }}
        >
            {/* Selection Overlay */}
            <div className={`
                absolute inset-0 bg-black/40 z-10 transition-opacity duration-200
                ${selectMedia.includes(media._id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
            `} />

            {/* Checkbox */}
            <div className={`
                absolute top-3 left-3 z-20 transition-all duration-200
                ${selectMedia.includes(media._id) ? 'opacity-100 scale-100' : 'opacity-0 group-hover:opacity-100 group-hover:scale-100'}
            `}>
                <Checkbox
                    checked={selectMedia.includes(media._id)}
                    onCheckedChange={handleCheck}
                    className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground border-white/50 bg-black/20"
                />
            </div>
            {/* Vertical Dots Menu */}
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <div className="w-6 h-6 flex items-center justify-center rounded-full bg-black/20 text-white/80 hover:bg-black/40 cursor-pointer">
                        <HiOutlineDotsVertical />
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    {deleteType === "SD" &&
                        <>
                            <DropdownMenuItem asChild className="cursor-pointer">
                                <Link href={Admin_Media_Edit(media._id)}>
                                    <MdOutlineEdit />
                                    Edit
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                                <LuLink />
                                <span onClick={handleCopyLink}>Copy Link</span>
                            </DropdownMenuItem>

                        </>
                    }
                    <DropdownMenuItem className="cursor-pointer">
                        <MdDelete color="red" />
                        {deleteType === "SD" ? "Move to Trash" : "Delete Permanently"}
                    </DropdownMenuItem>

                </DropdownMenuContent>
            </DropdownMenu>
            <div className={`
                absolute top-3 right-3 z-20 transition-all duration-200
                ${selectMedia.includes(media._id) ? 'opacity-100 scale-100' : 'opacity-0 group-hover:opacity-100 group-hover:scale-100'}
            `}>
                {/* Placeholder for vertical dots icon or component */}
            </div>

            {/* Image Container */}
            <div className="aspect-square w-full relative bg-gray-100 dark:bg-gray-900">
                <Image
                    src={media?.secure_url}
                    alt={media?.alt || "Media Item"}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
            </div>

            {/* Info Overlay (Bottom) */}
            <div className="absolute bottom-0 left-0 right-0 p-3 z-20 bg-linear-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-xs font-medium truncate">
                    {media?.title || media?.original_filename || "Untitled"}
                </p>
                {media?.file_size && (
                    <p className="text-white/70 text-[10px] uppercase tracking-wider mt-0.5">
                        {(media?.file_size / 1024).toFixed(1)} KB
                    </p>
                )}
            </div>
        </div>
    )
}

export default Media